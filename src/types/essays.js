// Essay Types
export const ESSAY_TYPES = {
  COMMON_APP: 'common_app',
  SUPPLEMENTAL: 'supplemental',
  SCHOLARSHIP: 'scholarship',
  PERSONAL_STATEMENT: 'personal_statement',
  ACTIVITY_ESSAY: 'activity_essay',
  WHY_THIS_COLLEGE: 'why_this_college',
  WHY_THIS_MAJOR: 'why_this_major',
  DIVERSITY: 'diversity',
  LEADERSHIP: 'leadership',
  CHALLENGE: 'challenge',
  OTHER: 'other'
};

// Essay Status
export const ESSAY_STATUS = {
  NOT_STARTED: 'not_started',
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  FINAL: 'final',
  SUBMITTED: 'submitted'
};

// Common App Essay Prompts (2024-2025)
export const COMMON_APP_PROMPTS = [
  {
    id: 'prompt-1',
    prompt: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
    word_limit: 650,
    category: 'background_identity',
    description: 'Background, identity, interest, or talent'
  },
  {
    id: 'prompt-2',
    prompt: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
    word_limit: 650,
    category: 'challenge_failure',
    description: 'Challenge, setback, or failure'
  },
  {
    id: 'prompt-3',
    prompt: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
    word_limit: 650,
    category: 'belief_idea',
    description: 'Questioned or challenged a belief or idea'
  },
  {
    id: 'prompt-4',
    prompt: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
    word_limit: 650,
    category: 'gratitude',
    description: 'Something someone did that made you grateful'
  },
  {
    id: 'prompt-5',
    prompt: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
    word_limit: 650,
    category: 'personal_growth',
    description: 'Accomplishment or event that sparked personal growth'
  },
  {
    id: 'prompt-6',
    prompt: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
    word_limit: 650,
    category: 'engaging_topic',
    description: 'Topic, idea, or concept that captivates you'
  },
  {
    id: 'prompt-7',
    prompt: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
    word_limit: 650,
    category: 'free_choice',
    description: 'Any topic of your choice'
  }
];

// Essay Data Structure
export const ESSAY_FIELDS = {
  // Basic Information
  id: { type: 'string', required: true },
  student_id: { type: 'string', required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: false, default: '' },
  
  // Essay Details
  essay_type: { type: 'string', options: Object.values(ESSAY_TYPES), required: true },
  status: { type: 'string', options: Object.values(ESSAY_STATUS), required: true, default: ESSAY_STATUS.NOT_STARTED },
  
  // Common App Specific
  common_app_prompt_id: { type: 'string', required: false },
  word_limit: { type: 'number', required: false, default: 650 },
  
  // College Specific
  college_id: { type: 'string', required: false },
  college_name: { type: 'string', required: false },
  college_prompt: { type: 'string', required: false },
  
  // Writing Progress
  word_count: { type: 'number', required: false, default: 0 },
  character_count: { type: 'number', required: false, default: 0 },
  reading_time_minutes: { type: 'number', required: false, default: 0 },
  
  // AI Feedback
  ai_feedback: { type: 'object', required: false },
  ai_suggestions: { type: 'array', itemType: 'string', required: false },
  ai_score: { type: 'number', min: 1, max: 10, required: false },
  
  // User Notes
  notes: { type: 'string', required: false },
  tags: { type: 'array', itemType: 'string', required: false },
  
  // Timestamps
  created_at: { type: 'timestamp', required: true },
  updated_at: { type: 'timestamp', required: true },
  last_edited_at: { type: 'timestamp', required: false }
};

// Helper Functions
export const getEssayTypeLabel = (type) => {
  const labels = {
    [ESSAY_TYPES.COMMON_APP]: 'Common App Essay',
    [ESSAY_TYPES.SUPPLEMENTAL]: 'Supplemental Essay',
    [ESSAY_TYPES.SCHOLARSHIP]: 'Scholarship Essay',
    [ESSAY_TYPES.PERSONAL_STATEMENT]: 'Personal Statement',
    [ESSAY_TYPES.ACTIVITY_ESSAY]: 'Activity Essay',
    [ESSAY_TYPES.WHY_THIS_COLLEGE]: 'Why This College',
    [ESSAY_TYPES.WHY_THIS_MAJOR]: 'Why This Major',
    [ESSAY_TYPES.DIVERSITY]: 'Diversity Essay',
    [ESSAY_TYPES.LEADERSHIP]: 'Leadership Essay',
    [ESSAY_TYPES.CHALLENGE]: 'Challenge Essay',
    [ESSAY_TYPES.OTHER]: 'Other'
  };
  return labels[type] || type;
};

export const getStatusLabel = (status) => {
  const labels = {
    [ESSAY_STATUS.NOT_STARTED]: 'Not Started',
    [ESSAY_STATUS.DRAFT]: 'Draft',
    [ESSAY_STATUS.IN_PROGRESS]: 'In Progress',
    [ESSAY_STATUS.REVIEW]: 'Under Review',
    [ESSAY_STATUS.FINAL]: 'Final Draft',
    [ESSAY_STATUS.SUBMITTED]: 'Submitted'
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    [ESSAY_STATUS.NOT_STARTED]: 'text-gray-600 bg-gray-50 border-gray-200',
    [ESSAY_STATUS.DRAFT]: 'text-blue-600 bg-blue-50 border-blue-200',
    [ESSAY_STATUS.IN_PROGRESS]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [ESSAY_STATUS.REVIEW]: 'text-orange-600 bg-orange-50 border-orange-200',
    [ESSAY_STATUS.FINAL]: 'text-green-600 bg-green-50 border-green-200',
    [ESSAY_STATUS.SUBMITTED]: 'text-purple-600 bg-purple-50 border-purple-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const calculateWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const calculateCharacterCount = (text) => {
  if (!text) return 0;
  return text.length;
};

export const calculateReadingTime = (wordCount) => {
  // Average reading speed: 200 words per minute
  return Math.ceil(wordCount / 200);
};

export const getWordCountStatus = (wordCount, wordLimit) => {
  if (!wordLimit) return 'normal';
  const percentage = (wordCount / wordLimit) * 100;
  
  if (percentage >= 100) return 'over';
  if (percentage >= 90) return 'near';
  if (percentage >= 50) return 'good';
  return 'low';
};

export const getWordCountColor = (status) => {
  const colors = {
    over: 'text-red-600',
    near: 'text-orange-600',
    good: 'text-green-600',
    low: 'text-gray-600',
    normal: 'text-gray-600'
  };
  return colors[status] || colors.normal;
};

// Essay Templates
export const ESSAY_TEMPLATES = {
  [ESSAY_TYPES.COMMON_APP]: {
    structure: [
      'Hook/Opening (1-2 sentences)',
      'Background/Context (2-3 sentences)',
      'Main Story/Experience (4-6 sentences)',
      'Reflection/Learning (2-3 sentences)',
      'Connection to Future (1-2 sentences)',
      'Strong Conclusion (1-2 sentences)'
    ],
    tips: [
      'Show, don\'t tell - use specific examples',
      'Be authentic and personal',
      'Focus on growth and learning',
      'Use active voice',
      'Avoid clichés and generic statements'
    ]
  },
  [ESSAY_TYPES.WHY_THIS_COLLEGE]: {
    structure: [
      'Specific program or opportunity (1-2 sentences)',
      'Why this matters to you (2-3 sentences)',
      'How you\'ll contribute (2-3 sentences)',
      'Connection to your goals (1-2 sentences)',
      'Why this college specifically (2-3 sentences)'
    ],
    tips: [
      'Research specific programs, professors, or opportunities',
      'Connect to your academic and career goals',
      'Show genuine interest and knowledge',
      'Avoid generic statements that could apply to any school'
    ]
  },
  [ESSAY_TYPES.ACTIVITY_ESSAY]: {
    structure: [
      'Activity introduction (1-2 sentences)',
      'Your specific role and responsibilities (2-3 sentences)',
      'Key experiences or achievements (3-4 sentences)',
      'What you learned or how you grew (2-3 sentences)',
      'Impact on others or community (1-2 sentences)'
    ],
    tips: [
      'Focus on leadership and impact',
      'Use specific examples and metrics',
      'Show personal growth and learning',
      'Connect to your values and goals'
    ]
  }
};

// AI Feedback Categories
export const AI_FEEDBACK_CATEGORIES = {
  GRAMMAR: 'Grammar & Mechanics',
  CLARITY: 'Clarity & Flow',
  CONTENT: 'Content & Storytelling',
  STRUCTURE: 'Structure & Organization',
  VOICE: 'Voice & Tone',
  IMPACT: 'Overall Impact'
};

export const getFeedbackScoreColor = (score) => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
};

export const getOverallScoreColor = (score) => {
  if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};
