import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users as UsersIcon, Settings, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PreferencesStep({ data, onChange }) {
  const [percentageError, setPercentageError] = useState('');

  const safetyPercentage = data.safety_school_percentage || 30;
  const targetPercentage = data.target_school_percentage || 50;
  const reachPercentage = data.reach_school_percentage || 20;
  const totalPercentage = safetyPercentage + targetPercentage + reachPercentage;

  useEffect(() => {
    if (totalPercentage !== 100) {
      setPercentageError(`Percentages must add up to 100% (currently ${totalPercentage}%)`);
    } else {
      setPercentageError('');
    }
  }, [totalPercentage]);

  const handlePercentageChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    onChange(field, numValue);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          College Preferences
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Customize your ideal college search parameters
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Preferred Location
          </Label>
          <Select
            value={data.preferred_location || ''}
            onValueChange={(value) => onChange('preferred_location', value)}
          >
            <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Select your preferred region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="midwest">Midwest</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
              <SelectItem value="no_preference">No Preference</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">Which region would you prefer to study in?</p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            School Size Preference
          </Label>
          <Select
            value={data.school_size_preference || ''}
            onValueChange={(value) => onChange('school_size_preference', value)}
          >
            <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Select your preferred school size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (Under 5,000 students)</SelectItem>
              <SelectItem value="medium">Medium (5,000-15,000 students)</SelectItem>
              <SelectItem value="large">Large (Over 15,000 students)</SelectItem>
              <SelectItem value="no_preference">No Preference</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">What size campus environment do you prefer?</p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Number of Recommendations
          </Label>
          <Select
            value={data.recommendation_count?.toString() || '10'}
            onValueChange={(value) => onChange('recommendation_count', parseInt(value))}
          >
            <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="How many colleges to recommend" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 colleges</SelectItem>
              <SelectItem value="8">8 colleges</SelectItem>
              <SelectItem value="10">10 colleges</SelectItem>
              <SelectItem value="12">12 colleges</SelectItem>
              <SelectItem value="15">15 colleges</SelectItem>
              <SelectItem value="20">20 colleges</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">How many college recommendations would you like?</p>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Target className="w-4 h-4" />
            School Mix Preferences
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Customize the mix of safety, target, and reach schools in your recommendations. Percentages must add up to 100%.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-green-700">
                Safety Schools
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={safetyPercentage}
                onChange={(e) => handlePercentageChange('safety_school_percentage', e.target.value)}
                className="h-11 border-green-200 focus:border-green-500"
              />
              <p className="text-xs text-gray-500">Schools you're likely to get into</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-700">
                Target Schools
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={targetPercentage}
                onChange={(e) => handlePercentageChange('target_school_percentage', e.target.value)}
                className="h-11 border-blue-200 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">Schools that match your profile</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-purple-700">
                Reach Schools
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={reachPercentage}
                onChange={(e) => handlePercentageChange('reach_school_percentage', e.target.value)}
                className="h-11 border-purple-200 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500">More competitive schools</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total:</span>
            <span className={`font-semibold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPercentage}%
            </span>
          </div>

          {percentageError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {percentageError}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
          <p className="text-blue-800">
            After completing your profile, we'll use AI to analyze your information and provide personalized college recommendations that match your academic profile and preferences perfectly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}