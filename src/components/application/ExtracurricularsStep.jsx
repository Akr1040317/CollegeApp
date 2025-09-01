import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2 } from 'lucide-react';

export default function ExtracurricularsStep({ data, onChange }) {
  const activities = data.extracurriculars || [];

  const addActivity = () => {
    const newActivities = [...activities, { activity: '', role: '', years_participated: 1 }];
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

  return (
    <Card className="max-w-3xl mx-auto shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Extracurricular Activities
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Showcase your involvement beyond academics
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        {activities.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No activities added yet</p>
            <Button
              onClick={addActivity}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Activity
            </Button>
          </div>
        )}

        {activities.map((activity, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Activity/Organization
                  </Label>
                  <Input
                    value={activity.activity}
                    onChange={(e) => updateActivity(index, 'activity', e.target.value)}
                    placeholder="e.g., Student Government, Basketball Team, Debate Club"
                    className="h-11 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Your Role
                  </Label>
                  <Input
                    value={activity.role}
                    onChange={(e) => updateActivity(index, 'role', e.target.value)}
                    placeholder="e.g., President, Captain, Member"
                    className="h-11 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Years Participated
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={activity.years_participated}
                    onChange={(e) => updateActivity(index, 'years_participated', parseInt(e.target.value))}
                    className="h-11 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2"></div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeActivity(index)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {activities.length > 0 && (
          <div className="text-center">
            <Button
              onClick={addActivity}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-3 text-base font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}