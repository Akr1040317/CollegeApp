import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Calendar, 
  X, 
  Edit, 
  Save,
  Trash2,
  Filter,
  Search,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { COLLEGE_CATEGORIES } from '@/types/college';

export default function CollegeList({ 
  colleges = [], 
  onUpdateCollege, 
  onRemoveCollege, 
  onReorderColleges 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [editingCollege, setEditingCollege] = useState(null);

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
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'reach': return <Zap className="w-4 h-4" />;
      case 'target': return <Target className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'reach': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'target': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'safety': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryStats = () => {
    const reach = colleges.filter(c => c.user_category === 'reach').length;
    const target = colleges.filter(c => c.user_category === 'target').length;
    const safety = colleges.filter(c => c.user_category === 'safety').length;
    const uncategorized = colleges.filter(c => !c.user_category).length;
    
    return { reach, target, safety, uncategorized };
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || college.user_category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedColleges = [...filteredColleges].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        const categoryOrder = { reach: 0, target: 1, safety: 2, '': 3 };
        return categoryOrder[a.user_category || ''] - categoryOrder[b.user_category || ''];
      case 'deadline':
        const deadlineA = new Date(a.user_application_deadline || a.regular_decision_deadline || '9999-12-31');
        const deadlineB = new Date(b.user_application_deadline || b.regular_decision_deadline || '9999-12-31');
        return deadlineA - deadlineB;
      case 'cost':
        const costA = a.tuition_out_state || a.tuition_in_state || 0;
        const costB = b.tuition_out_state || b.tuition_in_state || 0;
        return costA - costB;
      case 'acceptance_rate':
        return (a.acceptance_rate || 100) - (b.acceptance_rate || 100);
      default:
        return 0;
    }
  });

  const stats = getCategoryStats();

  const handleUpdateCollege = (updatedCollege) => {
    onUpdateCollege(updatedCollege);
    setEditingCollege(null);
  };

  const handleRemoveCollege = (collegeId) => {
    onRemoveCollege(collegeId);
  };

  const handleCategoryChange = (collegeId, newCategory) => {
    const college = colleges.find(c => c.id === collegeId);
    if (college) {
      handleUpdateCollege({ ...college, user_category: newCategory });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-200">Your College List</CardTitle>
          <p className="text-gray-400">Manage and organize your college applications</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <Zap className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-300">{stats.reach}</div>
              <div className="text-sm text-red-400">Reach Schools</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-300">{stats.target}</div>
              <div className="text-sm text-yellow-400">Target Schools</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-300">{stats.safety}</div>
              <div className="text-sm text-green-400">Safety Schools</div>
            </div>
            <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <Star className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-300">{stats.uncategorized}</div>
              <div className="text-sm text-gray-400">Uncategorized</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="reach">Reach Schools</SelectItem>
                <SelectItem value="target">Target Schools</SelectItem>
                <SelectItem value="safety">Safety Schools</SelectItem>
                <SelectItem value="">Uncategorized</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="acceptance_rate">Acceptance Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* College List */}
      <div className="space-y-4">
        {sortedColleges.length === 0 ? (
          <Card className="border-gray-700 bg-gray-800/80">
            <CardContent className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No colleges in your list</h3>
              <p className="text-gray-400">Start by searching for colleges and adding them to your list</p>
            </CardContent>
          </Card>
        ) : (
          sortedColleges.map((college) => (
            <Card key={college.id} className="border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{college.name}</h3>
                        <p className="text-gray-400 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {college.city}, {college.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {college.user_category && (
                          <Badge className={getCategoryColor(college.user_category)}>
                            {getCategoryIcon(college.user_category)}
                            <span className="ml-1">{college.user_category.toUpperCase()}</span>
                          </Badge>
                        )}
                        <Button
                          onClick={() => setEditingCollege(editingCollege === college.id ? null : college.id)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleRemoveCollege(college.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{college.enrollment?.toLocaleString() || 'N/A'} students</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{college.acceptance_rate || 'N/A'}% acceptance</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCost(college.tuition_out_state || college.tuition_in_state)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(college.user_application_deadline || college.regular_decision_deadline)}</span>
                      </div>
                    </div>

                    {college.user_notes && (
                      <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-300">{college.user_notes}</p>
                      </div>
                    )}

                    {editingCollege === college.id && (
                      <div className="mt-4 p-4 bg-gray-700/50 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Category</Label>
                            <Select 
                              value={college.user_category || ''} 
                              onValueChange={(value) => handleCategoryChange(college.id, value)}
                            >
                              <SelectTrigger className="bg-gray-600 border-gray-500 text-white focus:border-blue-500">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="">Uncategorized</SelectItem>
                                <SelectItem value={COLLEGE_CATEGORIES.REACH}>Reach</SelectItem>
                                <SelectItem value={COLLEGE_CATEGORIES.TARGET}>Target</SelectItem>
                                <SelectItem value={COLLEGE_CATEGORIES.SAFETY}>Safety</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Application Status</Label>
                            <Select 
                              value={college.user_application_status || 'not_applied'} 
                              onValueChange={(value) => handleUpdateCollege({ ...college, user_application_status: value })}
                            >
                              <SelectTrigger className="bg-gray-600 border-gray-500 text-white focus:border-blue-500">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="not_applied">Not Applied</SelectItem>
                                <SelectItem value="applied">Applied</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="waitlisted">Waitlisted</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => setEditingCollege(null)}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => setEditingCollege(null)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
