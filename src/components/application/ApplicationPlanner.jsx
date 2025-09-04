import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Target,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { 
  DECISION_TYPES, 
  APPLICATION_STATUS, 
  TASK_TYPES, 
  PRIORITY_LEVELS,
  getDecisionTypeLabel,
  getStatusLabel,
  getTaskTypeLabel,
  getPriorityColor,
  getStatusColor,
  generateApplicationTimeline,
  generateTaskList
} from '@/types/application';

export default function ApplicationPlanner({ 
  applications = [], 
  onUpdateApplication, 
  onAddApplication, 
  onRemoveApplication 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newApplication, setNewApplication] = useState({
    college_name: '',
    decision_type: DECISION_TYPES.REGULAR_DECISION,
    application_deadline: '',
    decision_release_date: '',
    priority: PRIORITY_LEVELS.MEDIUM,
    notes: '',
    requires_essay: true,
    requires_recommendations: true,
    requires_interview: false,
    requires_portfolio: false,
    requires_supplemental_essays: false,
    application_fee: 0,
    fee_waiver_applied: false
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (days) => {
    if (days === null) return 'none';
    if (days < 0) return 'overdue';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'normal';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      overdue: 'text-red-600 bg-red-50 border-red-200',
      urgent: 'text-orange-600 bg-orange-50 border-orange-200',
      soon: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      normal: 'text-green-600 bg-green-50 border-green-200',
      none: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[urgency] || colors.none;
  };

  const handleAddApplication = () => {
    if (!newApplication.college_name || !newApplication.application_deadline) return;
    
    const application = {
      ...newApplication,
      id: `app-${Date.now()}`,
      student_id: 'current-user', // This would come from auth context
      college_id: `college-${Date.now()}`,
      status: APPLICATION_STATUS.NOT_STARTED,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onAddApplication(application);
    setNewApplication({
      college_name: '',
      decision_type: DECISION_TYPES.REGULAR_DECISION,
      application_deadline: '',
      decision_release_date: '',
      priority: PRIORITY_LEVELS.MEDIUM,
      notes: '',
      requires_essay: true,
      requires_recommendations: true,
      requires_interview: false,
      requires_portfolio: false,
      requires_supplemental_essays: false,
      application_fee: 0,
      fee_waiver_applied: false
    });
    setIsEditing(false);
  };

  const handleUpdateApplication = (application) => {
    onUpdateApplication(application);
    setSelectedApplication(null);
    setIsEditing(false);
  };

  const handleRemoveApplication = (applicationId) => {
    onRemoveApplication(applicationId);
    setSelectedApplication(null);
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const submitted = applications.filter(app => app.status === APPLICATION_STATUS.SUBMITTED).length;
    const inProgress = applications.filter(app => app.status === APPLICATION_STATUS.IN_PROGRESS).length;
    const accepted = applications.filter(app => app.status === APPLICATION_STATUS.ACCEPTED).length;
    const rejected = applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length;
    
    return { total, submitted, inProgress, accepted, rejected };
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return applications
      .filter(app => {
        const deadline = new Date(app.application_deadline);
        return deadline >= now && deadline <= next30Days;
      })
      .sort((a, b) => new Date(a.application_deadline) - new Date(b.application_deadline));
  };

  const stats = getApplicationStats();
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-200">Application Decision Planner</CardTitle>
          <p className="text-gray-400">Manage your college applications and track deadlines</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-300">{stats.total}</div>
              <div className="text-sm text-blue-400">Total Applications</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-300">{stats.inProgress}</div>
              <div className="text-sm text-purple-400">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-300">{stats.submitted}</div>
              <div className="text-sm text-green-400">Submitted</div>
            </div>
            <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <GraduationCap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-300">{stats.accepted}</div>
              <div className="text-sm text-emerald-400">Accepted</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-300">{stats.rejected}</div>
              <div className="text-sm text-red-400">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-blue-600">
            <FileText className="w-4 h-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600">
            <Calendar className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No upcoming deadlines in the next 30 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingDeadlines.map((app) => {
                    const days = getDaysUntilDeadline(app.application_deadline);
                    const urgency = getUrgencyLevel(days);
                    
                    return (
                      <div key={app.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{app.college_name}</h4>
                          <p className="text-gray-400 text-sm">
                            {getDecisionTypeLabel(app.decision_type)} • {formatDate(app.application_deadline)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(app.status)}>
                            {getStatusLabel(app.status)}
                          </Badge>
                          <Badge className={getUrgencyColor(urgency)}>
                            {days === null ? 'No date' : days < 0 ? 'Overdue' : `${days} days`}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveTab('applications')}
                  className="bg-blue-600 hover:bg-blue-700 h-20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Application
                </Button>
                <Button
                  onClick={() => setActiveTab('timeline')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 h-20"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  View Timeline
                </Button>
                <Button
                  onClick={() => setActiveTab('tasks')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 h-20"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Manage Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-200">Your Applications</h3>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>

          {/* Add/Edit Application Form */}
          {isEditing && (
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Add New Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">College Name</Label>
                    <Input
                      value={newApplication.college_name}
                      onChange={(e) => setNewApplication(prev => ({...prev, college_name: e.target.value}))}
                      placeholder="Enter college name"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Decision Type</Label>
                    <Select
                      value={newApplication.decision_type}
                      onValueChange={(value) => setNewApplication(prev => ({...prev, decision_type: value}))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {Object.values(DECISION_TYPES).map(type => (
                          <SelectItem key={type} value={type}>
                            {getDecisionTypeLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Application Deadline</Label>
                    <Input
                      type="date"
                      value={newApplication.application_deadline}
                      onChange={(e) => setNewApplication(prev => ({...prev, application_deadline: e.target.value}))}
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Decision Release Date (Optional)</Label>
                    <Input
                      type="date"
                      value={newApplication.decision_release_date}
                      onChange={(e) => setNewApplication(prev => ({...prev, decision_release_date: e.target.value}))}
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Requirements</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_essay"
                        checked={newApplication.requires_essay}
                        onCheckedChange={(checked) => setNewApplication(prev => ({...prev, requires_essay: checked}))}
                      />
                      <Label htmlFor="requires_essay" className="text-gray-300">Essay Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_recommendations"
                        checked={newApplication.requires_recommendations}
                        onCheckedChange={(checked) => setNewApplication(prev => ({...prev, requires_recommendations: checked}))}
                      />
                      <Label htmlFor="requires_recommendations" className="text-gray-300">Recommendations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_interview"
                        checked={newApplication.requires_interview}
                        onCheckedChange={(checked) => setNewApplication(prev => ({...prev, requires_interview: checked}))}
                      />
                      <Label htmlFor="requires_interview" className="text-gray-300">Interview</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_portfolio"
                        checked={newApplication.requires_portfolio}
                        onCheckedChange={(checked) => setNewApplication(prev => ({...prev, requires_portfolio: checked}))}
                      />
                      <Label htmlFor="requires_portfolio" className="text-gray-300">Portfolio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_supplemental_essays"
                        checked={newApplication.requires_supplemental_essays}
                        onCheckedChange={(checked) => setNewApplication(prev => ({...prev, requires_supplemental_essays: checked}))}
                      />
                      <Label htmlFor="requires_supplemental_essays" className="text-gray-300">Supplemental Essays</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Notes</Label>
                  <Textarea
                    value={newApplication.notes}
                    onChange={(e) => setNewApplication(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Add any notes about this application..."
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddApplication}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card className="border-gray-700 bg-gray-800/80">
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No applications yet</h3>
                  <p className="text-gray-400 mb-4">Start by adding your first college application</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Application
                  </Button>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => {
                const days = getDaysUntilDeadline(app.application_deadline);
                const urgency = getUrgencyLevel(days);
                
                return (
                  <Card key={app.id} className="border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-white mb-2">{app.college_name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span>{getDecisionTypeLabel(app.decision_type)}</span>
                            <span>•</span>
                            <span>Due: {formatDate(app.application_deadline)}</span>
                            {app.decision_release_date && (
                              <>
                                <span>•</span>
                                <span>Decision: {formatDate(app.decision_release_date)}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getStatusColor(app.status)}>
                              {getStatusLabel(app.status)}
                            </Badge>
                            <Badge className={getUrgencyColor(urgency)}>
                              {days === null ? 'No date' : days < 0 ? 'Overdue' : `${days} days left`}
                            </Badge>
                            <Badge className={getPriorityColor(app.priority)}>
                              {app.priority.toUpperCase()}
                            </Badge>
                          </div>
                          {app.notes && (
                            <p className="text-gray-300 text-sm">{app.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setSelectedApplication(app)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleRemoveApplication(app.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Application Timeline</CardTitle>
              <p className="text-gray-400">View all your application deadlines and important dates</p>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No applications to display</h3>
                  <p className="text-gray-400">Add some applications to see your timeline</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications
                    .sort((a, b) => new Date(a.application_deadline) - new Date(b.application_deadline))
                    .map((app) => {
                      const timeline = generateApplicationTimeline(app);
                      const days = getDaysUntilDeadline(app.application_deadline);
                      const urgency = getUrgencyLevel(days);
                      
                      return (
                        <div key={app.id} className="border border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white">{app.college_name}</h4>
                            <Badge className={getUrgencyColor(urgency)}>
                              {days === null ? 'No date' : days < 0 ? 'Overdue' : `${days} days left`}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {timeline.map((event) => (
                              <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-700/50 rounded">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <div className="flex-1">
                                  <span className="text-white font-medium">{event.title}</span>
                                  <span className="text-gray-400 text-sm ml-2">{formatDate(event.event_date)}</span>
                                </div>
                                {event.is_important && (
                                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                                    Important
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Application Tasks</CardTitle>
              <p className="text-gray-400">Track your progress on application requirements</p>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No tasks to display</h3>
                  <p className="text-gray-400">Add some applications to see your tasks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const tasks = generateTaskList(app);
                    
                    return (
                      <div key={app.id} className="border border-gray-600 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-4">{app.college_name}</h4>
                        <div className="space-y-2">
                          {tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded">
                              <Checkbox
                                checked={task.is_completed}
                                onCheckedChange={(checked) => {
                                  // Handle task completion
                                  console.log('Task completed:', task.id, checked);
                                }}
                              />
                              <div className="flex-1">
                                <span className="text-white font-medium">{task.title}</span>
                                <span className="text-gray-400 text-sm ml-2">• {formatDate(task.due_date)}</span>
                              </div>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority.toUpperCase()}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
