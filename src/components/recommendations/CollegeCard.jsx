import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp, Star } from 'lucide-react';

export default function CollegeCard({ college }) {
  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500" />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-800 transition-colors">
              {college.college_name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{college.location}</span>
            </div>
          </div>
          
          <div className="text-center">
            <Badge className={`px-3 py-1 font-semibold border ${getMatchColor(college.match_score)}`}>
              <Star className="w-3 h-3 mr-1" />
              {college.match_score}% Match
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{getMatchLabel(college.match_score)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500">Acceptance Rate</p>
              <p className="font-semibold text-emerald-700">{college.acceptance_rate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Student Body</p>
              <p className="font-semibold text-blue-700">Medium</p>
            </div>
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
  );
}