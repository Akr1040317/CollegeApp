import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Calendar, 
  GraduationCap, 
  Award,
  Globe,
  Phone,
  Mail,
  Heart,
  Plus,
  Check,
  X,
  Edit,
  Save
} from 'lucide-react';
import { COLLEGE_CATEGORIES } from '@/types/college';

export default function CollegeDetail({ college, onAddToList, onUpdateCollege, isInList = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userNotes, setUserNotes] = useState(college.user_notes || '');
  const [userRating, setUserRating] = useState(college.user_rating || 0);
  const [userCategory, setUserCategory] = useState(college.user_category || '');
  const [userInterestLevel, setUserInterestLevel] = useState(college.user_interest_level || '');
  const [userApplicationStatus, setUserApplicationStatus] = useState(college.user_application_status || 'not_applied');
  const [userDecisionType, setUserDecisionType] = useState(college.user_decision_type || '');

  const formatCost = (cost) => {
    if (!cost) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    if (category === 'reach') return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (category === 'target') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (category === 'safety') return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const handleSave = () => {
    const updatedCollege = {
      ...college,
      user_notes: userNotes,
      user_rating: userRating,
      user_category: userCategory,
      user_interest_level: userInterestLevel,
      user_application_status: userApplicationStatus,
      user_decision_type: userDecisionType
    };
    onUpdateCollege(updatedCollege);
    setIsEditing(false);
  };

  const handleAddToList = () => {
    onAddToList(college);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
      />
    ));
  };

  if (!college) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No college selected</h3>
        <p className="text-gray-400">Select a college to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{college.name}</h1>
              <p className="text-lg text-gray-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {college.city}, {college.state}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {college.enrollment?.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {college.acceptance_rate}% acceptance rate
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatCost(college.tuition_out_state || college.tuition_in_state)}/year
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {isInList ? (
                <Button disabled className="bg-green-600 text-white">
                  <Check className="w-4 h-4 mr-2" />
                  In Your List
                </Button>
              ) : (
                <Button onClick={handleAddToList} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to List
                </Button>
              )}
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Categories and Notes */}
      {(isInList || isEditing) && (
        <Card className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <CardTitle className="text-gray-200">Your Notes & Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Category</Label>
                <Select value={userCategory} onValueChange={setUserCategory} disabled={!isEditing}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value={COLLEGE_CATEGORIES.REACH}>Reach</SelectItem>
                    <SelectItem value={COLLEGE_CATEGORIES.TARGET}>Target</SelectItem>
                    <SelectItem value={COLLEGE_CATEGORIES.SAFETY}>Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Interest Level</Label>
                <Select value={userInterestLevel} onValueChange={setUserInterestLevel} disabled={!isEditing}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue placeholder="Select interest level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="very_high">Very High</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Your Rating</Label>
              <div className="flex items-center gap-2">
                {renderStars(userRating)}
                <span className="text-sm text-gray-400 ml-2">{userRating}/5</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Notes</Label>
              <Textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Add your personal notes about this college..."
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                rows={3}
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="admissions" className="data-[state=active]:bg-blue-600">
            Admissions
          </TabsTrigger>
          <TabsTrigger value="academics" className="data-[state=active]:bg-blue-600">
            Academics
          </TabsTrigger>
          <TabsTrigger value="campus" className="data-[state=active]:bg-blue-600">
            Campus Life
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <p className="text-white font-medium">{college.type?.charAt(0).toUpperCase() + college.type?.slice(1)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Setting:</span>
                    <p className="text-white font-medium">{college.setting?.charAt(0).toUpperCase() + college.setting?.slice(1)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <p className="text-white font-medium">{college.size_category?.charAt(0).toUpperCase() + college.size_category?.slice(1)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Student-Faculty Ratio:</span>
                    <p className="text-white font-medium">{college.student_faculty_ratio || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {college.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {college.website}
                    </a>
                  </div>
                )}
                {college.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{college.phone}</span>
                  </div>
                )}
                {college.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{college.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {college.description && (
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{college.description}</p>
              </CardContent>
            </Card>
          )}

          {college.notable_alumni && college.notable_alumni.length > 0 && (
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Notable Alumni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {college.notable_alumni.map((alumnus, index) => (
                    <Badge key={index} variant="outline" className="border-gray-500 text-gray-300">
                      {alumnus}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Admissions Tab */}
        <TabsContent value="admissions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Acceptance Rate:</span>
                    <p className="text-white font-medium text-lg">{college.acceptance_rate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">SAT Range:</span>
                    <p className="text-white font-medium">
                      {college.sat_25th_percentile} - {college.sat_75th_percentile}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">ACT Range:</span>
                    <p className="text-white font-medium">
                      {college.act_25th_percentile} - {college.act_75th_percentile}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">GPA Requirement:</span>
                    <p className="text-white font-medium">{college.gpa_requirement || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Application Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {college.early_decision_deadline && (
                  <div>
                    <span className="text-gray-400">Early Decision:</span>
                    <p className="text-white font-medium">{formatDate(college.early_decision_deadline)}</p>
                  </div>
                )}
                {college.early_action_deadline && (
                  <div>
                    <span className="text-gray-400">Early Action:</span>
                    <p className="text-white font-medium">{formatDate(college.early_action_deadline)}</p>
                  </div>
                )}
                {college.regular_decision_deadline && (
                  <div>
                    <span className="text-gray-400">Regular Decision:</span>
                    <p className="text-white font-medium">{formatDate(college.regular_decision_deadline)}</p>
                  </div>
                )}
                {college.rolling_admissions && (
                  <div>
                    <span className="text-gray-400">Rolling Admissions:</span>
                    <p className="text-white font-medium">Yes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academics Tab */}
        <TabsContent value="academics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Student-Faculty Ratio:</span>
                    <p className="text-white font-medium">{college.student_faculty_ratio || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Research Opportunities:</span>
                    <p className="text-white font-medium">{college.research_opportunities ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">US News Ranking:</span>
                    <p className="text-white font-medium">#{college.us_news_ranking || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Popular Majors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {college.popular_majors?.map((major, index) => (
                    <Badge key={index} variant="outline" className="border-gray-500 text-gray-300">
                      {major}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {college.strong_programs && college.strong_programs.length > 0 && (
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Strong Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {college.strong_programs.map((program, index) => (
                    <Badge key={index} variant="outline" className="border-blue-500 text-blue-300">
                      {program}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Campus Life Tab */}
        <TabsContent value="campus" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Campus Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Setting:</span>
                    <p className="text-white font-medium">{college.setting?.charAt(0).toUpperCase() + college.setting?.slice(1)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Greek Life:</span>
                    <p className="text-white font-medium">{college.greek_life ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Athletics Division:</span>
                    <p className="text-white font-medium">{college.athletics_division || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Campus Housing:</span>
                    <p className="text-white font-medium">{college.campus_housing ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Diversity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Diversity Score:</span>
                    <span className="text-white font-medium">{college.diversity_score || 'N/A'}/100</span>
                  </div>
                  {college.diversity_score && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${college.diversity_score}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
