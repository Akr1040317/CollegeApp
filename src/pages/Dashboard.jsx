import React, { useState, useEffect } from "react";
import { Student } from "@/api/entities";
import { ApplicationTracker as AppTracker } from "@/api/entities";
import { Essay } from "@/api/entities";
import { Scholarship } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
  User, 
  Target, 
  CheckSquare, 
  PenTool, 
  Award, 
  TrendingUp,
  Calendar,
  Star,
  BookOpen,
  DollarSign,
  FileText,
  ArrowRight
} from "lucide-react";

const COLORS = {
  planning: '#3B82F6', // blue
  submitted: '#10B981', // emerald
  accepted: '#22C55E', // green
};

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <Card className="max-w-lg mx-auto shadow-xl border-gray-700 bg-gray-800">
        <CardContent className="p-12 text-center">
          <User className="w-16 h-16 text-gray-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Welcome to CollegeMatch!</h2>
          <p className="text-gray-400 mb-6">
            Start your college journey by creating your profile and getting personalized recommendations.
          </p>
          <Button 
            onClick={() => navigate(createPageUrl("Application"))}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3 text-base font-semibold"
          >
            Create Your Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    applications: 0, submittedApps: 0,
    essays: 0, finalizedEssays: 0,
    scholarships: 0, awardedScholarships: 0,
    profileCompletion: 0,
  });
  const [recentApps, setRecentApps] = useState([]);
  const [recentEssays, setRecentEssays] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [applicationOverview, setApplicationOverview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const students = await Student.list('-updated_date', 1);
      if (students.length === 0) {
        setIsLoading(false);
        return;
      }
      const studentData = students[0];
      setStudent(studentData);

      const [applications, essays, scholarships] = await Promise.all([
        AppTracker.filter({ student_id: studentData.id }),
        Essay.filter({ student_id: studentData.id }),
        Scholarship.filter({ student_id: studentData.id })
      ]);

      // Calculate profile completion
      const fields = ['gpa', 'sat_score', 'act_score', 'intended_major', 'extracurriculars', 'zipcode'];
      const filledFields = fields.filter(f => studentData[f] && (!Array.isArray(studentData[f]) || studentData[f].length > 0)).length;
      const profileCompletion = Math.round(((filledFields + 1) / (fields.length + 1)) * 100);

      // Set stats
      setStats({
        applications: applications.length,
        submittedApps: applications.filter(a => a.application_status === 'submitted').length,
        essays: essays.length,
        finalizedEssays: essays.filter(e => e.status === 'final').length,
        scholarships: scholarships.length,
        awardedScholarships: scholarships.filter(s => s.status === 'awarded').length,
        profileCompletion: profileCompletion,
      });

      // Application Overview Data
      const overviewData = [
        { name: 'Planning', value: applications.filter(a => a.application_status === 'in_progress' || a.application_status === 'not_started').length },
        { name: 'Submitted', value: applications.filter(a => a.application_status === 'submitted').length },
        { name: 'Accepted', value: applications.filter(a => a.application_status === 'accepted').length },
      ].filter(item => item.value > 0);
      setApplicationOverview(overviewData);

      // Recent Data
      setRecentApps(applications.sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date)).slice(0, 2));
      setRecentEssays(essays.sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date)).slice(0, 2));

      // Upcoming Deadlines
      const appDeadlines = applications
        .filter(app => app.application_deadline)
        .map(app => ({...app, type: 'Application'}));
      const scholarshipDeadlines = scholarships
        .filter(s => s.deadline)
        .map(s => ({...s, college_name: s.scholarship_name, application_deadline: s.deadline, type: 'Scholarship' }));

      const allDeadlines = [...appDeadlines, ...scholarshipDeadlines]
        .filter(d => new Date(d.application_deadline) >= new Date())
        .sort((a, b) => new Date(a.application_deadline) - new Date(b.application_deadline))
        .slice(0, 3);
      setUpcomingDeadlines(allDeadlines);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400" />
      </div>
    );
  }

  if (!student) {
    return <EmptyState />;
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color, to }) => (
    <Link to={to}>
    <Card className={`bg-${color}-900/20 border-${color}-700/30 border shadow-lg hover:bg-${color}-900/30 transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm text-${color}-300`}>{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-xs text-${color}-400`}>{subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg bg-${color}-500/20`}>
            <Icon className={`w-5 h-5 text-${color}-300`} />
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Welcome back, {student.first_name}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to continue your college journey? Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Applications" value={stats.applications} subtitle={`${stats.submittedApps} submitted`} icon={CheckSquare} color="blue" to={createPageUrl("ApplicationTracker")} />
          <StatCard title="Essays" value={stats.essays} subtitle={`${stats.finalizedEssays} finalized`} icon={PenTool} color="emerald" to={createPageUrl("EssayCoach")} />
          <StatCard title="Scholarships" value={stats.scholarships} subtitle={`${stats.awardedScholarships} awarded`} icon={DollarSign} color="amber" to={createPageUrl("ScholarshipFinder")} />
          <StatCard title="Profile" value={`${stats.profileCompletion}%`} subtitle="complete" icon={User} color="purple" to={createPageUrl("Application")} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-200">
                  Profile Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Profile Completion</span>
                  <span className="text-sm font-bold text-white">{stats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${stats.profileCompletion}%` }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200">Application Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {applicationOverview.length > 0 ? (
                  <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={applicationOverview} innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {applicationOverview.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  </div>
                ) : <p className="text-center text-gray-400">No applications tracked yet.</p>}
                <div className="flex justify-center gap-4 mt-4">
                  {Object.keys(COLORS).map(key => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[key]}}></div>
                      <span className="capitalize text-gray-400">{key}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-200">Recent Applications</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl("ApplicationTracker"))}>View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentApps.length > 0 ? recentApps.map(app => (
                    <div key={app.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-white">{app.college_name}</p>
                        <p className="text-sm text-gray-400">{app.college_location}</p>
                      </div>
                      <Badge variant="outline" className="border-blue-500/50 text-blue-300 bg-blue-900/30">{app.application_status.replace('_',' ')}</Badge>
                    </div>
                  )) : <p className="text-center text-gray-400">No recent applications.</p>}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-200">Recent Essays</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl("EssayCoach"))}>View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEssays.length > 0 ? recentEssays.map(essay => (
                    <div key={essay.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-white truncate max-w-40">{essay.title}</p>
                        <p className="text-sm text-gray-400">{essay.word_count} words</p>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-300 bg-emerald-900/30">{essay.status}</Badge>
                    </div>
                  )) : <p className="text-center text-gray-400">No recent essays.</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2 border-gray-600 hover:bg-gray-700" onClick={() => navigate(createPageUrl("EssayCoach"))}>
                  <PenTool className="w-4 h-4 text-purple-400" /> Write New Essay
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-gray-600 hover:bg-gray-700" onClick={() => navigate(createPageUrl("ApplicationTracker"))}>
                  <CheckSquare className="w-4 h-4 text-blue-400" /> Track New Application
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-gray-600 hover:bg-gray-700" onClick={() => navigate(createPageUrl("ScholarshipFinder"))}>
                  <DollarSign className="w-4 h-4 text-amber-400" /> Find Scholarships
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                      <div>
                        <p className="font-semibold text-white">{item.college_name}</p>
                        <p className="text-xs text-red-300">{item.type} Due</p>
                      </div>
                      <span className="font-mono text-sm text-red-200">{new Date(item.application_deadline).toLocaleDateString()}</span>
                    </div>
                  )) : <p className="text-center text-gray-400">No upcoming deadlines.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}