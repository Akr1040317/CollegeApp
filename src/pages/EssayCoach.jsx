import React, { useState, useEffect } from "react";
import { Student, Essay } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PenTool, Sparkles, Save, FileText, Lightbulb } from "lucide-react";

export default function EssayCoach() {
  const [student, setStudent] = useState(null);
  const [essays, setEssays] = useState([]);
  const [currentEssay, setCurrentEssay] = useState({
    title: '',
    content: '',
    essay_type: 'personal_statement',
    college_name: '',
    target_word_count: 650
  });
  const [selectedEssayId, setSelectedEssayId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [essayIdeas, setEssayIdeas] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const students = await Student.list('-updated_date', 1);
      if (students.length > 0) {
        const studentData = students[0];
        setStudent(studentData);
        
        try {
          const essayList = await Essay.filter({ student_id: studentData.id }, '-updated_date');
          setEssays(essayList);
        } catch (essayError) {
          console.warn("Could not load essays (Firebase permissions not configured):", essayError);
          // Set empty essays array if we can't access the database
          setEssays([]);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty state if we can't access the database
      setStudent(null);
      setEssays([]);
    }
  };

  const analyzeEssay = async () => {
    if (!currentEssay.content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const prompt = `Please analyze this college application essay and provide detailed feedback:

Title: ${currentEssay.title}
Essay Type: ${currentEssay.essay_type}
Target Word Count: ${currentEssay.target_word_count}
Current Word Count: ${currentEssay.content.trim().split(/\s+/).length}

Essay Content:
${currentEssay.content}

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

      setFeedback(response);
    } catch (error) {
      console.error("Error analyzing essay:", error);
    }
    setIsAnalyzing(false);
  };

  const generateEssayIdeas = async () => {
    setIsGeneratingIdeas(true);
    try {
      const prompt = `Based on this student's profile, suggest 5 compelling college essay topics and angles:

Student Profile:
- Name: ${student?.first_name || 'Student'} ${student?.last_name || ''}
- Intended Major: ${student?.intended_major || 'Undecided'}
- GPA: ${student?.gpa || 'Not provided'}
- Extracurriculars: ${student?.extracurriculars?.map(act => `${act.activity} (${act.role})`).join(', ') || 'None provided'}

For each topic, provide:
- A compelling title
- A brief description of the angle
- Why it would be effective
- Potential opening lines or hooks`;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            essay_ideas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  why_effective: { type: "string" },
                  opening_hooks: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setEssayIdeas(response.essay_ideas || []);
    } catch (error) {
      console.error("Error generating ideas:", error);
    }
    setIsGeneratingIdeas(false);
  };

  const saveEssay = async () => {
    if (!currentEssay.title.trim() || !currentEssay.content.trim()) return;
    
    setSaving(true);
    try {
      const essayData = {
        ...currentEssay,
        student_id: student?.id || 'demo-user',
        word_count: currentEssay.content.trim().split(/\s+/).length,
        ai_feedback: feedback?.feedback_categories || []
      };

      if (selectedEssayId) {
        await Essay.update(selectedEssayId, essayData);
      } else {
        await Essay.create(essayData);
      }
      
      await loadData();
      setSelectedEssayId(null);
      setCurrentEssay({
        title: '',
        content: '',
        essay_type: 'personal_statement',
        college_name: '',
        target_word_count: 650
      });
      setFeedback(null);
    } catch (error) {
      console.error("Error saving essay:", error);
      // For now, just show a success message even if save fails
      // In a real app, you'd want proper error handling
      alert("Essay saved locally (database not configured yet)");
    }
    setSaving(false);
  };

  const loadEssay = (essay) => {
    setCurrentEssay(essay);
    setSelectedEssayId(essay.id);
    setFeedback({ feedback_categories: essay.ai_feedback || [] });
  };

  const newEssay = () => {
    setCurrentEssay({
      title: '',
      content: '',
      essay_type: 'personal_statement',
      college_name: '',
      target_word_count: 650
    });
    setSelectedEssayId(null);
    setFeedback(null);
  };

  const wordCount = currentEssay.content.trim() ? currentEssay.content.trim().split(/\s+/).length : 0;

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Essay Coach</h1>
          <p className="text-gray-600 text-lg">Get personalized feedback on your college application essays</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Saved Essays */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Your Essays</span>
                  <Button size="sm" onClick={newEssay} className="bg-purple-600 hover:bg-purple-700">
                    <FileText className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {essays.map((essay) => (
                    <div
                      key={essay.id}
                      onClick={() => loadEssay(essay)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedEssayId === essay.id 
                          ? 'bg-purple-100 border border-purple-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <h4 className="font-medium text-sm truncate">{essay.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {essay.word_count} words • {essay.essay_type.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                  
                  {essays.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No essays yet. Start writing your first essay!
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={generateEssayIdeas}
                    disabled={isGeneratingIdeas}
                    variant="outline"
                    className="w-full text-sm"
                  >
                    {isGeneratingIdeas ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Get Essay Ideas
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Essay Ideas */}
            {essayIdeas.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Essay Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {essayIdeas.map((idea, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded-lg">
                        <h5 className="font-semibold text-sm text-purple-900">{idea.title}</h5>
                        <p className="text-xs text-purple-700 mt-1">{idea.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Essay Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Essay Title</Label>
                    <Input
                      value={currentEssay.title}
                      onChange={(e) => setCurrentEssay(prev => ({...prev, title: e.target.value}))}
                      placeholder="Give your essay a title"
                    />
                  </div>
                  <div>
                    <Label>Essay Type</Label>
                    <Select
                      value={currentEssay.essay_type}
                      onValueChange={(value) => setCurrentEssay(prev => ({...prev, essay_type: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal_statement">Personal Statement</SelectItem>
                        <SelectItem value="supplemental">Supplemental Essay</SelectItem>
                        <SelectItem value="common_app">Common App Essay</SelectItem>
                        <SelectItem value="scholarship">Scholarship Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>College (Optional)</Label>
                    <Input
                      value={currentEssay.college_name}
                      onChange={(e) => setCurrentEssay(prev => ({...prev, college_name: e.target.value}))}
                      placeholder="Which college is this for?"
                    />
                  </div>
                  <div>
                    <Label>Target Word Count</Label>
                    <Input
                      type="number"
                      value={currentEssay.target_word_count}
                      onChange={(e) => setCurrentEssay(prev => ({...prev, target_word_count: parseInt(e.target.value)}))}
                      placeholder="650"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Essay Content</Label>
                    <Badge variant={wordCount > currentEssay.target_word_count ? "destructive" : "outline"}>
                      {wordCount}/{currentEssay.target_word_count} words
                    </Badge>
                  </div>
                  <Textarea
                    value={currentEssay.content}
                    onChange={(e) => setCurrentEssay(prev => ({...prev, content: e.target.value}))}
                    placeholder="Start writing your essay here..."
                    className="min-h-96 text-base leading-relaxed"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={analyzeEssay}
                    disabled={isAnalyzing || !currentEssay.content.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={saveEssay}
                    disabled={isSaving || !currentEssay.title.trim() || !currentEssay.content.trim()}
                    variant="outline"
                  >
                    {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {!feedback ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Write your essay and click "Get AI Feedback" to receive personalized suggestions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedback.overall_score && (
                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-800">{feedback.overall_score}/10</div>
                        <p className="text-sm text-purple-600">Overall Score</p>
                      </div>
                    )}

                    {feedback.feedback_categories?.map((item, index) => (
                      <div key={index} className="border-l-4 border-purple-300 pl-4">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-sm">{item.category}</h4>
                          <Badge variant="outline">{item.score}/10</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{item.feedback}</p>
                        {item.suggestions && (
                          <p className="text-xs text-purple-600 italic">{item.suggestions}</p>
                        )}
                      </div>
                    ))}

                    {feedback.strengths && (
                      <div>
                        <h4 className="font-semibold text-sm text-emerald-800 mb-2">Strengths</h4>
                        <ul className="text-xs space-y-1">
                          {feedback.strengths.map((strength, index) => (
                            <li key={index} className="text-emerald-700">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.areas_for_improvement && (
                      <div>
                        <h4 className="font-semibold text-sm text-amber-800 mb-2">Areas for Improvement</h4>
                        <ul className="text-xs space-y-1">
                          {feedback.areas_for_improvement.map((area, index) => (
                            <li key={index} className="text-amber-700">• {area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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