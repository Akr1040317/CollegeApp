
import React, { useState, useEffect } from "react";
import { SelectedCollege } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Users, DollarSign, Calendar, BookOpen, CheckSquare, Star, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EssayPrompt from '../components/college/EssayPrompt';

export default function CollegeDetail() {
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  // Added student state as EssayPrompt component requires it
  const [student, setStudent] = useState(null); 

  useEffect(() => {
    loadCollegeData();
    // Assuming student data might be loaded here if available, or passed via context
    // For this implementation, student is initialized to null as per the outline's prop usage
  }, []);

  const loadCollegeData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const collegeId = urlParams.get('id');
      
      if (collegeId) {
        const collegeData = await SelectedCollege.list();
        const foundCollege = collegeData.find(c => c.id === collegeId);
        
        if (foundCollege) {
          setCollege(foundCollege);
          setNotes(foundCollege.notes || '');
          // You might load student data here if it's tied to the college selection or user
          // setStudent(someStudentData); 
        }
      }
    } catch (error) {
      console.error("Error loading college data:", error);
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = async (status) => {
    try {
      await SelectedCollege.update(college.id, { application_status: status });
      setCollege(prev => ({ ...prev, application_status: status }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await SelectedCollege.update(college.id, { notes });
      setCollege(prev => ({ ...prev, notes }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const getSchoolTypeColor = (type) => {
    switch (type) {
      case 'safety': return 'bg-green-100 text-green-800 border-green-200';
      case 'target': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reach': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Loading College Details...</h2>
            <p className="text-gray-600">Getting information ready.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <p>College not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            onClick={() => navigate(createPageUrl("SelectedColleges"))}
            variant="outline"
            className="mb-4 mx-auto" // Added mx-auto for centering
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selected Colleges
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.college_name}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{college.location}</span>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            <Badge className={`px-3 py-1 font-semibold ${getSchoolTypeColor(college.school_type)}`}>
              {college.school_type?.toUpperCase()} SCHOOL
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              {college.match_score}% Match
            </Badge>
          </div>

          <div className="flex flex-col items-center gap-2"> {/* To stack status badge and select */}
            <Badge className={`px-3 py-2 text-sm font-semibold ${getApplicationStatusColor(college.application_status)}`}>
              {college.application_status?.replace('_', ' ').toUpperCase()}
            </Badge>
            <Select
              value={college.application_status}
              onValueChange={handleUpdateStatus}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* College Overview */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                College Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 mb-6"> {/* Simplified grid for details within card */}
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Annual Tuition</p>
                    <p className="text-lg font-bold text-green-700">{college.tuition || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Enrollment</p>
                    <p className="text-lg font-bold text-blue-700">{college.enrollment || 'N/A'}</p>
                  </div>
                </div>
                {college.application_deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="text-lg font-bold text-red-700">{college.application_deadline}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Why This College Matches You:</h4>
                <p className="text-blue-800">{college.reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Application Requirements */}
          {college.requirements && college.requirements.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  Application Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4"> {/* Removed md:grid-cols-2 as it's now part of a larger grid */}
                  {college.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-emerald-900">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate(createPageUrl("ApplicationTracker"))}
                variant="outline"
                className="w-full justify-start"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Track Application
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("EssayCoach"))}
                variant="outline"
                className="w-full justify-start"
              >
                <Edit className="w-4 h-4 mr-2" />
                Write Essays
              </Button>
            </CardContent>
          </Card>

          {/* Personal Notes */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Personal Notes</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your personal notes about this college..."
                    rows={5}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNotes} size="sm">
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setNotes(college.notes || '');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {college.notes ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{college.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No notes yet. Click the edit button to add some.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Essay Prompts */}
        {college.essay_prompts && college.essay_prompts.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Essay Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {college.essay_prompts.map((prompt, index) => (
                <EssayPrompt 
                  key={index} 
                  prompt={prompt} 
                  college={college} 
                  student={student} 
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
