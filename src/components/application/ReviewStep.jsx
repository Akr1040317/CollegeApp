import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, BookOpen, Users, Settings } from 'lucide-react';

export default function ReviewStep({ data }) {
  const sections = [
    {
      title: "Personal Information",
      icon: User,
      items: [
        { label: "Name", value: `${data.first_name || ''} ${data.last_name || ''}`.trim() },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone }
      ]
    },
    {
      title: "Academic Profile", 
      icon: BookOpen,
      items: [
        { label: "GPA", value: data.gpa ? `${data.gpa}/4.0` : 'Not provided' },
        { label: "SAT Score", value: data.sat_score || 'Not provided' },
        { label: "ACT Score", value: data.act_score || 'Not provided' },
        { label: "Intended Major", value: data.intended_major || 'Not specified' }
      ]
    },
    {
      title: "Extracurricular Activities",
      icon: Users,
      items: data.extracurriculars?.map(activity => ({
        label: activity.activity,
        value: `${activity.role} • ${activity.years_participated} years`
      })) || []
    },
    {
      title: "College Preferences",
      icon: Settings,
      items: [
        { 
          label: "Preferred Location", 
          value: data.preferred_location?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified'
        },
        { 
          label: "School Size", 
          value: data.school_size_preference?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified'
        }
      ]
    }
  ];

  return (
    <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Review Your Application
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Please review your information before getting recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                <section.icon className="w-6 h-6 text-blue-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-1">
                      <div className="text-sm font-medium text-gray-600">{item.label}</div>
                      <div className="text-base text-gray-900 font-medium">
                        {item.value || 'Not provided'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No activities added</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ready for Recommendations</h3>
          </div>
          <p className="text-gray-700">
            Your profile looks complete! Click "Get My Recommendations" to receive personalized college matches based on your academic profile and preferences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}