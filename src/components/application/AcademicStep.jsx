import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Award, TrendingUp } from 'lucide-react';

export default function AcademicStep({ data, onChange }) {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Academic Profile
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Tell us about your academic achievements
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="space-y-2">
          <Label htmlFor="gpa" className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Cumulative GPA
          </Label>
          <Input
            id="gpa"
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            value={data.gpa || ''}
            onChange={(e) => onChange('gpa', parseFloat(e.target.value))}
            placeholder="3.75"
            className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">On a 4.0 scale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sat" className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Award className="w-4 h-4" />
              SAT Score
            </Label>
            <Input
              id="sat"
              type="number"
              min="400"
              max="1600"
              value={data.sat_score || ''}
              onChange={(e) => onChange('sat_score', parseInt(e.target.value))}
              placeholder="1450"
              className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500">Total score (400-1600)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="act" className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <Award className="w-4 h-4" />
              ACT Score
            </Label>
            <Input
              id="act"
              type="number"
              min="1"
              max="36"
              value={data.act_score || ''}
              onChange={(e) => onChange('act_score', parseInt(e.target.value))}
              placeholder="32"
              className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500">Composite score (1-36)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="major" className="text-base font-semibold text-gray-700">
            Intended Major
          </Label>
          <Input
            id="major"
            value={data.intended_major || ''}
            onChange={(e) => onChange('intended_major', e.target.value)}
            placeholder="Computer Science"
            className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">What field do you want to study?</p>
        </div>
      </CardContent>
    </Card>
  );
}