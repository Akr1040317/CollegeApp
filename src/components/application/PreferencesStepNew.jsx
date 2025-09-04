import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, DollarSign, Thermometer, GraduationCap, Heart, Star } from 'lucide-react';

export default function PreferencesStep({ data, onChange }) {
  const [activeTab, setActiveTab] = useState('location');

  const handleArrayChange = (field, value) => {
    if (Array.isArray(data[field])) {
      if (data[field].includes(value)) {
        onChange(field, data[field].filter(item => item !== value));
      } else {
        onChange(field, [...data[field], value]);
      }
    } else {
      onChange(field, [value]);
    }
  };

  const removeFromArray = (field, value) => {
    if (Array.isArray(data[field])) {
      onChange(field, data[field].filter(item => item !== value));
    }
  };

  return (
    <Card className="max-w-6xl mx-auto shadow-xl border-gray-700 bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-100 mb-2">
          College Preferences
        </CardTitle>
        <p className="text-gray-400 text-lg">
          Tell us what you're looking for in a college
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700 mb-8">
            <TabsTrigger value="location" className="data-[state=active]:bg-blue-600">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="academics" className="data-[state=active]:bg-blue-600">
              <GraduationCap className="w-4 h-4 mr-2" />
              Academics
            </TabsTrigger>
            <TabsTrigger value="campus" className="data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              Campus Life
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-blue-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial
            </TabsTrigger>
          </TabsList>

          {/* Location Preferences Tab */}
          <TabsContent value="location" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">Location Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Preferred Setting</Label>
                  <Select value={data.preferred_location || ''} onValueChange={(value) => onChange('preferred_location', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select setting preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="suburban">Suburban</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Distance from Home</Label>
                  <Select value={data.distance_from_home || ''} onValueChange={(value) => onChange('distance_from_home', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select distance preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="close">Close (within 100 miles)</SelectItem>
                      <SelectItem value="moderate">Moderate (100-500 miles)</SelectItem>
                      <SelectItem value="far">Far (500+ miles)</SelectItem>
                      <SelectItem value="any">Any distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Max Distance (miles)</Label>
                  <Input
                    type="number"
                    value={data.max_distance_miles || ''}
                    onChange={(e) => onChange('max_distance_miles', parseInt(e.target.value))}
                    placeholder="500"
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Preferred Regions</Label>
                  <div className="space-y-2">
                    {['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Pacific Northwest'].map(region => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={`region-${region}`}
                          checked={data.preferred_region?.includes(region) || false}
                          onCheckedChange={() => handleArrayChange('preferred_region', region)}
                        />
                        <Label htmlFor={`region-${region}`} className="text-gray-300">{region}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Climate Preference</Label>
                  <div className="space-y-2">
                    {['Warm', 'Moderate', 'Cold', 'Any'].map(climate => (
                      <div key={climate} className="flex items-center space-x-2">
                        <Checkbox
                          id={`climate-${climate}`}
                          checked={data.climate_preference?.includes(climate) || false}
                          onCheckedChange={() => handleArrayChange('climate_preference', climate)}
                        />
                        <Label htmlFor={`climate-${climate}`} className="text-gray-300">{climate}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Academic Preferences Tab */}
          <TabsContent value="academics" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">Academic Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">School Size Preference</Label>
                  <Select value={data.school_size_preference || ''} onValueChange={(value) => onChange('school_size_preference', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select size preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="small">Small (under 5,000 students)</SelectItem>
                      <SelectItem value="medium">Medium (5,000-15,000 students)</SelectItem>
                      <SelectItem value="large">Large (15,000+ students)</SelectItem>
                      <SelectItem value="any">Any size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-300">Min Enrollment</Label>
                    <Input
                      type="number"
                      value={data.min_enrollment || ''}
                      onChange={(e) => onChange('min_enrollment', parseInt(e.target.value))}
                      placeholder="1000"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-300">Max Enrollment</Label>
                    <Input
                      type="number"
                      value={data.max_enrollment || ''}
                      onChange={(e) => onChange('max_enrollment', parseInt(e.target.value))}
                      placeholder="50000"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">School Type</Label>
                  <div className="space-y-2">
                    {['Public', 'Private', 'Community College', 'Any'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={data.school_type_preference?.includes(type) || false}
                          onCheckedChange={() => handleArrayChange('school_type_preference', type)}
                        />
                        <Label htmlFor={`type-${type}`} className="text-gray-300">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Research vs Teaching Focus</Label>
                  <Select value={data.research_vs_teaching || ''} onValueChange={(value) => onChange('research_vs_teaching', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select focus preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="research_focused">Research Focused</SelectItem>
                      <SelectItem value="teaching_focused">Teaching Focused</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="no_preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Academic Interests</Label>
                  <Textarea
                    value={data.academic_interests?.join(', ') || ''}
                    onChange={(e) => onChange('academic_interests', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    placeholder="Mathematics, Physics, Computer Science, Biology..."
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={4}
                  />
                  <p className="text-sm text-gray-400">Separate multiple interests with commas</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Campus Life Tab */}
          <TabsContent value="campus" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">Campus Life Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Greek Life Interest</Label>
                  <Select value={data.greek_life_interest || ''} onValueChange={(value) => onChange('greek_life_interest', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select Greek life preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="very_important">Very Important</SelectItem>
                      <SelectItem value="somewhat_important">Somewhat Important</SelectItem>
                      <SelectItem value="not_important">Not Important</SelectItem>
                      <SelectItem value="avoid">Want to Avoid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Sports Interest</Label>
                  <Select value={data.sports_interest || ''} onValueChange={(value) => onChange('sports_interest', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select sports preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="very_important">Very Important</SelectItem>
                      <SelectItem value="somewhat_important">Somewhat Important</SelectItem>
                      <SelectItem value="not_important">Not Important</SelectItem>
                      <SelectItem value="avoid">Want to Avoid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Diversity Importance</Label>
                  <Select value={data.diversity_importance || ''} onValueChange={(value) => onChange('diversity_importance', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select diversity preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="very_important">Very Important</SelectItem>
                      <SelectItem value="somewhat_important">Somewhat Important</SelectItem>
                      <SelectItem value="not_important">Not Important</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Campus Culture</Label>
                  <div className="space-y-2">
                    {['Academic', 'Social', 'Athletic', 'Arts-focused', 'Tech-focused', 'Liberal', 'Conservative', 'Diverse', 'Traditional'].map(culture => (
                      <div key={culture} className="flex items-center space-x-2">
                        <Checkbox
                          id={`culture-${culture}`}
                          checked={data.campus_culture?.includes(culture) || false}
                          onCheckedChange={() => handleArrayChange('campus_culture', culture)}
                        />
                        <Label htmlFor={`culture-${culture}`} className="text-gray-300">{culture}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Financial Preferences Tab */}
          <TabsContent value="financial" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200">Financial Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Financial Aid Important</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="financial_aid_important"
                      checked={data.financial_aid_important || false}
                      onCheckedChange={(checked) => onChange('financial_aid_important', checked)}
                    />
                    <Label htmlFor="financial_aid_important" className="text-gray-300">
                      Financial aid is important to me
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Max Annual Tuition ($)</Label>
                  <Input
                    type="number"
                    value={data.max_tuition || ''}
                    onChange={(e) => onChange('max_tuition', parseInt(e.target.value))}
                    placeholder="50000"
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Scholarship Priority</Label>
                  <Select value={data.scholarship_priority || ''} onValueChange={(value) => onChange('scholarship_priority', value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                      <SelectValue placeholder="Select scholarship priority" />
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Career Goals</Label>
                  <Textarea
                    value={data.career_goals || ''}
                    onChange={(e) => onChange('career_goals', e.target.value)}
                    placeholder="What are your career aspirations?"
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">What do you want from college?</Label>
                  <Textarea
                    value={data.what_you_want_from_college || ''}
                    onChange={(e) => onChange('what_you_want_from_college', e.target.value)}
                    placeholder="Describe what you're looking for in your college experience..."
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-300">Post-Graduation Plans</Label>
                  <Textarea
                    value={data.post_graduation_plans || ''}
                    onChange={(e) => onChange('post_graduation_plans', e.target.value)}
                    placeholder="What do you plan to do after college?"
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
