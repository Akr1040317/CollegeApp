import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { SelectedCollege } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Star, MapPin, Users, DollarSign, TrendingUp, Heart, Plus, List, BarChart3, Target, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CollegeSearch from "@/components/college/CollegeSearch";
import CollegeList from "@/components/college/CollegeList";
import CollegeComparison from "@/components/college/CollegeComparison";
import CollegeDetail from "@/components/college/CollegeDetail";
import { MOCK_COLLEGES } from "@/types/college";

export default function Recommendations() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-recommendations");
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const students = await Student.list('-updated_date', 1);
      if (students.length > 0) {
        const studentData = students[0];
        setStudent(studentData);
        
        // Load selected colleges
        const selected = await SelectedCollege.filter({ student_id: studentData.id });
        setSelectedColleges(selected.map(s => s.college_name));

        if (studentData.college_recommendations && studentData.college_recommendations.length > 0) {
          setRecommendations(studentData.college_recommendations);
          setIsLoading(false);
        } else {
          await generateRecommendations(studentData);
        }
      } else {
        navigate(createPageUrl("Application"));
      }
    } catch (error) {
      console.error("Error loading student data:", error);
      setIsLoading(false);
    }
  };

  const generateRecommendations = async (studentData) => {
    setIsGenerating(true);
    try {
      const totalRecommendations = studentData.recommendation_count || 10;
      const safetyPercentage = studentData.safety_school_percentage || 30;
      const targetPercentage = studentData.target_school_percentage || 50;
      const reachPercentage = studentData.reach_school_percentage || 20;

      let safetyCount = Math.round(totalRecommendations * (safetyPercentage / 100));
      let targetCount = Math.round(totalRecommendations * (targetPercentage / 100));
      let reachCount = Math.round(totalRecommendations * (reachPercentage / 100));

      // Adjust counts to ensure they sum up to totalRecommendations
      let currentSum = safetyCount + targetCount + reachCount;
      if (currentSum !== totalRecommendations) {
          if (currentSum < totalRecommendations) {
              targetCount += (totalRecommendations - currentSum);
          } else {
              if (targetCount > 0) targetCount -= (currentSum - totalRecommendations);
              if (targetCount < 0) {
                  safetyCount += targetCount;
                  targetCount = 0;
              }
          }
      }

      const prompt = `Based on the following student profile, provide ${totalRecommendations} personalized college recommendations. Be specific and realistic.

Student Profile:
- Name: ${studentData.first_name} ${studentData.last_name}
- Zipcode: ${studentData.zipcode || 'Not provided'}
- GPA: ${studentData.gpa || 'Not provided'}
- SAT Score: ${studentData.sat_score || 'Not provided'} 
- ACT Score: ${studentData.act_score || 'Not provided'}
- Intended Major: ${studentData.intended_major || 'Undecided'}
- Preferred Location: ${studentData.preferred_location || 'No preference'}
- School Size Preference: ${studentData.school_size_preference || 'No preference'}
- Extracurriculars: ${studentData.extracurriculars?.map(act => `${act.activity} (${act.role})`).join(', ') || 'None provided'}

Recommendation Requirements:
- ${safetyCount} Safety Schools (high acceptance probability)
- ${targetCount} Target Schools (good match for profile)  
- ${reachCount} Reach Schools (more competitive)

For each college, provide:
1. College name
2. Location (city, state)
3. Acceptance rate
4. Match score (70-95 for safety, 60-85 for target, 40-75 for reach)
5. School type (safety/target/reach)
6. Detailed reasoning for why it's a good fit
7. Estimated annual tuition
8. Student enrollment
9. Application deadline
10. 2-3 typical essay prompts for this college
11. Key application requirements

Focus on real, accredited colleges and universities. Provide accurate information.`;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            colleges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  college_name: { type: "string" },
                  location: { type: "string" },
                  acceptance_rate: { type: "string" },
                  match_score: { type: "number" },
                  school_type: { type: "string", enum: ["safety", "target", "reach"] },
                  reasoning: { type: "string" },
                  tuition: { type: "string" },
                  enrollment: { type: "string" },
                  application_deadline: { type: "string" },
                  essay_prompts: { type: "array", items: { type: "string" } },
                  requirements: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      const collegeRecommendations = response.colleges || [];
      setRecommendations(collegeRecommendations);

      // Save recommendations to student record
      await Student.update(studentData.id, {
        college_recommendations: collegeRecommendations
      });

    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
    setIsGenerating(false);
    setIsLoading(false);
  };

  const handleAddCollege = async (college) => {
    try {
      // Convert college to selected college format
      const selectedCollegeData = {
        student_id: student.id,
        college_name: college.name,
        location: `${college.city}, ${college.state}`,
        match_score: 85, // Default match score
        school_type: college.user_category || 'target',
        reasoning: `Added from college search - ${college.description || 'No description available'}`,
        tuition: college.tuition_out_state || college.tuition_in_state || 'N/A',
        enrollment: college.enrollment?.toString() || 'N/A',
        application_deadline: college.regular_decision_deadline || 'N/A',
        essay_prompts: [],
        requirements: []
      };

      await SelectedCollege.create(selectedCollegeData);
      setSelectedColleges(prev => [...prev, college.name]);
    } catch (error) {
      console.error("Error adding college:", error);
    }
  };

  const handleUpdateCollege = async (updatedCollege) => {
    try {
      // Update in selected colleges list
      setSelectedColleges(prev => 
        prev.map(name => name === updatedCollege.name ? updatedCollege.name : name)
      );
      // Here you would also update in the database
    } catch (error) {
      console.error("Error updating college:", error);
    }
  };

  const handleRemoveCollege = async (collegeId) => {
    try {
      // Remove from selected colleges list
      setSelectedColleges(prev => prev.filter(name => name !== collegeId));
      // Here you would also remove from the database
    } catch (error) {
      console.error("Error removing college:", error);
    }
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
  };

  const handleRegenerateRecommendations = () => {
    setRecommendations([]);
    generateRecommendations(student);
  };

  const getSchoolTypeColor = (type) => {
    switch (type) {
      case 'safety': return 'bg-green-100 text-green-800 border-green-200';
      case 'target': return 'bg-blue-100 text-blue-800 border-blue-200';  
      case 'reach': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {isLoading ? 'Loading Your Profile...' : 'Generating Recommendations...'}
            </h2>
            <p className="text-gray-600">
              {isLoading 
                ? 'We\'re retrieving your application data.' 
                : 'Our AI is analyzing your profile and finding the perfect college matches for you.'
              }
            </p>
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
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            College Research & Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover, research, and manage your college applications all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Application"))}
              className="px-6 py-3 text-base font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Edit Application
            </Button>
            <Button
              onClick={handleRegenerateRecommendations}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-6 py-3 text-base font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Get New Recommendations
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700 mb-8">
            <TabsTrigger value="ai-recommendations" className="data-[state=active]:bg-emerald-600">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-blue-600">
              <Search className="w-4 h-4 mr-2" />
              Search Colleges
            </TabsTrigger>
            <TabsTrigger value="my-list" className="data-[state=active]:bg-purple-600">
              <Heart className="w-4 h-4 mr-2" />
              My List
            </TabsTrigger>
            <TabsTrigger value="compare" className="data-[state=active]:bg-orange-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare
            </TabsTrigger>
          </TabsList>

          {/* AI Recommendations Tab */}
          <TabsContent value="ai-recommendations" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your AI-Powered College Recommendations</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Based on your profile, we've found colleges that match your academic profile, preferences, and goals.
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-8">
                {/* Reach Schools */}
                {recommendations.filter(r => r.school_type === 'reach').length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-red-500" />
                      Reach Schools
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recommendations.filter(r => r.school_type === 'reach').map((rec, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{rec.college_name}</CardTitle>
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                Reach
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{rec.location}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Match Score</span>
                                <span className="font-semibold text-lg">{rec.match_score}/100</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Acceptance Rate</span>
                                <span className="font-semibold">{rec.acceptance_rate}</span>
                              </div>
                              <Button 
                                onClick={() => handleAddCollege(rec.college_name)}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to My List
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Schools */}
                {recommendations.filter(r => r.school_type === 'target').length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-yellow-500" />
                      Target Schools
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recommendations.filter(r => r.school_type === 'target').map((rec, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{rec.college_name}</CardTitle>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                Target
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{rec.location}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Match Score</span>
                                <span className="font-semibold text-lg">{rec.match_score}/100</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Acceptance Rate</span>
                                <span className="font-semibold">{rec.acceptance_rate}</span>
                              </div>
                              <Button 
                                onClick={() => handleAddCollege(rec.college_name)}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to My List
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safety Schools */}
                {recommendations.filter(r => r.school_type === 'safety').length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      Safety Schools
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recommendations.filter(r => r.school_type === 'safety').map((rec, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{rec.college_name}</CardTitle>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Safety
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{rec.location}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Match Score</span>
                                <span className="font-semibold text-lg">{rec.match_score}/100</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Acceptance Rate</span>
                                <span className="font-semibold">{rec.acceptance_rate}</span>
                              </div>
                              <Button 
                                onClick={() => handleAddCollege(rec.college_name)}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to My List
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <Card className="max-w-4xl mx-auto mt-8 border-0 bg-gradient-to-r from-blue-50 to-emerald-50">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Add colleges to your list, then research them in detail and plan your application strategy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={() => setActiveTab('my-list')}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        View My List
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('search')}
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search More Colleges
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto text-center">
                <CardContent className="p-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Recommendations Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Complete your application profile to get personalized college recommendations.
                  </p>
                  <Button 
                    onClick={() => navigate(createPageUrl("Application"))}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    Complete Application
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CollegeSearch 
                  onCollegeSelect={handleCollegeSelect}
                  selectedColleges={selectedColleges}
                />
              </div>
              <div className="lg:col-span-1">
                <CollegeDetail 
                  college={selectedCollege}
                  onAddToList={handleAddCollege}
                  onUpdateCollege={handleUpdateCollege}
                  isInList={selectedCollege && selectedColleges.includes(selectedCollege.name)}
                />
              </div>
            </div>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {/* Student Summary */}
            {student && (
              <Card className="max-w-4xl mx-auto mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-center text-gray-900">
                    Profile Summary for {student.first_name} {student.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <p className="text-sm text-gray-500">GPA</p>
                      <p className="text-lg font-bold text-gray-900">{student.gpa || 'N/A'}/4.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">SAT Score</p>
                      <p className="text-lg font-bold text-gray-900">{student.sat_score || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Intended Major</p>
                      <p className="text-lg font-bold text-gray-900">{student.intended_major || 'Undecided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Activities</p>
                      <p className="text-lg font-bold text-gray-900">{student.extracurriculars?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* School Type Summary */}
            {recommendations.length > 0 && (
              <div className="flex justify-center mb-8">
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {recommendations.filter(c => c.school_type === 'safety').length}
                    </div>
                    <div className="text-gray-600">Safety</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {recommendations.filter(c => c.school_type === 'target').length}
                    </div>
                    <div className="text-gray-600">Target</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {recommendations.filter(c => c.school_type === 'reach').length}
                    </div>
                    <div className="text-gray-600">Reach</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Grid */}
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations
                  .sort((a, b) => b.match_score - a.match_score)
                  .map((college, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500" />
                      
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-800 transition-colors">
                              {college.college_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{college.location}</p>
                          </div>
                          
                          <div className="text-center">
                            <Badge className={`px-3 py-1 font-semibold border mb-2 ${getSchoolTypeColor(college.school_type)}`}>
                              {college.school_type?.toUpperCase()}
                            </Badge>
                            <div className="text-sm font-semibold text-gray-900">{college.match_score}% Match</div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleAddCollege({ name: college.college_name, city: college.location.split(',')[0], state: college.location.split(',')[1]?.trim() })}
                          variant={selectedColleges.includes(college.college_name) ? "default" : "outline"}
                          className={`w-full mt-3 ${selectedColleges.includes(college.college_name) 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'}`}
                        >
                          {selectedColleges.includes(college.college_name) ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Select College
                            </>
                          )}
                        </Button>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Acceptance Rate</p>
                            <p className="font-semibold text-emerald-700">{college.acceptance_rate}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Enrollment</p>
                            <p className="font-semibold text-blue-700">{college.enrollment}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Why this is a perfect fit:</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{college.reasoning}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Match Confidence</span>
                            <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${college.match_score}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700">{college.match_score}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    No Recommendations Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Complete your application to receive personalized college recommendations.
                  </p>
                  <Button
                    onClick={() => navigate(createPageUrl("Application"))}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Complete Application
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My List Tab */}
          <TabsContent value="my-list" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">My College List</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage your college list, categorize schools, and plan your application strategy.
              </p>
            </div>

            {/* Decision Type Planning */}
            <Card className="max-w-4xl mx-auto mb-8 border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-xl text-center text-gray-900">
                  Application Strategy Planning
                </CardTitle>
                <p className="text-center text-gray-600">
                  Plan which decision type you'll use for each school
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Early Decision (ED)</h3>
                    <p className="text-sm text-red-600">Binding commitment, early deadline</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">Restricted Early Action (REA)</h3>
                    <p className="text-sm text-orange-600">Non-binding, but can't apply ED elsewhere</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Early Action (EA)</h3>
                    <p className="text-sm text-yellow-600">Non-binding, early deadline</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Regular Decision (RD)</h3>
                    <p className="text-sm text-green-600">Standard deadline, non-binding</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => navigate(createPageUrl("ApplicationTracker"))}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Plan Application Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>

            <CollegeList 
              colleges={selectedColleges.map(name => MOCK_COLLEGES.find(c => c.name === name)).filter(Boolean)}
              onUpdateCollege={handleUpdateCollege}
              onRemoveCollege={handleRemoveCollege}
            />
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-6">
            <CollegeComparison 
              colleges={selectedColleges.map(name => MOCK_COLLEGES.find(c => c.name === name)).filter(Boolean)}
              onAddCollege={handleAddCollege}
              onRemoveCollege={handleRemoveCollege}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}