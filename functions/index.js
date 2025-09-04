import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

admin.initializeApp();
const db = admin.firestore();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Helper: Fetch tasks due in next N days or overdue
async function fetchDueTasks(daysAhead = 2) {
  const now = new Date();
  const ahead = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  // Assumes a 'tasks' collection with fields: student_id, start_date (ISO string), status
  const snapshot = await db.collection('tasks').get();
  const tasks = [];
  snapshot.forEach(doc => {
    const t = doc.data();
    if (!t || !t.start_date || !t.student_id) return;
    const start = new Date(t.start_date);
    const isCompleted = t.status === 'completed';
    if (isCompleted) return;
    const isOverdue = start < now;
    const isDueSoon = start >= now && start <= ahead;
    if (isOverdue || isDueSoon) {
      tasks.push({ id: doc.id, ...t, isOverdue, isDueSoon });
    }
  });
  return tasks;
}

// Helper: Group tasks by student
function groupByStudent(tasks) {
  const map = new Map();
  for (const t of tasks) {
    if (!map.has(t.student_id)) map.set(t.student_id, []);
    map.get(t.student_id).push(t);
  }
  return map;
}

// Helper: Get user email from Auth/Users collection
async function getUserEmail(uid) {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord.email || null;
  } catch (e) {
    // Fallback to users collection if present
    try {
      const doc = await db.collection('users').doc(uid).get();
      return doc.exists ? doc.data().email || null : null;
    } catch (_) {
      return null;
    }
  }
}

// Helper: Send email via SendGrid
async function sendEmail(to, subject, text) {
  if (!SENDGRID_API_KEY) {
    console.log('SENDGRID_API_KEY not set; skipping email to', to);
    return;
  }
  const msg = {
    to,
    from: 'no-reply@college-match.ai',
    subject,
    text,
  };
  await sgMail.send(msg);
}

// Scheduled function runs daily at 8am UTC
export const sendTaskReminders = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    const tasks = await fetchDueTasks(2);
    if (tasks.length === 0) return null;

    const byStudent = groupByStudent(tasks);
    for (const [studentId, studentTasks] of byStudent.entries()) {
      const email = await getUserEmail(studentId);
      if (!email) continue;

      const overdue = studentTasks.filter(t => t.isOverdue);
      const dueSoon = studentTasks.filter(t => t.isDueSoon);
      const lines = [];
      if (overdue.length) {
        lines.push(`Overdue tasks (${overdue.length}):`);
        overdue.slice(0, 10).forEach(t => lines.push(`- ${t.title || 'Task'} (${t.start_date})`));
      }
      if (dueSoon.length) {
        lines.push(`\nDue soon (next 2 days) (${dueSoon.length}):`);
        dueSoon.slice(0, 10).forEach(t => lines.push(`- ${t.title || 'Task'} (${t.start_date})`));
      }

      const subject = 'CollegeMatch – Task Reminders';
      const body = `Hi there,\n\nHere are your latest task reminders:\n\n${lines.join('\n')}\n\nGood luck!\nCollegeMatch AI`;
      try {
        await sendEmail(email, subject, body);
        console.log('Reminder email sent to', email);
      } catch (e) {
        console.error('Failed to send email to', email, e);
      }
    }
    return null;
  });


