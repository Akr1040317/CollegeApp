import { 
  StudentService, 
  ApplicationTrackerService, 
  EssayService, 
  ScholarshipService, 
  SelectedCollegeService,
  TaskService
} from './firestore';
import { 
  getCurrentUser, 
  onAuthStateChange, 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signOutUser,
  resetPassword,
  updateUserProfile
} from './auth';

// Export Firebase-based entities to match base44 structure
export const Student = StudentService;
export const ApplicationTracker = ApplicationTrackerService;
export const Essay = EssayService;
export const Scholarship = ScholarshipService;
export const SelectedCollege = SelectedCollegeService;
export const Task = TaskService;

// Auth service to match base44 structure
export const User = {
  // Authentication methods
  signIn: signInWithEmail,
  signUp: signUpWithEmail,
  signInWithGoogle,
  signOut: signOutUser,
  resetPassword,
  updateProfile: updateUserProfile,
  
  // User state
  getCurrent: getCurrentUser,
  onAuthStateChange,
  
  // Helper methods
  isAuthenticated: () => {
    const user = getCurrentUser();
    return user !== null;
  },
  
  getUserId: () => {
    const user = getCurrentUser();
    return user ? user.uid : null;
  },
  
  getUserEmail: () => {
    const user = getCurrentUser();
    return user ? user.email : null;
  },
  
  getDisplayName: () => {
    const user = getCurrentUser();
    return user ? user.displayName : null;
  }
};
