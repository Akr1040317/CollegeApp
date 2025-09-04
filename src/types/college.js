// College Data Structure
export const COLLEGE_CATEGORIES = {
  REACH: 'reach',
  TARGET: 'target',
  SAFETY: 'safety'
};

export const COLLEGE_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  COMMUNITY: 'community',
  LIBERAL_ARTS: 'liberal_arts',
  RESEARCH: 'research'
};

export const COLLEGE_SIZES = {
  SMALL: 'small',      // < 5,000
  MEDIUM: 'medium',    // 5,000 - 15,000
  LARGE: 'large'       // 15,000+
};

export const COLLEGE_FIELDS = {
  // Basic Information
  id: { type: 'string', required: true },
  name: { type: 'string', required: true },
  short_name: { type: 'string', required: false },
  city: { type: 'string', required: true },
  state: { type: 'string', required: true },
  zipcode: { type: 'string', required: false },
  country: { type: 'string', required: true, default: 'US' },
  region: { type: 'string', required: false },
  
  // Contact Information
  website: { type: 'string', required: false },
  phone: { type: 'string', required: false },
  email: { type: 'string', required: false },
  
  // Academic Information
  type: { type: 'string', options: Object.values(COLLEGE_TYPES), required: true },
  size_category: { type: 'string', options: Object.values(COLLEGE_SIZES), required: true },
  enrollment: { type: 'number', required: true },
  undergraduate_enrollment: { type: 'number', required: false },
  graduate_enrollment: { type: 'number', required: false },
  
  // Admissions
  acceptance_rate: { type: 'number', min: 0, max: 100, required: false },
  sat_25th_percentile: { type: 'number', required: false },
  sat_75th_percentile: { type: 'number', required: false },
  act_25th_percentile: { type: 'number', required: false },
  act_75th_percentile: { type: 'number', required: false },
  gpa_requirement: { type: 'number', required: false },
  
  // Costs
  tuition_in_state: { type: 'number', required: false },
  tuition_out_state: { type: 'number', required: false },
  tuition_international: { type: 'number', required: false },
  room_board: { type: 'number', required: false },
  total_cost_in_state: { type: 'number', required: false },
  total_cost_out_state: { type: 'number', required: false },
  
  // Financial Aid
  financial_aid_available: { type: 'boolean', required: false, default: true },
  average_financial_aid: { type: 'number', required: false },
  merit_aid_available: { type: 'boolean', required: false, default: false },
  
  // Deadlines
  early_decision_deadline: { type: 'date', required: false },
  early_action_deadline: { type: 'date', required: false },
  regular_decision_deadline: { type: 'date', required: false },
  rolling_admissions: { type: 'boolean', required: false, default: false },
  
  // Campus Life
  setting: { type: 'string', options: ['urban', 'suburban', 'rural'], required: false },
  greek_life: { type: 'boolean', required: false, default: false },
  athletics_division: { type: 'string', required: false },
  campus_housing: { type: 'boolean', required: false, default: true },
  
  // Academics
  student_faculty_ratio: { type: 'number', required: false },
  popular_majors: { type: 'array', itemType: 'string', required: false },
  strong_programs: { type: 'array', itemType: 'string', required: false },
  research_opportunities: { type: 'boolean', required: false, default: false },
  
  // Rankings
  us_news_ranking: { type: 'number', required: false },
  forbes_ranking: { type: 'number', required: false },
  princeton_review_ranking: { type: 'number', required: false },
  
  // Additional Information
  description: { type: 'string', required: false },
  notable_alumni: { type: 'array', itemType: 'string', required: false },
  special_programs: { type: 'array', itemType: 'string', required: false },
  diversity_score: { type: 'number', min: 0, max: 100, required: false },
  
  // User-specific data
  user_category: { type: 'string', options: Object.values(COLLEGE_CATEGORIES), required: false },
  user_notes: { type: 'string', required: false },
  user_rating: { type: 'number', min: 1, max: 5, required: false },
  user_interest_level: { type: 'string', options: ['very_high', 'high', 'medium', 'low'], required: false },
  user_application_status: { type: 'string', options: ['not_applied', 'applied', 'accepted', 'rejected', 'waitlisted'], required: false, default: 'not_applied' },
  user_application_deadline: { type: 'date', required: false },
  user_decision_type: { type: 'string', options: ['ED', 'EA', 'REA', 'RD'], required: false }
};

// Mock College Database
export const MOCK_COLLEGES = [
  {
    id: 'harvard',
    name: 'Harvard University',
    short_name: 'Harvard',
    city: 'Cambridge',
    state: 'MA',
    zipcode: '02138',
    country: 'US',
    region: 'Northeast',
    website: 'https://www.harvard.edu',
    type: COLLEGE_TYPES.PRIVATE,
    size_category: COLLEGE_SIZES.MEDIUM,
    enrollment: 23000,
    undergraduate_enrollment: 7000,
    graduate_enrollment: 16000,
    acceptance_rate: 3.4,
    sat_25th_percentile: 1460,
    sat_75th_percentile: 1580,
    act_25th_percentile: 33,
    act_75th_percentile: 36,
    gpa_requirement: 3.9,
    tuition_in_state: 0,
    tuition_out_state: 0,
    tuition_international: 0,
    room_board: 18000,
    total_cost_in_state: 57000,
    total_cost_out_state: 57000,
    financial_aid_available: true,
    average_financial_aid: 50000,
    merit_aid_available: false,
    early_decision_deadline: '2024-11-01',
    early_action_deadline: '2024-11-01',
    regular_decision_deadline: '2025-01-01',
    rolling_admissions: false,
    setting: 'urban',
    greek_life: true,
    athletics_division: 'Division I',
    campus_housing: true,
    student_faculty_ratio: 6,
    popular_majors: ['Economics', 'Computer Science', 'Political Science', 'Psychology', 'Biology'],
    strong_programs: ['Business', 'Medicine', 'Law', 'Engineering', 'Liberal Arts'],
    research_opportunities: true,
    us_news_ranking: 3,
    forbes_ranking: 1,
    princeton_review_ranking: 1,
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher learning in the United States.',
    notable_alumni: ['Barack Obama', 'Mark Zuckerberg', 'Bill Gates', 'John F. Kennedy'],
    special_programs: ['Study Abroad', 'Research Opportunities', 'Internships', 'Honors Program'],
    diversity_score: 85
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    short_name: 'MIT',
    city: 'Cambridge',
    state: 'MA',
    zipcode: '02139',
    country: 'US',
    region: 'Northeast',
    website: 'https://www.mit.edu',
    type: COLLEGE_TYPES.PRIVATE,
    size_category: COLLEGE_SIZES.MEDIUM,
    enrollment: 12000,
    undergraduate_enrollment: 4000,
    graduate_enrollment: 8000,
    acceptance_rate: 6.7,
    sat_25th_percentile: 1500,
    sat_75th_percentile: 1580,
    act_25th_percentile: 34,
    act_75th_percentile: 36,
    gpa_requirement: 3.9,
    tuition_in_state: 0,
    tuition_out_state: 0,
    tuition_international: 0,
    room_board: 16000,
    total_cost_in_state: 55000,
    total_cost_out_state: 55000,
    financial_aid_available: true,
    average_financial_aid: 45000,
    merit_aid_available: false,
    early_decision_deadline: '2024-11-01',
    early_action_deadline: '2024-11-01',
    regular_decision_deadline: '2025-01-01',
    rolling_admissions: false,
    setting: 'urban',
    greek_life: true,
    athletics_division: 'Division III',
    campus_housing: true,
    student_faculty_ratio: 3,
    popular_majors: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Biology'],
    strong_programs: ['Engineering', 'Computer Science', 'Mathematics', 'Physics', 'Business'],
    research_opportunities: true,
    us_news_ranking: 2,
    forbes_ranking: 2,
    princeton_review_ranking: 2,
    description: 'MIT is a private land-grant research university in Cambridge, Massachusetts. It is known for its strong emphasis on science and technology.',
    notable_alumni: ['Buzz Aldrin', 'Kofi Annan', 'Drew Houston', 'I.M. Pei'],
    special_programs: ['Undergraduate Research', 'Study Abroad', 'Co-op Programs', 'Entrepreneurship'],
    diversity_score: 80
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    short_name: 'Stanford',
    city: 'Stanford',
    state: 'CA',
    zipcode: '94305',
    country: 'US',
    region: 'West Coast',
    website: 'https://www.stanford.edu',
    type: COLLEGE_TYPES.PRIVATE,
    size_category: COLLEGE_SIZES.MEDIUM,
    enrollment: 17000,
    undergraduate_enrollment: 7000,
    graduate_enrollment: 10000,
    acceptance_rate: 4.3,
    sat_25th_percentile: 1440,
    sat_75th_percentile: 1570,
    act_25th_percentile: 32,
    act_75th_percentile: 35,
    gpa_requirement: 3.9,
    tuition_in_state: 0,
    tuition_out_state: 0,
    tuition_international: 0,
    room_board: 17000,
    total_cost_in_state: 56000,
    total_cost_out_state: 56000,
    financial_aid_available: true,
    average_financial_aid: 48000,
    merit_aid_available: false,
    early_decision_deadline: '2024-11-01',
    early_action_deadline: '2024-11-01',
    regular_decision_deadline: '2025-01-02',
    rolling_admissions: false,
    setting: 'suburban',
    greek_life: true,
    athletics_division: 'Division I',
    campus_housing: true,
    student_faculty_ratio: 5,
    popular_majors: ['Computer Science', 'Engineering', 'Biology', 'Economics', 'Psychology'],
    strong_programs: ['Engineering', 'Business', 'Medicine', 'Law', 'Computer Science'],
    research_opportunities: true,
    us_news_ranking: 6,
    forbes_ranking: 3,
    princeton_review_ranking: 3,
    description: 'Stanford University is a private research university in Stanford, California. It is known for its academic strength, wealth, proximity to Silicon Valley, and ranking as one of the world\'s top universities.',
    notable_alumni: ['Elon Musk', 'Reed Hastings', 'Tiger Woods', 'Sally Ride'],
    special_programs: ['Study Abroad', 'Research Opportunities', 'Internships', 'Entrepreneurship'],
    diversity_score: 75
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    short_name: 'UC Berkeley',
    city: 'Berkeley',
    state: 'CA',
    zipcode: '94720',
    country: 'US',
    region: 'West Coast',
    website: 'https://www.berkeley.edu',
    type: COLLEGE_TYPES.PUBLIC,
    size_category: COLLEGE_SIZES.LARGE,
    enrollment: 45000,
    undergraduate_enrollment: 32000,
    graduate_enrollment: 13000,
    acceptance_rate: 14.5,
    sat_25th_percentile: 1310,
    sat_75th_percentile: 1530,
    act_25th_percentile: 28,
    act_75th_percentile: 34,
    gpa_requirement: 3.7,
    tuition_in_state: 14000,
    tuition_out_state: 44000,
    tuition_international: 44000,
    room_board: 18000,
    total_cost_in_state: 32000,
    total_cost_out_state: 62000,
    financial_aid_available: true,
    average_financial_aid: 20000,
    merit_aid_available: true,
    early_decision_deadline: null,
    early_action_deadline: '2024-11-30',
    regular_decision_deadline: '2024-11-30',
    rolling_admissions: false,
    setting: 'urban',
    greek_life: true,
    athletics_division: 'Division I',
    campus_housing: true,
    student_faculty_ratio: 20,
    popular_majors: ['Computer Science', 'Business', 'Psychology', 'Biology', 'Economics'],
    strong_programs: ['Engineering', 'Business', 'Computer Science', 'Public Policy', 'Liberal Arts'],
    research_opportunities: true,
    us_news_ranking: 20,
    forbes_ranking: 15,
    princeton_review_ranking: 10,
    description: 'UC Berkeley is a public land-grant research university in Berkeley, California. It is the flagship institution of the University of California system.',
    notable_alumni: ['Steve Wozniak', 'Gordon Moore', 'Earl Warren', 'Gregory Peck'],
    special_programs: ['Study Abroad', 'Research Opportunities', 'Honors Program', 'Co-op Programs'],
    diversity_score: 90
  },
  {
    id: 'ucla',
    name: 'University of California, Los Angeles',
    short_name: 'UCLA',
    city: 'Los Angeles',
    state: 'CA',
    zipcode: '90095',
    country: 'US',
    region: 'West Coast',
    website: 'https://www.ucla.edu',
    type: COLLEGE_TYPES.PUBLIC,
    size_category: COLLEGE_SIZES.LARGE,
    enrollment: 46000,
    undergraduate_enrollment: 32000,
    graduate_enrollment: 14000,
    acceptance_rate: 10.8,
    sat_25th_percentile: 1340,
    sat_75th_percentile: 1540,
    act_25th_percentile: 29,
    act_75th_percentile: 34,
    gpa_requirement: 3.7,
    tuition_in_state: 14000,
    tuition_out_state: 44000,
    tuition_international: 44000,
    room_board: 16000,
    total_cost_in_state: 30000,
    total_cost_out_state: 60000,
    financial_aid_available: true,
    average_financial_aid: 18000,
    merit_aid_available: true,
    early_decision_deadline: null,
    early_action_deadline: '2024-11-30',
    regular_decision_deadline: '2024-11-30',
    rolling_admissions: false,
    setting: 'urban',
    greek_life: true,
    athletics_division: 'Division I',
    campus_housing: true,
    student_faculty_ratio: 18,
    popular_majors: ['Psychology', 'Biology', 'Business', 'Economics', 'Computer Science'],
    strong_programs: ['Medicine', 'Business', 'Engineering', 'Film', 'Liberal Arts'],
    research_opportunities: true,
    us_news_ranking: 20,
    forbes_ranking: 12,
    princeton_review_ranking: 8,
    description: 'UCLA is a public land-grant research university in Los Angeles, California. It is the second-oldest of the 10-campus University of California system.',
    notable_alumni: ['Kareem Abdul-Jabbar', 'Jack Black', 'Francis Ford Coppola', 'John Wooden'],
    special_programs: ['Study Abroad', 'Research Opportunities', 'Honors Program', 'Internships'],
    diversity_score: 88
  }
];

// Search and Filter Functions
export const searchColleges = (colleges, query) => {
  if (!query) return colleges;
  
  const searchTerm = query.toLowerCase();
  return colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm) ||
    college.short_name.toLowerCase().includes(searchTerm) ||
    college.city.toLowerCase().includes(searchTerm) ||
    college.state.toLowerCase().includes(searchTerm) ||
    college.popular_majors?.some(major => major.toLowerCase().includes(searchTerm)) ||
    college.strong_programs?.some(program => program.toLowerCase().includes(searchTerm))
  );
};

export const filterColleges = (colleges, filters) => {
  return colleges.filter(college => {
    // Type filter
    if (filters.type && filters.type !== 'all' && college.type !== filters.type) {
      return false;
    }
    
    // Size filter
    if (filters.size && filters.size !== 'all' && college.size_category !== filters.size) {
      return false;
    }
    
    // Region filter
    if (filters.region && filters.region !== 'all' && college.region !== filters.region) {
      return false;
    }
    
    // Setting filter
    if (filters.setting && filters.setting !== 'all' && college.setting !== filters.setting) {
      return false;
    }
    
    // Cost filter
    if (filters.maxCost) {
      const cost = college.tuition_out_state || college.tuition_in_state || 0;
      if (cost > filters.maxCost) {
        return false;
      }
    }
    
    // Acceptance rate filter
    if (filters.maxAcceptanceRate && college.acceptance_rate > filters.maxAcceptanceRate) {
      return false;
    }
    
    // SAT score filter
    if (filters.minSAT && college.sat_75th_percentile < filters.minSAT) {
      return false;
    }
    
    // ACT score filter
    if (filters.minACT && college.act_75th_percentile < filters.minACT) {
      return false;
    }
    
    return true;
  });
};

export const sortColleges = (colleges, sortBy) => {
  const sorted = [...colleges];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'acceptance_rate':
      return sorted.sort((a, b) => (a.acceptance_rate || 100) - (b.acceptance_rate || 100));
    case 'cost':
      return sorted.sort((a, b) => {
        const costA = a.tuition_out_state || a.tuition_in_state || 0;
        const costB = b.tuition_out_state || b.tuition_in_state || 0;
        return costA - costB;
      });
    case 'ranking':
      return sorted.sort((a, b) => (a.us_news_ranking || 999) - (b.us_news_ranking || 999));
    case 'enrollment':
      return sorted.sort((a, b) => b.enrollment - a.enrollment);
    default:
      return sorted;
  }
};
