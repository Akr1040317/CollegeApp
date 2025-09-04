import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, X, Calendar, Clock, Star, Award, Briefcase, Heart, Trophy } from 'lucide-react';

export default function ExtracurricularsStep({ data, onChange }) {
  const [activeTab, setActiveTab] = useState('extracurriculars');
  
  const activities = data.extracurriculars || [];
  const leadership = data.leadership_positions || [];
  const volunteer = data.volunteer_work || [];
  const work = data.work_experience || [];
  const awards = data.awards_honors || [];

  // Extracurricular Activities
  const addActivity = () => {
    const newActivities = [...activities, { 
      activity: '', 
      role: '', 
      organization: '',
      start_date: '',
      end_date: '',
      current: false,
      hours_per_week: '',
      description: '',
      achievements: [],
      impact: ''
    }];
    onChange('extracurriculars', newActivities);
  };

  const removeActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    onChange('extracurriculars', newActivities);
  };

  const updateActivity = (index, field, value) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    onChange('extracurriculars', newActivities);
  };

  // Leadership Positions
  const addLeadership = () => {
    const newLeadership = [...leadership, { 
      position: '', 
      organization: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      responsibilities: []
    }];
    onChange('leadership_positions', newLeadership);
  };

  const removeLeadership = (index) => {
    const newLeadership = leadership.filter((_, i) => i !== index);
    onChange('leadership_positions', newLeadership);
  };

  const updateLeadership = (index, field, value) => {
    const newLeadership = [...leadership];
    newLeadership[index] = { ...newLeadership[index], [field]: value };
    onChange('leadership_positions', newLeadership);
  };

  // Volunteer Work
  const addVolunteer = () => {
    const newVolunteer = [...volunteer, { 
      organization: '', 
      role: '',
      start_date: '',
      end_date: '',
      current: false,
      hours_per_week: '',
      description: '',
      impact: ''
    }];
    onChange('volunteer_work', newVolunteer);
  };

  const removeVolunteer = (index) => {
    const newVolunteer = volunteer.filter((_, i) => i !== index);
    onChange('volunteer_work', newVolunteer);
  };

  const updateVolunteer = (index, field, value) => {
    const newVolunteer = [...volunteer];
    newVolunteer[index] = { ...newVolunteer[index], [field]: value };
    onChange('volunteer_work', newVolunteer);
  };

  // Work Experience
  const addWork = () => {
    const newWork = [...work, { 
      position: '', 
      company: '',
      start_date: '',
      end_date: '',
      current: false,
      hours_per_week: '',
      description: '',
      responsibilities: []
    }];
    onChange('work_experience', newWork);
  };

  const removeWork = (index) => {
    const newWork = work.filter((_, i) => i !== index);
    onChange('work_experience', newWork);
  };

  const updateWork = (index, field, value) => {
    const newWork = [...work];
    newWork[index] = { ...newWork[index], [field]: value };
    onChange('work_experience', newWork);
  };

  // Awards & Honors
  const addAward = () => {
    const newAwards = [...awards, { 
      title: '', 
      organization: '',
      date_received: '',
      description: '',
      level: ''
    }];
    onChange('awards_honors', newAwards);
  };

  const removeAward = (index) => {
    const newAwards = awards.filter((_, i) => i !== index);
    onChange('awards_honors', newAwards);
  };

  const updateAward = (index, field, value) => {
    const newAwards = [...awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    onChange('awards_honors', newAwards);
  };

  return (
    <Card className="max-w-6xl mx-auto shadow-xl border-gray-700 bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-100 mb-2">
          Activities & Achievements
        </CardTitle>
        <p className="text-gray-400 text-lg">
          Showcase your involvement beyond academics
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-700 mb-8">
            <TabsTrigger value="extracurriculars" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="leadership" className="data-[state=active]:bg-blue-600">
              <Star className="w-4 h-4 mr-2" />
              Leadership
            </TabsTrigger>
            <TabsTrigger value="volunteer" className="data-[state=active]:bg-blue-600">
              <Heart className="w-4 h-4 mr-2" />
              Volunteer
            </TabsTrigger>
            <TabsTrigger value="work" className="data-[state=active]:bg-blue-600">
              <Briefcase className="w-4 h-4 mr-2" />
              Work
            </TabsTrigger>
            <TabsTrigger value="awards" className="data-[state=active]:bg-blue-600">
              <Trophy className="w-4 h-4 mr-2" />
              Awards
            </TabsTrigger>
          </TabsList>

          {/* Extracurricular Activities Tab */}
          <TabsContent value="extracurriculars" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-200">Extracurricular Activities</h3>
              <Button onClick={addActivity} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/50 rounded-xl">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No activities added yet</p>
                <Button onClick={addActivity} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <Card key={index} className="border-gray-600 bg-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Activity/Organization</Label>
                            <Input
                              value={activity.activity}
                              onChange={(e) => updateActivity(index, 'activity', e.target.value)}
                              placeholder="e.g., Student Government, Basketball Team"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Your Role</Label>
                            <Input
                              value={activity.role}
                              onChange={(e) => updateActivity(index, 'role', e.target.value)}
                              placeholder="e.g., President, Captain, Member"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Start Date</Label>
                            <Input
                              type="date"
                              value={activity.start_date}
                              onChange={(e) => updateActivity(index, 'start_date', e.target.value)}
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">End Date</Label>
                            <Input
                              type="date"
                              value={activity.end_date}
                              onChange={(e) => updateActivity(index, 'end_date', e.target.value)}
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                              disabled={activity.current}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Hours/Week</Label>
                            <Input
                              type="number"
                              value={activity.hours_per_week}
                              onChange={(e) => updateActivity(index, 'hours_per_week', e.target.value)}
                              placeholder="5"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-300">Description</Label>
                          <Textarea
                            value={activity.description}
                            onChange={(e) => updateActivity(index, 'description', e.target.value)}
                            placeholder="Describe your involvement and achievements..."
                            className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeActivity(index)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leadership Positions Tab */}
          <TabsContent value="leadership" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-200">Leadership Positions</h3>
              <Button onClick={addLeadership} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Position
              </Button>
            </div>
            
            {leadership.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/50 rounded-xl">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No leadership positions added yet</p>
                <Button onClick={addLeadership} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Position
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leadership.map((position, index) => (
                  <Card key={index} className="border-gray-600 bg-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Position</Label>
                            <Input
                              value={position.position}
                              onChange={(e) => updateLeadership(index, 'position', e.target.value)}
                              placeholder="e.g., Student Body President"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Organization</Label>
                            <Input
                              value={position.organization}
                              onChange={(e) => updateLeadership(index, 'organization', e.target.value)}
                              placeholder="e.g., Student Government"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-300">Description</Label>
                          <Textarea
                            value={position.description}
                            onChange={(e) => updateLeadership(index, 'description', e.target.value)}
                            placeholder="Describe your leadership role and responsibilities..."
                            className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeLeadership(index)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Volunteer Work Tab */}
          <TabsContent value="volunteer" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-200">Volunteer Work</h3>
              <Button onClick={addVolunteer} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Volunteer Work
              </Button>
            </div>
            
            {volunteer.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/50 rounded-xl">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No volunteer work added yet</p>
                <Button onClick={addVolunteer} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Volunteer Experience
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {volunteer.map((vol, index) => (
                  <Card key={index} className="border-gray-600 bg-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Organization</Label>
                            <Input
                              value={vol.organization}
                              onChange={(e) => updateVolunteer(index, 'organization', e.target.value)}
                              placeholder="e.g., Local Food Bank"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Role</Label>
                            <Input
                              value={vol.role}
                              onChange={(e) => updateVolunteer(index, 'role', e.target.value)}
                              placeholder="e.g., Volunteer Coordinator"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-300">Description</Label>
                          <Textarea
                            value={vol.description}
                            onChange={(e) => updateVolunteer(index, 'description', e.target.value)}
                            placeholder="Describe your volunteer work and impact..."
                            className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeVolunteer(index)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Work Experience Tab */}
          <TabsContent value="work" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-200">Work Experience</h3>
              <Button onClick={addWork} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Work Experience
              </Button>
            </div>
            
            {work.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/50 rounded-xl">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No work experience added yet</p>
                <Button onClick={addWork} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {work.map((job, index) => (
                  <Card key={index} className="border-gray-600 bg-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Position</Label>
                            <Input
                              value={job.position}
                              onChange={(e) => updateWork(index, 'position', e.target.value)}
                              placeholder="e.g., Sales Associate"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Company</Label>
                            <Input
                              value={job.company}
                              onChange={(e) => updateWork(index, 'company', e.target.value)}
                              placeholder="e.g., Target"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-300">Description</Label>
                          <Textarea
                            value={job.description}
                            onChange={(e) => updateWork(index, 'description', e.target.value)}
                            placeholder="Describe your work experience and responsibilities..."
                            className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeWork(index)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Awards & Honors Tab */}
          <TabsContent value="awards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-200">Awards & Honors</h3>
              <Button onClick={addAward} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Award
              </Button>
            </div>
            
            {awards.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/50 rounded-xl">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No awards added yet</p>
                <Button onClick={addAward} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Award
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {awards.map((award, index) => (
                  <Card key={index} className="border-gray-600 bg-gray-700/50">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Award Title</Label>
                            <Input
                              value={award.title}
                              onChange={(e) => updateAward(index, 'title', e.target.value)}
                              placeholder="e.g., National Merit Scholar"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Organization</Label>
                            <Input
                              value={award.organization}
                              onChange={(e) => updateAward(index, 'organization', e.target.value)}
                              placeholder="e.g., National Merit Corporation"
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Date Received</Label>
                            <Input
                              type="date"
                              value={award.date_received}
                              onChange={(e) => updateAward(index, 'date_received', e.target.value)}
                              className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-300">Level</Label>
                            <Select value={award.level || ''} onValueChange={(value) => updateAward(index, 'level', value)}>
                              <SelectTrigger className="bg-gray-600 border-gray-500 text-white focus:border-blue-500">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="local">Local</SelectItem>
                                <SelectItem value="state">State</SelectItem>
                                <SelectItem value="national">National</SelectItem>
                                <SelectItem value="international">International</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-300">Description</Label>
                          <Textarea
                            value={award.description}
                            onChange={(e) => updateAward(index, 'description', e.target.value)}
                            placeholder="Describe the award and its significance..."
                            className="bg-gray-600 border-gray-500 text-white focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAward(index)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
