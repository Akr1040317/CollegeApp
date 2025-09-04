import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Lightbulb, 
  FileText, 
  Target,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { Student } from "@/api/entities";
import AIRecommendations from "@/components/ai/AIRecommendations";
import AIEssayAssistant from "@/components/ai/AIEssayAssistant";
import AIGuidance from "@/components/ai/AIGuidance";

export default function AIAssistant() {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [currentUser]);

  const loadStudentData = async () => {
    try {
      setIsLoading(true);
      
      if (!currentUser) {
        // Demo mode - use mock data
        setStudent({
          id: 'demo-user',
          first_name: 'Demo',
          last_name: 'Student',
          gpa: 3.8,
          gpa_scale: 4.0,
          sat_math: 650,
          sat_reading: 620,
          sat_writing: 630,
          academic_interests: 'Computer Science, Mathematics',
          extracurriculars: {
            leadership: [
              { position: 'Student Council President', organization: 'High School' }
            ],
            volunteer: [
              { organization: 'Local Food Bank', hours: 50 }
            ],
            work: [
              { position: 'Summer Intern', company: 'Tech Startup' }
            ],
            awards: [
              { title: 'National Merit Scholar' }
            ]
          },
          preferences: {
            location: { preferred_region: 'Northeast' },
            size: { preferred_size: 'Medium' },
            culture: { preferred_culture: ['Academic', 'Diverse'] },
            financial: { need_financial_aid: true },
            climate: { preferred_climate: 'Temperate' },
            type: { preferred_type: 'University' },
            focus: { preferred_focus: 'Research' }
          }
        });
        setIsLoading(false);
        return;
      }
      
      // Load from Firestore
      const students = await Student.list('-updated_date', 1);
      if (students.length > 0) {
        setStudent(students[0]);
      } else {
        // Redirect to profile setup
        setStudent(null);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
      // Fallback to demo data
      setStudent({
        id: 'demo-user',
        first_name: 'Demo',
        last_name: 'Student',
        gpa: 3.8,
        gpa_scale: 4.0,
        sat_math: 650,
        sat_reading: 620,
        sat_writing: 630,
        academic_interests: 'Computer Science, Mathematics',
        extracurriculars: {
          leadership: [
            { position: 'Student Council President', organization: 'High School' }
          ],
          volunteer: [
            { organization: 'Local Food Bank', hours: 50 }
          ],
          work: [
            { position: 'Summer Intern', company: 'Tech Startup' }
          ],
          awards: [
            { title: 'National Merit Scholar' }
          ]
        },
        preferences: {
          location: { preferred_region: 'Northeast' },
          size: { preferred_size: 'Medium' },
          culture: { preferred_culture: ['Academic', 'Diverse'] },
          financial: { need_financial_aid: true },
          climate: { preferred_climate: 'Temperate' },
          type: { preferred_type: 'University' },
          focus: { preferred_focus: 'Research' }
        }
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading AI Assistant...</p>
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2">AI College Assistant</h1>
          <p className="text-gray-400 text-lg">
            Get personalized recommendations, essay help, and application guidance powered by AI
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700 mb-8">
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-blue-600">
              <GraduationCap className="w-4 h-4 mr-2" />
              College Recommendations
            </TabsTrigger>
            <TabsTrigger value="essays" className="data-[state=active]:bg-purple-600">
              <FileText className="w-4 h-4 mr-2" />
              Essay Assistant
            </TabsTrigger>
            <TabsTrigger value="guidance" className="data-[state=active]:bg-green-600">
              <Target className="w-4 h-4 mr-2" />
              Application Guidance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <AIRecommendations 
              userProfile={student}
              preferences={student?.preferences}
              existingColleges={[]}
            />
          </TabsContent>

          <TabsContent value="essays" className="space-y-6">
            <AIEssayAssistant userProfile={student} />
          </TabsContent>

          <TabsContent value="guidance" className="space-y-6">
            <AIGuidance userProfile={student} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}