import React, { useState, useEffect } from "react";
import { Student, Essay } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { useAuth } from "@/contexts/AuthContext";
import EssayHub from "@/components/essays/EssayHub";
import EssayEditor from "@/components/essays/EssayEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  FileText, 
  Sparkles,
  BookOpen,
  Target,
  Users
} from 'lucide-react';
import { ESSAY_TYPES, ESSAY_STATUS } from '@/types/essays';

export default function EssayCoach() {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [essays, setEssays] = useState([]);
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      console.log("Current user:", currentUser);
      console.log("Loading data...");
      
      if (!currentUser) {
        console.log("No user authenticated, using demo data");
        const demoStudent = {
          id: 'demo-student',
          first_name: 'Demo',
          last_name: 'Student',
          intended_major: 'Computer Science',
          gpa: 3.8
        };
        setStudent(demoStudent);
        setEssays([]);
        setIsLoading(false);
        return;
      }
      
      const students = await Student.list('-updated_date', 1);
      console.log("Students loaded:", students);
      
      if (students.length > 0) {
        const studentData = students[0];
        setStudent(studentData);
        
        try {
          console.log("Loading essays for student:", studentData.id);
        const essayList = await Essay.filter({ student_id: studentData.id }, '-updated_date');
          console.log("Essays loaded:", essayList);
        setEssays(essayList);
        } catch (essayError) {
          console.warn("Could not load essays (Firebase permissions not configured):", essayError);
          setEssays([]);
        }
      } else {
        console.log("No students found, creating demo data");
        const demoStudent = {
          id: 'demo-student',
          first_name: 'Demo',
          last_name: 'Student',
          intended_major: 'Computer Science',
          gpa: 3.8
        };
        setStudent(demoStudent);
        setEssays([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setStudent(null);
      setEssays([]);
    }
    setIsLoading(false);
  };

  const handleUpdateEssay = (updatedEssay) => {
    setEssays(prevEssays => 
      prevEssays.map(essay => 
        essay.id === updatedEssay.id ? updatedEssay : essay
      )
    );
    
    if (selectedEssay && selectedEssay.id === updatedEssay.id) {
      setSelectedEssay(updatedEssay);
    }
  };

  const handleAddEssay = async (newEssay) => {
    try {
      const essayData = {
        ...newEssay,
        student_id: student?.id || 'demo-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (currentUser) {
        const createdEssay = await Essay.create(essayData);
        setEssays(prevEssays => [...prevEssays, createdEssay]);
      } else {
        // Demo mode - add to local state
        setEssays(prevEssays => [...prevEssays, essayData]);
      }
    } catch (error) {
      console.error("Error adding essay:", error);
      // Still add to local state for demo
      setEssays(prevEssays => [...prevEssays, newEssay]);
    }
  };

  const handleRemoveEssay = async (essayId) => {
    try {
      if (currentUser) {
        await Essay.delete(essayId);
      }
      setEssays(prevEssays => prevEssays.filter(essay => essay.id !== essayId));
      
      if (selectedEssay && selectedEssay.id === essayId) {
        setSelectedEssay(null);
      }
    } catch (error) {
      console.error("Error removing essay:", error);
      // Still remove from local state
      setEssays(prevEssays => prevEssays.filter(essay => essay.id !== essayId));
      if (selectedEssay && selectedEssay.id === essayId) {
        setSelectedEssay(null);
      }
    }
  };

  const handleSaveEssay = async (essay) => {
    try {
      if (currentUser) {
        await Essay.update(essay.id, essay);
      }
      handleUpdateEssay(essay);
    } catch (error) {
      console.error("Error saving essay:", error);
      // Still update local state
      handleUpdateEssay(essay);
    }
  };

  const handleAnalyzeEssay = async (content, essay) => {
    try {
      const prompt = `Please analyze this college application essay and provide detailed feedback:

Title: ${essay?.title || 'Untitled'}
Essay Type: ${essay?.essay_type || 'personal_statement'}
Target Word Count: ${essay?.word_limit || 650}
Current Word Count: ${content.trim().split(/\s+/).length}

Essay Content:
${content}

Provide comprehensive feedback covering:
1. Grammar and mechanics
2. Clarity and flow
3. Content and storytelling
4. Structure and organization
5. Voice and tone
6. Overall impression

For each category, provide a score out of 10 and specific actionable feedback.`;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            feedback_categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  score: { type: "number" },
                  feedback: { type: "string" },
                  suggestions: { type: "string" }
                }
              }
            },
            overall_score: { type: "number" },
            overall_feedback: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            areas_for_improvement: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    } catch (error) {
      console.error("Error analyzing essay:", error);
      // Return demo feedback for demo mode
      return {
        overall_score: 7,
        overall_feedback: "This is a solid essay with good potential. Consider adding more specific examples and refining your voice.",
        feedback_categories: [
          {
            category: "Grammar & Mechanics",
            score: 8,
            feedback: "Good grammar and sentence structure overall.",
            suggestions: "Watch for minor punctuation issues."
          },
          {
            category: "Clarity & Flow",
            score: 7,
            feedback: "Generally clear but could flow better between paragraphs.",
            suggestions: "Add transition sentences to improve flow."
          },
          {
            category: "Content & Storytelling",
            score: 6,
            feedback: "Good story but needs more specific details.",
            suggestions: "Add concrete examples and sensory details."
          },
          {
            category: "Structure & Organization",
            score: 7,
            feedback: "Well-organized with clear beginning, middle, and end.",
            suggestions: "Consider tightening the conclusion."
          },
          {
            category: "Voice & Tone",
            score: 6,
            feedback: "Voice is developing but could be more distinctive.",
            suggestions: "Let your personality shine through more."
          }
        ],
        strengths: [
          "Clear thesis statement",
          "Good use of personal experience",
          "Appropriate length"
        ],
        areas_for_improvement: [
          "Add more specific examples",
          "Strengthen the conclusion",
          "Develop a more distinctive voice"
        ]
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading your essays...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <PenTool className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2">AI Essay Coach</h1>
          <p className="text-gray-400 text-lg">Write, edit, and get AI feedback on your college essays</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Essay Hub */}
          <div className="xl:col-span-2">
            <EssayHub
              essays={essays}
              onUpdateEssay={handleUpdateEssay}
              onAddEssay={handleAddEssay}
              onRemoveEssay={handleRemoveEssay}
              onAnalyzeEssay={handleAnalyzeEssay}
            />
          </div>

          {/* Essay Editor */}
          <div className="xl:col-span-1">
            <Card className="border-gray-700 bg-gray-800/80 sticky top-8">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Essay Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEssay ? (
                  <EssayEditor
                    essay={selectedEssay}
                    onUpdateEssay={handleUpdateEssay}
                    onAnalyzeEssay={handleAnalyzeEssay}
                    onSaveEssay={handleSaveEssay}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No essay selected</h3>
                    <p className="text-gray-400 mb-4">Select an essay from the list to start editing</p>
                    <Button
                      onClick={() => {
                        // This will be handled by the EssayHub component
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Create New Essay
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}