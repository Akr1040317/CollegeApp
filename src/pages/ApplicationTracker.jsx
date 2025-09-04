import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { ApplicationTracker as AppTracker } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Calendar, MapPin, Target, Clock, CheckCircle } from "lucide-react";
import ApplicationPlanner from "@/components/application/ApplicationPlanner";
import { useAuth } from "@/contexts/AuthContext";

export default function ApplicationTracker() {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log("Loading application data...");
      
      if (!currentUser) {
        console.log("No user authenticated, using demo data");
        // Create demo applications for testing
        const demoApplications = [
          {
            id: 'demo-app-1',
            student_id: 'demo-user',
            college_id: 'harvard',
            college_name: 'Harvard University',
            decision_type: 'ED',
            application_deadline: '2024-11-01',
            decision_release_date: '2024-12-15',
            status: 'in_progress',
            priority: 'high',
            notes: 'Dream school - need to focus on essays',
            requires_essay: true,
            requires_recommendations: true,
            requires_interview: true,
            requires_portfolio: false,
            requires_supplemental_essays: true,
            application_fee: 85,
            fee_waiver_applied: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-app-2',
            student_id: 'demo-user',
            college_id: 'stanford',
            college_name: 'Stanford University',
            decision_type: 'REA',
            application_deadline: '2024-11-01',
            decision_release_date: '2024-12-15',
            status: 'not_started',
            priority: 'high',
            notes: 'Strong backup option',
            requires_essay: true,
            requires_recommendations: true,
            requires_interview: false,
            requires_portfolio: false,
            requires_supplemental_essays: true,
            application_fee: 90,
            fee_waiver_applied: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-app-3',
            student_id: 'demo-user',
            college_id: 'berkeley',
            college_name: 'UC Berkeley',
            decision_type: 'RD',
            application_deadline: '2024-11-30',
            decision_release_date: '2025-03-31',
            status: 'not_started',
            priority: 'medium',
            notes: 'Target school - good match',
            requires_essay: true,
            requires_recommendations: false,
            requires_interview: false,
            requires_portfolio: false,
            requires_supplemental_essays: false,
            application_fee: 70,
            fee_waiver_applied: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setApplications(demoApplications);
        setIsLoading(false);
        return;
      }

      const students = await Student.list('-updated_date', 1);
      if (students.length > 0) {
        const studentData = students[0];
        setStudent(studentData);
        
        try {
        const appList = await AppTracker.filter(
          { student_id: studentData.id }, 
          '-updated_date'
        );
        setApplications(appList);
        } catch (error) {
          console.warn("Could not load applications (Firebase permissions not configured):", error);
          setApplications([]);
        }
      } else {
        console.log("No students found, using demo data");
        setApplications([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setApplications([]);
    }
    setIsLoading(false);
  };

  const handleAddApplication = (application) => {
    setApplications(prev => [...prev, application]);
  };

  const handleUpdateApplication = (updatedApplication) => {
    setApplications(prev => 
      prev.map(app => app.id === updatedApplication.id ? updatedApplication : app)
    );
  };

  const handleRemoveApplication = (applicationId) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Loading Applications...</h2>
            <p className="text-gray-600">We're retrieving your application data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckSquare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Decision Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your college applications, manage deadlines, and stay organized throughout the process.
          </p>
        </div>

        {/* Application Planner Component */}
        <ApplicationPlanner
          applications={applications}
          onUpdateApplication={handleUpdateApplication}
          onAddApplication={handleAddApplication}
          onRemoveApplication={handleRemoveApplication}
        />
      </div>
    </div>
  );
}