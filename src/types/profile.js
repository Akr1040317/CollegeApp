// User Profile Data Structure
export const PROFILE_SECTIONS = {
  PERSONAL: 'personal',
  ACADEMIC: 'academic',
  EXTRACURRICULAR: 'extracurricular',
  PREFERENCES: 'preferences',
  GOALS: 'goals'
};

export const PROFILE_FIELDS = {
  // Personal Information
  first_name: { type: 'string', required: true },
  last_name: { type: 'string', required: true },
  email: { type: 'email', required: true },
  phone: { type: 'string', required: false },
  date_of_birth: { type: 'date', required: false },
  zipcode: { type: 'string', required: true },
  city: { type: 'string', required: false },
  state: { type: 'string', required: false },
  country: { type: 'string', required: false, default: 'US' },
  
  // Academic Information
  gpa: { type: 'number', min: 0, max: 4.0, required: true },
  gpa_scale: { type: 'string', options: ['4.0', '5.0', '100'], default: '4.0' },
  class_rank: { type: 'number', min: 1, required: false },
  class_size: { type: 'number', min: 1, required: false },
  graduation_year: { type: 'number', required: true },
  
  // Test Scores
  sat_score: { type: 'number', min: 400, max: 1600, required: false },
  sat_math: { type: 'number', min: 200, max: 800, required: false },
  sat_reading: { type: 'number', min: 200, max: 800, required: false },
  sat_writing: { type: 'number', min: 200, max: 800, required: false },
  act_score: { type: 'number', min: 1, max: 36, required: false },
  act_english: { type: 'number', min: 1, max: 36, required: false },
  act_math: { type: 'number', min: 1, max: 36, required: false },
  act_reading: { type: 'number', min: 1, max: 36, required: false },
  act_science: { type: 'number', min: 1, max: 36, required: false },
  act_writing: { type: 'number', min: 1, max: 36, required: false },
  
  // AP/IB Scores
  ap_scores: { type: 'array', itemType: 'object', required: false },
  ib_scores: { type: 'array', itemType: 'object', required: false },
  subject_tests: { type: 'array', itemType: 'object', required: false },
  
  // Academic Interests
  intended_major: { type: 'string', required: true },
  intended_majors: { type: 'array', itemType: 'string', required: false },
  academic_interests: { type: 'array', itemType: 'string', required: false },
  
  // Extracurriculars
  extracurriculars: { type: 'array', itemType: 'object', required: false },
  leadership_positions: { type: 'array', itemType: 'object', required: false },
  volunteer_work: { type: 'array', itemType: 'object', required: false },
  work_experience: { type: 'array', itemType: 'object', required: false },
  awards_honors: { type: 'array', itemType: 'object', required: false },
  hobbies: { type: 'array', itemType: 'string', required: false },
  
  // College Preferences
  preferred_location: { type: 'string', options: ['urban', 'suburban', 'rural', 'any'], required: false },
  preferred_region: { type: 'array', itemType: 'string', required: false },
  preferred_state: { type: 'array', itemType: 'string', required: false },
  distance_from_home: { type: 'string', options: ['close', 'moderate', 'far', 'any'], required: false },
  max_distance_miles: { type: 'number', required: false },
  
  school_size_preference: { type: 'string', options: ['small', 'medium', 'large', 'any'], required: false },
  min_enrollment: { type: 'number', required: false },
  max_enrollment: { type: 'number', required: false },
  
  campus_culture: { type: 'array', itemType: 'string', required: false },
  greek_life_interest: { type: 'string', options: ['very_important', 'somewhat_important', 'not_important', 'avoid'], required: false },
  sports_interest: { type: 'string', options: ['very_important', 'somewhat_important', 'not_important', 'avoid'], required: false },
  diversity_importance: { type: 'string', options: ['very_important', 'somewhat_important', 'not_important'], required: false },
  
  school_type_preference: { type: 'array', itemType: 'string', options: ['public', 'private', 'community', 'any'], required: false },
  research_vs_teaching: { type: 'string', options: ['research_focused', 'teaching_focused', 'balanced', 'no_preference'], required: false },
  
  climate_preference: { type: 'array', itemType: 'string', required: false },
  weather_tolerance: { type: 'string', options: ['warm', 'moderate', 'cold', 'any'], required: false },
  
  // Financial Preferences
  financial_aid_important: { type: 'boolean', required: false },
  max_tuition: { type: 'number', required: false },
  scholarship_priority: { type: 'string', options: ['very_high', 'high', 'medium', 'low'], required: false },
  
  // Goals and Aspirations
  career_goals: { type: 'string', required: false },
  college_goals: { type: 'string', required: false },
  what_you_want_from_college: { type: 'string', required: false },
  post_graduation_plans: { type: 'string', required: false },
  
  // Additional Information
  special_circumstances: { type: 'string', required: false },
  additional_info: { type: 'string', required: false }
};

// Extracurricular Activity Structure
export const EXTRACURRICULAR_STRUCTURE = {
  activity: { type: 'string', required: true },
  role: { type: 'string', required: false },
  organization: { type: 'string', required: false },
  start_date: { type: 'date', required: false },
  end_date: { type: 'date', required: false },
  current: { type: 'boolean', required: false, default: false },
  hours_per_week: { type: 'number', required: false },
  description: { type: 'string', required: false },
  achievements: { type: 'array', itemType: 'string', required: false },
  impact: { type: 'string', required: false }
};

// Award/Honor Structure
export const AWARD_STRUCTURE = {
  title: { type: 'string', required: true },
  organization: { type: 'string', required: false },
  date_received: { type: 'date', required: false },
  description: { type: 'string', required: false },
  level: { type: 'string', options: ['local', 'state', 'national', 'international'], required: false }
};

// Work Experience Structure
export const WORK_EXPERIENCE_STRUCTURE = {
  position: { type: 'string', required: true },
  company: { type: 'string', required: true },
  start_date: { type: 'date', required: false },
  end_date: { type: 'date', required: false },
  current: { type: 'boolean', required: false, default: false },
  hours_per_week: { type: 'number', required: false },
  description: { type: 'string', required: false },
  responsibilities: { type: 'array', itemType: 'string', required: false }
};
