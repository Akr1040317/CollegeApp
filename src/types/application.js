// Application Decision Types
export const DECISION_TYPES = {
  EARLY_DECISION: 'ED',
  EARLY_ACTION: 'EA', 
  RESTRICTIVE_EARLY_ACTION: 'REA',
  REGULAR_DECISION: 'RD',
  ROLLING: 'ROLLING'
};

// Application Status
export const APPLICATION_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
  DEFERRED: 'deferred'
};

// Task Types
export const TASK_TYPES = {
  APPLICATION: 'application',
  ESSAY: 'essay',
  RECOMMENDATION: 'recommendation',
  TRANSCRIPT: 'transcript',
  TEST_SCORES: 'test_scores',
  FINANCIAL_AID: 'financial_aid',
  INTERVIEW: 'interview',
  PORTFOLIO: 'portfolio',
  OTHER: 'other'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Application Data Structure
export const APPLICATION_FIELDS = {
  // Basic Information
  id: { type: 'string', required: true },
  student_id: { type: 'string', required: true },
  college_id: { type: 'string', required: true },
  college_name: { type: 'string', required: true },
  
  // Decision Information
  decision_type: { type: 'string', options: Object.values(DECISION_TYPES), required: true },
  application_deadline: { type: 'date', required: true },
  decision_release_date: { type: 'date', required: false },
  
  // Status Tracking
  status: { type: 'string', options: Object.values(APPLICATION_STATUS), required: true, default: APPLICATION_STATUS.NOT_STARTED },
  submission_date: { type: 'date', required: false },
  decision_date: { type: 'date', required: false },
  
  // User Preferences
  priority: { type: 'string', options: Object.values(PRIORITY_LEVELS), required: false, default: PRIORITY_LEVELS.MEDIUM },
  notes: { type: 'string', required: false },
  
  // Requirements
  requires_essay: { type: 'boolean', required: false, default: true },
  requires_recommendations: { type: 'boolean', required: false, default: true },
  requires_interview: { type: 'boolean', required: false, default: false },
  requires_portfolio: { type: 'boolean', required: false, default: false },
  requires_supplemental_essays: { type: 'boolean', required: false, default: false },
  
  // Financial Information
  application_fee: { type: 'number', required: false },
  fee_waiver_applied: { type: 'boolean', required: false, default: false },
  
  // Timestamps
  created_at: { type: 'timestamp', required: true },
  updated_at: { type: 'timestamp', required: true }
};

// Task Data Structure
export const TASK_FIELDS = {
  // Basic Information
  id: { type: 'string', required: true },
  application_id: { type: 'string', required: true },
  student_id: { type: 'string', required: true },
  
  // Task Details
  title: { type: 'string', required: true },
  description: { type: 'string', required: false },
  task_type: { type: 'string', options: Object.values(TASK_TYPES), required: true },
  
  // Timeline
  due_date: { type: 'date', required: true },
  completed_date: { type: 'date', required: false },
  
  // Status
  is_completed: { type: 'boolean', required: true, default: false },
  priority: { type: 'string', options: Object.values(PRIORITY_LEVELS), required: false, default: PRIORITY_LEVELS.MEDIUM },
  
  // Additional Info
  notes: { type: 'string', required: false },
  assigned_to: { type: 'string', required: false }, // e.g., "student", "counselor", "teacher"
  
  // Timestamps
  created_at: { type: 'timestamp', required: true },
  updated_at: { type: 'timestamp', required: true }
};

// Timeline Event Structure
export const TIMELINE_EVENT_FIELDS = {
  // Basic Information
  id: { type: 'string', required: true },
  student_id: { type: 'string', required: true },
  
  // Event Details
  title: { type: 'string', required: true },
  description: { type: 'string', required: false },
  event_type: { type: 'string', options: ['deadline', 'reminder', 'milestone', 'decision'], required: true },
  
  // Timeline
  event_date: { type: 'date', required: true },
  is_all_day: { type: 'boolean', required: false, default: true },
  start_time: { type: 'time', required: false },
  end_time: { type: 'time', required: false },
  
  // Related Data
  college_name: { type: 'string', required: false },
  application_id: { type: 'string', required: false },
  task_id: { type: 'string', required: false },
  
  // Status
  is_completed: { type: 'boolean', required: true, default: false },
  is_important: { type: 'boolean', required: false, default: false },
  
  // Notifications
  reminder_sent: { type: 'boolean', required: false, default: false },
  reminder_days_before: { type: 'number', required: false, default: 7 },
  
  // Timestamps
  created_at: { type: 'timestamp', required: true },
  updated_at: { type: 'timestamp', required: true }
};

// Helper Functions
export const getDecisionTypeLabel = (type) => {
  const labels = {
    [DECISION_TYPES.EARLY_DECISION]: 'Early Decision',
    [DECISION_TYPES.EARLY_ACTION]: 'Early Action',
    [DECISION_TYPES.RESTRICTIVE_EARLY_ACTION]: 'Restrictive Early Action',
    [DECISION_TYPES.REGULAR_DECISION]: 'Regular Decision',
    [DECISION_TYPES.ROLLING]: 'Rolling Admission'
  };
  return labels[type] || type;
};

export const getStatusLabel = (status) => {
  const labels = {
    [APPLICATION_STATUS.NOT_STARTED]: 'Not Started',
    [APPLICATION_STATUS.IN_PROGRESS]: 'In Progress',
    [APPLICATION_STATUS.SUBMITTED]: 'Submitted',
    [APPLICATION_STATUS.UNDER_REVIEW]: 'Under Review',
    [APPLICATION_STATUS.ACCEPTED]: 'Accepted',
    [APPLICATION_STATUS.REJECTED]: 'Rejected',
    [APPLICATION_STATUS.WAITLISTED]: 'Waitlisted',
    [APPLICATION_STATUS.DEFERRED]: 'Deferred'
  };
  return labels[status] || status;
};

export const getTaskTypeLabel = (type) => {
  const labels = {
    [TASK_TYPES.APPLICATION]: 'Application',
    [TASK_TYPES.ESSAY]: 'Essay',
    [TASK_TYPES.RECOMMENDATION]: 'Recommendation',
    [TASK_TYPES.TRANSCRIPT]: 'Transcript',
    [TASK_TYPES.TEST_SCORES]: 'Test Scores',
    [TASK_TYPES.FINANCIAL_AID]: 'Financial Aid',
    [TASK_TYPES.INTERVIEW]: 'Interview',
    [TASK_TYPES.PORTFOLIO]: 'Portfolio',
    [TASK_TYPES.OTHER]: 'Other'
  };
  return labels[type] || type;
};

export const getPriorityColor = (priority) => {
  const colors = {
    [PRIORITY_LEVELS.HIGH]: 'text-red-600 bg-red-50 border-red-200',
    [PRIORITY_LEVELS.MEDIUM]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [PRIORITY_LEVELS.LOW]: 'text-green-600 bg-green-50 border-green-200'
  };
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getStatusColor = (status) => {
  const colors = {
    [APPLICATION_STATUS.NOT_STARTED]: 'text-gray-600 bg-gray-50 border-gray-200',
    [APPLICATION_STATUS.IN_PROGRESS]: 'text-blue-600 bg-blue-50 border-blue-200',
    [APPLICATION_STATUS.SUBMITTED]: 'text-purple-600 bg-purple-50 border-purple-200',
    [APPLICATION_STATUS.UNDER_REVIEW]: 'text-orange-600 bg-orange-50 border-orange-200',
    [APPLICATION_STATUS.ACCEPTED]: 'text-green-600 bg-green-50 border-green-200',
    [APPLICATION_STATUS.REJECTED]: 'text-red-600 bg-red-50 border-red-200',
    [APPLICATION_STATUS.WAITLISTED]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [APPLICATION_STATUS.DEFERRED]: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

// Timeline Generation Functions
export const generateApplicationTimeline = (application) => {
  const timeline = [];
  const deadline = new Date(application.application_deadline);
  
  // Add application deadline
  timeline.push({
    id: `deadline-${application.id}`,
    title: `${application.college_name} Application Deadline`,
    description: `${getDecisionTypeLabel(application.decision_type)} deadline`,
    event_date: application.application_deadline,
    event_type: 'deadline',
    college_name: application.college_name,
    application_id: application.id,
    is_important: true
  });
  
  // Add essay deadlines (if required)
  if (application.requires_essay) {
    const essayDeadline = new Date(deadline);
    essayDeadline.setDate(essayDeadline.getDate() - 14); // 2 weeks before
    
    timeline.push({
      id: `essay-${application.id}`,
      title: `${application.college_name} Essay Deadline`,
      description: 'Personal statement and supplemental essays due',
      event_date: essayDeadline.toISOString().split('T')[0],
      event_type: 'deadline',
      college_name: application.college_name,
      application_id: application.id,
      is_important: true
    });
  }
  
  // Add recommendation deadlines
  if (application.requires_recommendations) {
    const recDeadline = new Date(deadline);
    recDeadline.setDate(recDeadline.getDate() - 21); // 3 weeks before
    
    timeline.push({
      id: `recommendations-${application.id}`,
      title: `${application.college_name} Recommendations Due`,
      description: 'Teacher and counselor recommendations due',
      event_date: recDeadline.toISOString().split('T')[0],
      event_type: 'deadline',
      college_name: application.college_name,
      application_id: application.id,
      is_important: true
    });
  }
  
  // Add decision release date
  if (application.decision_release_date) {
    timeline.push({
      id: `decision-${application.id}`,
      title: `${application.college_name} Decision Release`,
      description: `${getDecisionTypeLabel(application.decision_type)} decisions released`,
      event_date: application.decision_release_date,
      event_type: 'decision',
      college_name: application.college_name,
      application_id: application.id,
      is_important: true
    });
  }
  
  return timeline.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
};

export const generateTaskList = (application) => {
  const tasks = [];
  const deadline = new Date(application.application_deadline);
  
  // Application form task
  tasks.push({
    id: `app-form-${application.id}`,
    title: 'Complete Application Form',
    description: 'Fill out the main application form',
    task_type: TASK_TYPES.APPLICATION,
    due_date: application.application_deadline,
    priority: PRIORITY_LEVELS.HIGH,
    application_id: application.id
  });
  
  // Essay tasks
  if (application.requires_essay) {
    const essayDeadline = new Date(deadline);
    essayDeadline.setDate(essayDeadline.getDate() - 14);
    
    tasks.push({
      id: `essay-${application.id}`,
      title: 'Write Personal Statement',
      description: 'Complete the main personal statement essay',
      task_type: TASK_TYPES.ESSAY,
      due_date: essayDeadline.toISOString().split('T')[0],
      priority: PRIORITY_LEVELS.HIGH,
      application_id: application.id
    });
    
    if (application.requires_supplemental_essays) {
      tasks.push({
        id: `supp-essays-${application.id}`,
        title: 'Write Supplemental Essays',
        description: 'Complete college-specific supplemental essays',
        task_type: TASK_TYPES.ESSAY,
        due_date: essayDeadline.toISOString().split('T')[0],
        priority: PRIORITY_LEVELS.HIGH,
        application_id: application.id
      });
    }
  }
  
  // Recommendation tasks
  if (application.requires_recommendations) {
    const recDeadline = new Date(deadline);
    recDeadline.setDate(recDeadline.getDate() - 21);
    
    tasks.push({
      id: `rec-request-${application.id}`,
      title: 'Request Recommendations',
      description: 'Ask teachers and counselors for recommendations',
      task_type: TASK_TYPES.RECOMMENDATION,
      due_date: recDeadline.toISOString().split('T')[0],
      priority: PRIORITY_LEVELS.HIGH,
      application_id: application.id
    });
  }
  
  // Transcript task
  tasks.push({
    id: `transcript-${application.id}`,
    title: 'Submit Transcript',
    description: 'Request and submit official high school transcript',
    task_type: TASK_TYPES.TRANSCRIPT,
    due_date: application.application_deadline,
    priority: PRIORITY_LEVELS.MEDIUM,
    application_id: application.id
  });
  
  // Test scores task
  tasks.push({
    id: `test-scores-${application.id}`,
    title: 'Submit Test Scores',
    description: 'Send SAT/ACT scores to the college',
    task_type: TASK_TYPES.TEST_SCORES,
    due_date: application.application_deadline,
    priority: PRIORITY_LEVELS.MEDIUM,
    application_id: application.id
  });
  
  // Financial aid task
  tasks.push({
    id: `financial-aid-${application.id}`,
    title: 'Complete Financial Aid Forms',
    description: 'Submit FAFSA and CSS Profile if required',
    task_type: TASK_TYPES.FINANCIAL_AID,
    due_date: application.application_deadline,
    priority: PRIORITY_LEVELS.MEDIUM,
    application_id: application.id
  });
  
  return tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
};
