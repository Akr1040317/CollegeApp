# CollegeMatch AI

A comprehensive college application platform built with React and Firebase, designed to help students navigate their college journey.

## Features

- **Authentication**: Secure user authentication with Firebase Auth (Email/Password and Google Sign-in)
- **College Applications**: Streamlined application process with step-by-step guidance
- **Essay Coach**: AI-powered essay writing assistance
- **Application Tracker**: Track your college applications and deadlines
- **Scholarship Finder**: Discover scholarships tailored to your profile
- **College Recommendations**: Get personalized college recommendations
- **Selected Colleges**: Manage your college shortlist

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Akr1040317/CollegeApp.git
cd CollegeApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google Sign-in)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config to `src/firebase/config.js`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

```bash
npm run build
```

## Firebase Configuration

Make sure to configure the following Firebase services:

1. **Authentication**: Enable Email/Password and Google Sign-in methods
2. **Firestore Database**: Set up security rules for your collections
3. **Storage**: Configure storage rules for file uploads

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── application/   # Application form components
│   ├── college/       # College-related components
│   ├── recommendations/ # Recommendation components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── firebase/          # Firebase configuration and services
├── hooks/             # Custom React hooks
├── pages/             # Main application pages
└── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.