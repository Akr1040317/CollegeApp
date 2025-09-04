import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, TrendingUp, Plus, X, GraduationCap } from 'lucide-react';

export default function AcademicStep({ data, onChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addAPScore = () => {
    const newScore = { subject: '', score: '', year: new Date().getFullYear() };
    const currentScores = data.ap_scores || [];
    onChange('ap_scores', [...currentScores, newScore]);
  };

  const updateAPScore = (index, field, value) => {
    const currentScores = data.ap_scores || [];
    const updatedScores = [...currentScores];
    updatedScores[index] = { ...updatedScores[index], [field]: value };
    onChange('ap_scores', updatedScores);
  };

  const removeAPScore = (index) => {
    const currentScores = data.ap_scores || [];
    const updatedScores = currentScores.filter((_, i) => i !== index);
    onChange('ap_scores', updatedScores);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-xl border-gray-700 bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-100 mb-2">
          Academic Profile
        </CardTitle>
        <p className="text-gray-400 text-lg">
          Tell us about your academic achievements
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        {/* Basic Academic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="gpa" className="text-base font-semibold text-gray-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cumulative GPA
            </Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="5.0"
              value={data.gpa || ''}
              onChange={(e) => onChange('gpa', parseFloat(e.target.value))}
              placeholder="3.75"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-400">On a 4.0 scale</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpaScale" className="text-base font-semibold text-gray-300">
              GPA Scale
            </Label>
            <Select value={data.gpa_scale || '4.0'} onValueChange={(value) => onChange('gpa_scale', value)}>
              <SelectTrigger className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="4.0">4.0 Scale</SelectItem>
                <SelectItem value="5.0">5.0 Scale</SelectItem>
                <SelectItem value="100">100 Point Scale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="classRank" className="text-base font-semibold text-gray-300">
              Class Rank
            </Label>
            <Input
              id="classRank"
              type="number"
              min="1"
              value={data.class_rank || ''}
              onChange={(e) => onChange('class_rank', parseInt(e.target.value))}
              placeholder="15"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classSize" className="text-base font-semibold text-gray-300">
              Class Size
            </Label>
            <Input
              id="classSize"
              type="number"
              min="1"
              value={data.class_size || ''}
              onChange={(e) => onChange('class_size', parseInt(e.target.value))}
              placeholder="300"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduationYear" className="text-base font-semibold text-gray-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Graduation Year
            </Label>
            <Input
              id="graduationYear"
              type="number"
              min="2020"
              max="2030"
              value={data.graduation_year || ''}
              onChange={(e) => onChange('graduation_year', parseInt(e.target.value))}
              placeholder="2024"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Test Scores */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Standardized Test Scores
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-300">SAT Scores</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="satTotal" className="text-sm font-medium text-gray-400">
                    Total Score
                  </Label>
                  <Input
                    id="satTotal"
                    type="number"
                    min="400"
                    max="1600"
                    value={data.sat_score || ''}
                    onChange={(e) => onChange('sat_score', parseInt(e.target.value))}
                    placeholder="1450"
                    className="h-10 text-sm bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="satMath" className="text-xs text-gray-400">Math</Label>
                    <Input
                      id="satMath"
                      type="number"
                      min="200"
                      max="800"
                      value={data.sat_math || ''}
                      onChange={(e) => onChange('sat_math', parseInt(e.target.value))}
                      placeholder="750"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="satReading" className="text-xs text-gray-400">Reading</Label>
                    <Input
                      id="satReading"
                      type="number"
                      min="200"
                      max="800"
                      value={data.sat_reading || ''}
                      onChange={(e) => onChange('sat_reading', parseInt(e.target.value))}
                      placeholder="700"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="satWriting" className="text-xs text-gray-400">Writing</Label>
                    <Input
                      id="satWriting"
                      type="number"
                      min="200"
                      max="800"
                      value={data.sat_writing || ''}
                      onChange={(e) => onChange('sat_writing', parseInt(e.target.value))}
                      placeholder="700"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-300">ACT Scores</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="actComposite" className="text-sm font-medium text-gray-400">
                    Composite Score
                  </Label>
                  <Input
                    id="actComposite"
                    type="number"
                    min="1"
                    max="36"
                    value={data.act_score || ''}
                    onChange={(e) => onChange('act_score', parseInt(e.target.value))}
                    placeholder="32"
                    className="h-10 text-sm bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="actEnglish" className="text-xs text-gray-400">English</Label>
                    <Input
                      id="actEnglish"
                      type="number"
                      min="1"
                      max="36"
                      value={data.act_english || ''}
                      onChange={(e) => onChange('act_english', parseInt(e.target.value))}
                      placeholder="32"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="actMath" className="text-xs text-gray-400">Math</Label>
                    <Input
                      id="actMath"
                      type="number"
                      min="1"
                      max="36"
                      value={data.act_math || ''}
                      onChange={(e) => onChange('act_math', parseInt(e.target.value))}
                      placeholder="30"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="actReading" className="text-xs text-gray-400">Reading</Label>
                    <Input
                      id="actReading"
                      type="number"
                      min="1"
                      max="36"
                      value={data.act_reading || ''}
                      onChange={(e) => onChange('act_reading', parseInt(e.target.value))}
                      placeholder="34"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="actScience" className="text-xs text-gray-400">Science</Label>
                    <Input
                      id="actScience"
                      type="number"
                      min="1"
                      max="36"
                      value={data.act_science || ''}
                      onChange={(e) => onChange('act_science', parseInt(e.target.value))}
                      placeholder="31"
                      className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Interests */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-200">Academic Interests</h3>
          
          <div className="space-y-2">
            <Label htmlFor="intendedMajor" className="text-base font-semibold text-gray-300">
              Primary Intended Major
            </Label>
            <Input
              id="intendedMajor"
              value={data.intended_major || ''}
              onChange={(e) => onChange('intended_major', e.target.value)}
              placeholder="Computer Science"
              className="h-12 text-base bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicInterests" className="text-base font-semibold text-gray-300">
              Other Academic Interests
            </Label>
            <Textarea
              id="academicInterests"
              value={data.academic_interests?.join(', ') || ''}
              onChange={(e) => onChange('academic_interests', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="Mathematics, Physics, Artificial Intelligence, Data Science"
              className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
            <p className="text-sm text-gray-400">Separate multiple interests with commas</p>
          </div>
        </div>

        {/* Advanced Academic Info */}
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Academic Information
          </Button>

          {showAdvanced && (
            <div className="space-y-6 p-4 bg-gray-700/50 rounded-lg">
              {/* AP Scores */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-300">AP Scores</h4>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addAPScore}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add AP Score
                  </Button>
                </div>
                
                {(data.ap_scores || []).map((score, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-600/50 rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-400">Subject</Label>
                      <Input
                        value={score.subject || ''}
                        onChange={(e) => updateAPScore(index, 'subject', e.target.value)}
                        placeholder="AP Calculus BC"
                        className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-400">Score</Label>
                      <Select value={score.score || ''} onValueChange={(value) => updateAPScore(index, 'score', value)}>
                        <SelectTrigger className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Score" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-400">Year</Label>
                      <Input
                        type="number"
                        value={score.year || ''}
                        onChange={(e) => updateAPScore(index, 'year', parseInt(e.target.value))}
                        placeholder="2023"
                        className="h-8 text-xs bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeAPScore(index)}
                        className="h-8 px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}