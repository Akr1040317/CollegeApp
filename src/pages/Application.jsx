
import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ProgressBar from "../components/application/ProgressBar";
import PersonalInfoStep from "../components/application/PersonalInfoStep";
import AcademicStep from "../components/application/AcademicStep";
import ExtracurricularsStep from "../components/application/ExtracurricularsStep";
import PreferencesStep from "../components/application/PreferencesStep";
import ReviewStep from "../components/application/ReviewStep";

const TOTAL_STEPS = 5;

export default function Application() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExistingApplication();
  }, [currentUser]);

  const loadExistingApplication = async () => {
    try {
      if (!currentUser) {
        console.log("No user authenticated, using demo data");
        return;
      }

      console.log("Loading application for user:", currentUser.uid);
      const applications = await Student.filter({ student_id: currentUser.uid });
      console.log("Found applications:", applications);
      
      if (applications.length > 0) {
        const existing = applications[0];
        setStudentData(existing);
        
        // Determine current step based on completed data
        let step = 1;
        const completed = [];
        
        if (existing.first_name && existing.last_name && existing.email) {
          completed.push(1);
          step = 2;
        }
        if (existing.gpa || existing.sat_score || existing.act_score) {
          completed.push(2);
          step = 3;
        }
        if (existing.extracurriculars && existing.extracurriculars.length > 0) {
          completed.push(3);
          step = 4;
        }
        if (existing.preferred_location || existing.school_size_preference) {
          completed.push(4);
          step = 5;
        }
        if (existing.application_status === 'completed') {
          completed.push(5);
        }
        
        setCompletedSteps(completed);
        setCurrentStep(step);
      }
    } catch (error) {
      console.error("Error loading application:", error);
      setError("Failed to load application data. Please try again.");
    }
  };

  const handleDataChange = (field, value) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return studentData.first_name && studentData.last_name && studentData.email;
      case 2:
        return studentData.gpa || studentData.sat_score || studentData.act_score;
      case 3:
        return true; // Extracurriculars are optional
      case 4:
        // Validate that percentages add up to 100%
        const safetyPercentage = studentData.safety_school_percentage || 30;
        const targetPercentage = studentData.target_school_percentage || 50;
        const reachPercentage = studentData.reach_school_percentage || 20;
        return (safetyPercentage + targetPercentage + reachPercentage) === 100;
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSaving(true);
    setError(null);
    try {
      if (!currentUser) {
        setError("Please sign in to save your application progress.");
        setIsSaving(false);
        return;
      }

      // Add user ID to student data
      const dataWithUserId = {
        ...studentData,
        student_id: currentUser.uid
      };

      // Save current progress
      const applications = await Student.filter({ student_id: currentUser.uid });
      if (applications.length > 0) {
        await Student.update(applications[0].id, dataWithUserId);
        console.log("Updated application:", applications[0].id);
      } else {
        const created = await Student.create(dataWithUserId);
        console.log("Created new application:", created.id);
      }

      // Mark step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Error saving application:", error);
      setError("Failed to save application. Please try again.");
    }
    setIsSaving(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetRecommendations = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      if (!currentUser) {
        setError("Please sign in to get recommendations.");
        setIsGenerating(false);
        return;
      }

      // Save final application
      const finalData = {
        ...studentData,
        student_id: currentUser.uid,
        application_status: 'completed'
      };

      console.log("Saving final application data:", finalData);

      const applications = await Student.filter({ student_id: currentUser.uid });
      let studentId;
      
      if (applications.length > 0) {
        await Student.update(applications[0].id, finalData);
        studentId = applications[0].id;
        console.log("Updated existing application:", studentId);
      } else {
        const created = await Student.create(finalData);
        studentId = created.id;
        console.log("Created new application:", studentId);
      }

      // Navigate to recommendations
      console.log("Navigating to recommendations...");
      navigate(createPageUrl("Recommendations"));
    } catch (error) {
      console.error("Error completing application:", error);
      setError("Failed to complete application. Please try again.");
    }
    setIsGenerating(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={studentData} onChange={handleDataChange} />;
      case 2:
        return <AcademicStep data={studentData} onChange={handleDataChange} />;
      case 3:
        return <ExtracurricularsStep data={studentData} onChange={handleDataChange} />;
      case 4:
        return <PreferencesStep data={studentData} onChange={handleDataChange} />;
      case 5:
        return <ReviewStep data={studentData} />;
      default:
        return null;
    }
  };

  const isValid = validateCurrentStep();

  return (
    <div className="py-12 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={currentStep} completedSteps={completedSteps} />
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-12">
          {renderCurrentStep()}
        </div>

        <div className="flex justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-8 py-3 text-base font-medium border-gray-600 hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={handleNext}
              disabled={!isValid || isSaving}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 text-base font-semibold shadow-lg"
            >
              {isSaving ? 'Saving...' : 'Next Step'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleGetRecommendations}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-8 py-3 text-base font-semibold shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get My Recommendations
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
