import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { SelectedCollege } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Target, Clock, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SelectedColleges() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const students = await Student.list('-updated_date', 1);
      if (students.length > 0) {
        const studentData = students[0];
        setStudent(studentData);
        
        const selected = await SelectedCollege.filter(
          { student_id: studentData.id },
          '-updated_date'
        );
        setSelectedColleges(selected);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const stats = {
    totalSelected: selectedColleges.length,
    notStarted: selectedColleges.filter(c => c.application_status === 'not_started' || !c.application_status).length,
    inProgress: selectedColleges.filter(c => c.application_status === 'in_progress').length,
    submitted: selectedColleges.filter(c => c.application_status === 'submitted').length,
    accepted: selectedColleges.filter(c => c.application_status === 'accepted').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto shadow-xl border-0 bg-white">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Loading Your Selected Colleges...</h2>
            <p className="text-gray-600">Getting your college list ready.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            My Selected Colleges
          </h1>
          <p className="text-gray-600 mt-1">Manage your college applications and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-900">{stats.totalSelected}</div>
              <div className="text-sm text-blue-700">Total Selected</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.notStarted}</div>
              <div className="text-sm text-gray-700">Not Started</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-yellow-900">{stats.inProgress}</div>
              <div className="text-sm text-yellow-700">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <FileText className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-900">{stats.submitted}</div>
              <div className="text-sm text-purple-700">Submitted</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-900">{stats.accepted}</div>
              <div className="text-sm text-emerald-700">Accepted</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {selectedColleges.length === 0 ? (
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-16 text-center">
              <GraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Colleges Selected Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start by getting personalized college recommendations based on your profile.
              </p>
              <Button 
                onClick={() => navigate(createPageUrl("Recommendations"))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-md"
              >
                <Target className="w-5 h-5 mr-2" />
                Get Recommendations
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedColleges.map((college) => (
              <Card key={college.id} className="shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{college.college_name}</h3>
                  <p className="text-gray-600 mb-4">{college.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Match: {college.match_score}%</span>
                    <Button 
                      onClick={() => navigate(createPageUrl(`CollegeDetail?college=${encodeURIComponent(college.college_name)}&id=${college.id}`))}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}