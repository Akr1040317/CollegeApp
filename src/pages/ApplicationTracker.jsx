import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { ApplicationTracker as AppTracker } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, Calendar, MapPin, Target, Clock, CheckCircle } from "lucide-react";

export default function ApplicationTracker() {
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
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
        
        const appList = await AppTracker.filter(
          { student_id: studentData.id }, 
          '-updated_date'
        );
        setApplications(appList);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const updateTaskStatus = async (appId, field, value) => {
    try {
      await AppTracker.update(appId, { [field]: value });
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getProgressPercentage = (app) => {
    const tasks = [
      app.common_application,
      app.personal_essay,
      app.letters_of_recommendation,
      app.official_transcripts,
      app.interview,
      app.sat_act_scores,
      app.supplemental_essays,
      app.portfolio,
      app.application_fee_payment
    ];
    const completed = tasks.filter(Boolean).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter(app => app.application_status === 'submitted').length,
    inProgress: applications.filter(app => app.application_status === 'in_progress').length,
    accepted: applications.filter(app => app.application_status === 'accepted').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-blue-600" />
              Application Tracker
            </h1>
            <p className="text-gray-600 mt-1">Track your college applications and stay organized</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-sm text-blue-700">Total Apps</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{stats.submitted}</div>
              <div className="text-sm text-green-700">Submitted</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">{stats.inProgress}</div>
              <div className="text-sm text-yellow-700">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-900">{stats.accepted}</div>
              <div className="text-sm text-emerald-700">Accepted</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-12 text-center">
              <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your college applications to stay organized.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <Card key={app.id} className="shadow-lg border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{app.college_name}</h3>
                        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1">
                          high priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{app.college_location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {app.application_deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">planning</Badge>
                      <div className="text-sm text-gray-600">{getProgressPercentage(app)}% Complete</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Application Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Column 1 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.common_application || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'common_application', checked)}
                          />
                          <label className="text-sm text-gray-700">Common Application</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.official_transcripts || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'official_transcripts', checked)}
                          />
                          <label className="text-sm text-gray-700">Official Transcripts</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.interview || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'interview', checked)}
                          />
                          <label className="text-sm text-gray-700">Interview</label>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.personal_essay || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'personal_essay', checked)}
                          />
                          <label className="text-sm text-gray-700">Personal Essay</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.sat_act_scores || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'sat_act_scores', checked)}
                          />
                          <label className="text-sm text-gray-700">SAT/ACT Scores</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.portfolio || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'portfolio', checked)}
                          />
                          <label className="text-sm text-gray-700">Portfolio (if applicable)</label>
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.letters_of_recommendation || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'letters_of_recommendation', checked)}
                          />
                          <label className="text-sm text-gray-700">Letters of Recommendation</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.supplemental_essays || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'supplemental_essays', checked)}
                          />
                          <label className="text-sm text-gray-700">Supplemental Essays</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={app.application_fee_payment || false}
                            onCheckedChange={(checked) => updateTaskStatus(app.id, 'application_fee_payment', checked)}
                          />
                          <label className="text-sm text-gray-700">Application Fee Payment</label>
                        </div>
                      </div>
                    </div>
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