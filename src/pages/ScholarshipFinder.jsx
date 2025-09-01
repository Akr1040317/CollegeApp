
import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { Scholarship } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Award, Search, ExternalLink, Star, Calendar, DollarSign, BookOpen, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className={`bg-gray-800 border-gray-700 shadow-lg`}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm text-${color}-400`}>{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-300`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ScholarshipFinder() {
  const [student, setStudent] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({ found: 0, saved: 0, applying: 0, awarded: 0 });
  const [searchCriteria, setSearchCriteria] = useState({
    interests: '',
    career_goals: '',
    circumstances: '',
    financial_need: 'none'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const students = await Student.list('-updated_date', 1);
      if (students.length > 0) {
        const studentData = students[0];
        setStudent(studentData);
        
        const scholarshipList = await Scholarship.filter(
          { student_id: studentData.id },
          '-match_score'
        );
        setScholarships(scholarshipList);
        
        // Calculate stats
        setStats({
          found: scholarshipList.length,
          saved: scholarshipList.filter(s => s.status === 'interested').length,
          applying: scholarshipList.filter(s => s.status === 'applying').length,
          awarded: scholarshipList.filter(s => s.status === 'awarded').length
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
  };

  const searchScholarships = async () => {
    if (!student) return;
    
    setIsSearching(true);
    try {
      const prompt = `Based on this student profile and additional criteria, find 10 specific, real scholarships they would be eligible for.

Student Profile:
- GPA: ${student.gpa || 'Not provided'}
- Intended Major: ${student.intended_major || 'Undecided'}
- Extracurriculars: ${student.extracurriculars?.map(act => `${act.activity} (${act.role})`).join(', ') || 'None provided'}

Additional Search Criteria:
- Academic Interests & Strengths: ${searchCriteria.interests || 'Not specified'}
- Career Goals: ${searchCriteria.career_goals || 'Not specified'}
- Special Circumstances: ${searchCriteria.circumstances || 'Not specified'}
- Financial Need Level: ${searchCriteria.financial_need}

For each scholarship, provide: scholarship_name, provider, amount, deadline (YYYY-MM-DD), eligibility_criteria, application_link, match_score (1-100), and match_reasoning.`;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            scholarships: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  scholarship_name: { type: "string" },
                  provider: { type: "string" },
                  amount: { type: "string" },
                  deadline: { type: "string" },
                  eligibility_criteria: { type: "string" },
                  application_link: { type: "string" },
                  match_score: { type: "number" },
                  match_reasoning: { type: "string" }
                }
              }
            }
          }
        }
      });

      const newScholarships = response.scholarships || [];
      if (newScholarships.length > 0) {
        const scholarshipsToCreate = newScholarships.map(s => ({...s, student_id: student.id}));
        await Scholarship.bulkCreate(scholarshipsToCreate);
      }

      await loadData();
    } catch (error) {
      console.error("Error searching scholarships:", error);
    }
    setIsSearching(false);
  };

  const updateScholarshipStatus = async (scholarshipId, status) => {
    try {
      await Scholarship.update(scholarshipId, { status });
      await loadData();
    } catch (error) {
      console.error("Error updating scholarship status:", error);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-400" />
            Scholarship Finder
          </h1>
          <p className="text-gray-400 mt-1">Discover scholarships tailored to your profile and goals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Found" value={stats.found} icon={Search} color="green" />
          <StatCard title="Saved" value={stats.saved} icon={Star} color="blue" />
          <StatCard title="Applying" value={stats.applying} icon={Clock} color="amber" />
          <StatCard title="Awarded" value={stats.awarded} icon={Award} color="emerald" />
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Star className="w-5 h-5 text-emerald-400" />
              Find New Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Academic Interests & Strengths</label>
                <Input value={searchCriteria.interests} onChange={e => handleSearchChange('interests', e.target.value)} placeholder="e.g., STEM, environmental science, leadership" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Career Goals</label>
                <Input value={searchCriteria.career_goals} onChange={e => handleSearchChange('career_goals', e.target.value)} placeholder="e.g., doctor, engineer, teacher, entrepreneur" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Special Circumstances</label>
                <Textarea value={searchCriteria.circumstances} onChange={e => handleSearchChange('circumstances', e.target.value)} placeholder="e.g., first-generation, minority background, community service, unique talents" rows={3} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Financial Need Level</label>
                 <Select value={searchCriteria.financial_need} onValueChange={(value) => handleSearchChange('financial_need', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="very_high">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={searchScholarships}
              disabled={isSearching || !student}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base py-3"
            >
              {isSearching ? 'Searching...' : <><Search className="w-5 h-5 mr-2" /> Find Scholarships</>}
            </Button>
          </CardContent>
        </Card>

        {/* Scholarships List */}
        <div className="space-y-4">
          {scholarships.length === 0 ? (
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-200 mb-3">No Scholarships Found Yet</h3>
                <p className="text-gray-400 mb-6">Use the search feature above to discover scholarships.</p>
              </CardContent>
            </Card>
          ) : (
            scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="shadow-lg border-gray-700 bg-gray-800/50">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-white">{scholarship.scholarship_name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{scholarship.provider}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline" className="text-emerald-300 border-emerald-500/30">{scholarship.amount}</Badge>
                      {scholarship.deadline && <span className="text-red-400">Due: {new Date(scholarship.deadline).toLocaleDateString()}</span>}
                      <Select
                        value={scholarship.status}
                        onValueChange={(status) => updateScholarshipStatus(scholarship.id, status)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs bg-gray-700 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discovered">Discovered</SelectItem>
                          <SelectItem value="interested">Saved</SelectItem>
                          <SelectItem value="applying">Applying</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="awarded">Awarded</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      {scholarship.application_link && <a href={scholarship.application_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Apply <ArrowRight className="inline w-3 h-3"/></a>}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{scholarship.match_score}%</p>
                    <p className="text-xs text-gray-400">Match</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
