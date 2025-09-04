// Calendar and Task Management Types

// Task Types
export const TASK_TYPES = {
  APPLICATION_DEADLINE: 'application_deadline',
  ESSAY_DEADLINE: 'essay_deadline',
  TEST_REGISTRATION: 'test_registration',
  TEST_DEADLINE: 'test_deadline',
  RECOMMENDATION_REQUEST: 'recommendation_request',
  RECOMMENDATION_DEADLINE: 'recommendation_deadline',
  FINANCIAL_AID: 'financial_aid',
  SCHOLARSHIP_DEADLINE: 'scholarship_deadline',
  INTERVIEW: 'interview',
  CAMPUS_VISIT: 'campus_visit',
  OTHER: 'other'
};

// Task Status
export const TASK_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Recurrence Patterns
export const RECURRENCE_PATTERNS = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  PUSH: 'push',
  IN_APP: 'in_app',
  SMS: 'sms'
};

// Calendar Event Data Structure
export const CALENDAR_EVENT_FIELDS = {
  // Basic Information
  id: { type: 'string', required: true },
  student_id: { type: 'string', required: true },
  title: { type: 'string', required: true },
  description: { type: 'string', required: false },
  
  // Timing
  start_date: { type: 'datetime', required: true },
  end_date: { type: 'datetime', required: false },
  all_day: { type: 'boolean', required: false, default: false },
  timezone: { type: 'string', required: false, default: 'UTC' },
  
  // Task Details
  task_type: { type: 'string', options: Object.values(TASK_TYPES), required: true },
  status: { type: 'string', options: Object.values(TASK_STATUS), required: true, default: TASK_STATUS.NOT_STARTED },
  priority: { type: 'string', options: Object.values(PRIORITY_LEVELS), required: true, default: PRIORITY_LEVELS.MEDIUM },
  
  // Related Entities
  college_id: { type: 'string', required: false },
  college_name: { type: 'string', required: false },
  application_id: { type: 'string', required: false },
  essay_id: { type: 'string', required: false },
  
  // Recurrence
  recurrence_pattern: { type: 'string', options: Object.values(RECURRENCE_PATTERNS), required: false, default: RECURRENCE_PATTERNS.NONE },
  recurrence_end_date: { type: 'datetime', required: false },
  
  // Notifications
  notifications: { type: 'array', itemType: 'object', required: false },
  reminder_minutes: { type: 'number', required: false, default: 60 },
  
  // Progress Tracking
  progress_percentage: { type: 'number', min: 0, max: 100, required: false, default: 0 },
  estimated_duration_hours: { type: 'number', required: false },
  actual_duration_hours: { type: 'number', required: false },
  
  // User Data
  notes: { type: 'string', required: false },
  tags: { type: 'array', itemType: 'string', required: false },
  attachments: { type: 'array', itemType: 'string', required: false },
  
  // Timestamps
  created_at: { type: 'timestamp', required: true },
  updated_at: { type: 'timestamp', required: true },
  completed_at: { type: 'timestamp', required: false }
};

// Helper Functions
export const getTaskTypeLabel = (type) => {
  const labels = {
    [TASK_TYPES.APPLICATION_DEADLINE]: 'Application Deadline',
    [TASK_TYPES.ESSAY_DEADLINE]: 'Essay Deadline',
    [TASK_TYPES.TEST_REGISTRATION]: 'Test Registration',
    [TASK_TYPES.TEST_DEADLINE]: 'Test Deadline',
    [TASK_TYPES.RECOMMENDATION_REQUEST]: 'Recommendation Request',
    [TASK_TYPES.RECOMMENDATION_DEADLINE]: 'Recommendation Deadline',
    [TASK_TYPES.FINANCIAL_AID]: 'Financial Aid',
    [TASK_TYPES.SCHOLARSHIP_DEADLINE]: 'Scholarship Deadline',
    [TASK_TYPES.INTERVIEW]: 'Interview',
    [TASK_TYPES.CAMPUS_VISIT]: 'Campus Visit',
    [TASK_TYPES.OTHER]: 'Other'
  };
  return labels[type] || type;
};

export const getStatusLabel = (status) => {
  const labels = {
    [TASK_STATUS.NOT_STARTED]: 'Not Started',
    [TASK_STATUS.IN_PROGRESS]: 'In Progress',
    [TASK_STATUS.COMPLETED]: 'Completed',
    [TASK_STATUS.OVERDUE]: 'Overdue',
    [TASK_STATUS.CANCELLED]: 'Cancelled'
  };
  return labels[status] || status;
};

export const getPriorityLabel = (priority) => {
  const labels = {
    [PRIORITY_LEVELS.LOW]: 'Low',
    [PRIORITY_LEVELS.MEDIUM]: 'Medium',
    [PRIORITY_LEVELS.HIGH]: 'High',
    [PRIORITY_LEVELS.URGENT]: 'Urgent'
  };
  return labels[priority] || priority;
};

export const getStatusColor = (status) => {
  const colors = {
    [TASK_STATUS.NOT_STARTED]: 'text-gray-600 bg-gray-50 border-gray-200',
    [TASK_STATUS.IN_PROGRESS]: 'text-blue-600 bg-blue-50 border-blue-200',
    [TASK_STATUS.COMPLETED]: 'text-green-600 bg-green-50 border-green-200',
    [TASK_STATUS.OVERDUE]: 'text-red-600 bg-red-50 border-red-200',
    [TASK_STATUS.CANCELLED]: 'text-gray-400 bg-gray-50 border-gray-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getPriorityColor = (priority) => {
  const colors = {
    [PRIORITY_LEVELS.LOW]: 'text-green-600 bg-green-50 border-green-200',
    [PRIORITY_LEVELS.MEDIUM]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [PRIORITY_LEVELS.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
    [PRIORITY_LEVELS.URGENT]: 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getTaskTypeIcon = (type) => {
  const icons = {
    [TASK_TYPES.APPLICATION_DEADLINE]: '📝',
    [TASK_TYPES.ESSAY_DEADLINE]: '✍️',
    [TASK_TYPES.TEST_REGISTRATION]: '📋',
    [TASK_TYPES.TEST_DEADLINE]: '📊',
    [TASK_TYPES.RECOMMENDATION_REQUEST]: '👥',
    [TASK_TYPES.RECOMMENDATION_DEADLINE]: '📄',
    [TASK_TYPES.FINANCIAL_AID]: '💰',
    [TASK_TYPES.SCHOLARSHIP_DEADLINE]: '🎓',
    [TASK_TYPES.INTERVIEW]: '🎤',
    [TASK_TYPES.CAMPUS_VISIT]: '🏫',
    [TASK_TYPES.OTHER]: '📌'
  };
  return icons[type] || '📌';
};

// Date/Time Utilities
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatDateTime = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getRelativeDate = (dateString) => {
  if (!dateString) return 'N/A';
  const daysUntil = getDaysUntil(dateString);
  
  if (daysUntil === null) return 'N/A';
  if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil <= 7) return `In ${daysUntil} days`;
  if (daysUntil <= 30) return `In ${Math.ceil(daysUntil / 7)} weeks`;
  return `In ${Math.ceil(daysUntil / 30)} months`;
};

// Filter and Sort Utilities
export const filterTasksByStatus = (tasks, status) => {
  if (status === 'all') return tasks;
  return tasks.filter(task => task.status === status);
};

export const filterTasksByType = (tasks, type) => {
  if (type === 'all') return tasks;
  return tasks.filter(task => task.task_type === type);
};

export const filterTasksByPriority = (tasks, priority) => {
  if (priority === 'all') return tasks;
  return tasks.filter(task => task.priority === priority);
};

export const filterTasksByDateRange = (tasks, startDate, endDate) => {
  if (!startDate && !endDate) return tasks;
  
  return tasks.filter(task => {
    const taskDate = new Date(task.start_date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date('2099-12-31');
    
    return taskDate >= start && taskDate <= end;
  });
};

export const sortTasksByDate = (tasks, ascending = true) => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = {
    [PRIORITY_LEVELS.URGENT]: 4,
    [PRIORITY_LEVELS.HIGH]: 3,
    [PRIORITY_LEVELS.MEDIUM]: 2,
    [PRIORITY_LEVELS.LOW]: 1
  };
  
  return [...tasks].sort((a, b) => {
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });
};

// Notification Utilities
export const createNotification = (type, message, taskId, scheduledFor) => {
  return {
    id: `notification-${Date.now()}`,
    type,
    message,
    task_id: taskId,
    scheduled_for: scheduledFor,
    sent: false,
    created_at: new Date().toISOString()
  };
};

export const shouldSendNotification = (task, notificationType) => {
  if (!task.reminder_minutes) return false;
  
  const taskDate = new Date(task.start_date);
  const now = new Date();
  const reminderTime = new Date(taskDate.getTime() - (task.reminder_minutes * 60 * 1000));
  
  return now >= reminderTime && now <= taskDate;
};

// Calendar View Utilities
export const getCalendarView = (date, viewType = 'month') => {
  const currentDate = new Date(date);
  
  if (viewType === 'month') {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      currentWeek.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }
    
    return weeks;
  }
  
  return [];
};

export const getTasksForDate = (tasks, date) => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return tasks.filter(task => {
    const taskDate = new Date(task.start_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === targetDate.getTime();
  });
};

// Mock Data for Development
export const mockTasks = [
  {
    id: 'task-1',
    student_id: 'demo-student',
    title: 'Submit Common App to Harvard',
    description: 'Complete and submit Common Application to Harvard University',
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
    task_type: TASK_TYPES.APPLICATION_DEADLINE,
    status: TASK_STATUS.IN_PROGRESS,
    priority: PRIORITY_LEVELS.HIGH,
    college_id: 'harvard',
    college_name: 'Harvard University',
    progress_percentage: 75,
    reminder_minutes: 60,
    notes: 'Make sure to include all required essays',
    tags: ['common-app', 'reach-school'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'task-2',
    student_id: 'demo-student',
    title: 'Submit MIT Supplemental Essays',
    description: 'Complete and submit MIT-specific supplemental essays',
    start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
    task_type: TASK_TYPES.ESSAY_DEADLINE,
    status: TASK_STATUS.NOT_STARTED,
    priority: PRIORITY_LEVELS.HIGH,
    college_id: 'mit',
    college_name: 'MIT',
    progress_percentage: 0,
    reminder_minutes: 120,
    notes: 'Focus on technical achievements and problem-solving',
    tags: ['supplemental', 'reach-school'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'task-3',
    student_id: 'demo-student',
    title: 'Request Teacher Recommendations',
    description: 'Ask teachers for recommendation letters',
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
    task_type: TASK_TYPES.RECOMMENDATION_REQUEST,
    status: TASK_STATUS.NOT_STARTED,
    priority: PRIORITY_LEVELS.MEDIUM,
    progress_percentage: 0,
    reminder_minutes: 60,
    notes: 'Ask Mr. Smith (Math) and Ms. Johnson (English)',
    tags: ['recommendations', 'teachers'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'task-4',
    student_id: 'demo-student',
    title: 'Register for SAT',
    description: 'Register for the next available SAT test date',
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
    task_type: TASK_TYPES.TEST_REGISTRATION,
    status: TASK_STATUS.NOT_STARTED,
    priority: PRIORITY_LEVELS.MEDIUM,
    progress_percentage: 0,
    reminder_minutes: 60,
    notes: 'Check available test centers and dates',
    tags: ['testing', 'sat'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'task-5',
    student_id: 'demo-student',
    title: 'Submit FAFSA',
    description: 'Complete and submit Free Application for Federal Student Aid',
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    all_day: true,
    task_type: TASK_TYPES.FINANCIAL_AID,
    status: TASK_STATUS.NOT_STARTED,
    priority: PRIORITY_LEVELS.HIGH,
    progress_percentage: 0,
    reminder_minutes: 60,
    notes: 'Gather all required financial documents',
    tags: ['financial-aid', 'fafsa'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
