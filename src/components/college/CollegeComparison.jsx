import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  X,
  Plus,
  Target,
  Shield,
  Zap
} from 'lucide-react';

export default function CollegeComparison({ colleges = [], onAddCollege, onRemoveCollege }) {
  const [selectedColleges, setSelectedColleges] = useState(colleges.slice(0, 3)); // Max 3 for comparison
  const [comparisonCriteria, setComparisonCriteria] = useState('overview');

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

  const handleAddCollege = (college) => {
    if (selectedColleges.length < 3 && !selectedColleges.find(c => c.id === college.id)) {
      setSelectedColleges([...selectedColleges, college]);
    }
  };

  const handleRemoveCollege = (collegeId) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId));
  };

  const renderOverviewComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {selectedColleges.map((college) => (
        <Card key={college.id} className="border-gray-700 bg-gray-800/80">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{college.name}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {college.city}, {college.state}
                </p>
              </div>
              <Button
                onClick={() => handleRemoveCollege(college.id)}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-300 hover:bg-red-500/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {college.user_category && (
              <Badge className={getCategoryColor(college.user_category)}>
                {getCategoryIcon(college.user_category)}
                <span className="ml-1">{college.user_category.toUpperCase()}</span>
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white">{college.type?.charAt(0).toUpperCase() + college.type?.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Enrollment:</span>
                <span className="text-white">{college.enrollment?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Acceptance Rate:</span>
                <span className="text-white">{college.acceptance_rate || 'N/A'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Annual Cost:</span>
                <span className="text-white">{formatCost(college.tuition_out_state || college.tuition_in_state)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ranking:</span>
                <span className="text-white">#{college.us_news_ranking || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAdmissionsComparison = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-4 text-gray-300">College</th>
            <th className="text-left p-4 text-gray-300">Acceptance Rate</th>
            <th className="text-left p-4 text-gray-300">SAT Range</th>
            <th className="text-left p-4 text-gray-300">ACT Range</th>
            <th className="text-left p-4 text-gray-300">GPA Req.</th>
            <th className="text-left p-4 text-gray-300">ED Deadline</th>
            <th className="text-left p-4 text-gray-300">EA Deadline</th>
            <th className="text-left p-4 text-gray-300">RD Deadline</th>
          </tr>
        </thead>
        <tbody>
          {selectedColleges.map((college) => (
            <tr key={college.id} className="border-b border-gray-800">
              <td className="p-4">
                <div>
                  <div className="font-semibold text-white">{college.name}</div>
                  <div className="text-sm text-gray-400">{college.city}, {college.state}</div>
                </div>
              </td>
              <td className="p-4 text-white">{college.acceptance_rate || 'N/A'}%</td>
              <td className="p-4 text-white">
                {college.sat_25th_percentile && college.sat_75th_percentile 
                  ? `${college.sat_25th_percentile}-${college.sat_75th_percentile}`
                  : 'N/A'
                }
              </td>
              <td className="p-4 text-white">
                {college.act_25th_percentile && college.act_75th_percentile 
                  ? `${college.act_25th_percentile}-${college.act_75th_percentile}`
                  : 'N/A'
                }
              </td>
              <td className="p-4 text-white">{college.gpa_requirement || 'N/A'}</td>
              <td className="p-4 text-white">{formatDate(college.early_decision_deadline)}</td>
              <td className="p-4 text-white">{formatDate(college.early_action_deadline)}</td>
              <td className="p-4 text-white">{formatDate(college.regular_decision_deadline)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCostComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {selectedColleges.map((college) => (
        <Card key={college.id} className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">{college.name}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tuition (In-State):</span>
                <span className="text-white">{formatCost(college.tuition_in_state)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tuition (Out-of-State):</span>
                <span className="text-white">{formatCost(college.tuition_out_state)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Room & Board:</span>
                <span className="text-white">{formatCost(college.room_board)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total (In-State):</span>
                <span className="text-white font-semibold">{formatCost(college.total_cost_in_state)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total (Out-of-State):</span>
                <span className="text-white font-semibold">{formatCost(college.total_cost_out_state)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Financial Aid:</span>
                <span className="text-white">{formatCost(college.average_financial_aid)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAcademicsComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {selectedColleges.map((college) => (
        <Card key={college.id} className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">{college.name}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Student-Faculty Ratio:</span>
                <span className="text-white">{college.student_faculty_ratio || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Research Opportunities:</span>
                <span className="text-white">{college.research_opportunities ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">US News Ranking:</span>
                <span className="text-white">#{college.us_news_ranking || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Forbes Ranking:</span>
                <span className="text-white">#{college.forbes_ranking || 'N/A'}</span>
              </div>
            </div>
            
            {college.popular_majors && college.popular_majors.length > 0 && (
              <div className="space-y-2">
                <span className="text-gray-400">Popular Majors:</span>
                <div className="flex flex-wrap gap-1">
                  {college.popular_majors.slice(0, 3).map((major, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-500 text-gray-300">
                      {major}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-200">College Comparison</CardTitle>
          <p className="text-gray-400">Compare up to 3 colleges side by side</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectedColleges.map((college) => (
              <Badge key={college.id} variant="outline" className="border-gray-500 text-gray-300">
                {college.name}
                <Button
                  onClick={() => handleRemoveCollege(college.id)}
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 hover:bg-gray-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
            {selectedColleges.length < 3 && (
              <Select onValueChange={handleAddCollege}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Add college to compare" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {colleges
                    .filter(college => !selectedColleges.find(c => c.id === college.id))
                    .map((college) => (
                      <SelectItem key={college.id} value={college}>
                        {college.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Criteria */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Button
              onClick={() => setComparisonCriteria('overview')}
              variant={comparisonCriteria === 'overview' ? 'default' : 'outline'}
              className={comparisonCriteria === 'overview' ? 'bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
            >
              Overview
            </Button>
            <Button
              onClick={() => setComparisonCriteria('admissions')}
              variant={comparisonCriteria === 'admissions' ? 'default' : 'outline'}
              className={comparisonCriteria === 'admissions' ? 'bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
            >
              Admissions
            </Button>
            <Button
              onClick={() => setComparisonCriteria('cost')}
              variant={comparisonCriteria === 'cost' ? 'default' : 'outline'}
              className={comparisonCriteria === 'cost' ? 'bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
            >
              Cost
            </Button>
            <Button
              onClick={() => setComparisonCriteria('academics')}
              variant={comparisonCriteria === 'academics' ? 'default' : 'outline'}
              className={comparisonCriteria === 'academics' ? 'bg-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
            >
              Academics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Content */}
      {selectedColleges.length === 0 ? (
        <Card className="border-gray-700 bg-gray-800/80">
          <CardContent className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No colleges selected for comparison</h3>
            <p className="text-gray-400">Add colleges from your list to start comparing</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-700 bg-gray-800/80">
          <CardContent className="p-6">
            {comparisonCriteria === 'overview' && renderOverviewComparison()}
            {comparisonCriteria === 'admissions' && renderAdmissionsComparison()}
            {comparisonCriteria === 'cost' && renderCostComparison()}
            {comparisonCriteria === 'academics' && renderAcademicsComparison()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
