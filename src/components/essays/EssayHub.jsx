import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  PenTool, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Target,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { 
  ESSAY_TYPES, 
  ESSAY_STATUS, 
  COMMON_APP_PROMPTS,
  getEssayTypeLabel,
  getStatusLabel,
  getStatusColor,
  calculateWordCount,
  calculateCharacterCount,
  calculateReadingTime,
  getWordCountStatus,
  getWordCountColor,
  ESSAY_TEMPLATES,
  AI_FEEDBACK_CATEGORIES,
  getFeedbackScoreColor,
  getOverallScoreColor
} from '@/types/essays';

export default function EssayHub({ 
  essays = [], 
  onUpdateEssay, 
  onAddEssay, 
  onRemoveEssay,
  onAnalyzeEssay 
}) {
  const [activeTab, setActiveTab] = useState('common-app');
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEssay, setNewEssay] = useState({
    title: '',
    essay_type: ESSAY_TYPES.COMMON_APP,
    common_app_prompt_id: '',
    college_name: '',
    college_prompt: '',
    word_limit: 650,
    notes: '',
    tags: []
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWordCountStatus = (wordCount, wordLimit) => {
    if (!wordLimit) return 'normal';
    const percentage = (wordCount / wordLimit) * 100;
    
    if (percentage >= 100) return 'over';
    if (percentage >= 90) return 'near';
    if (percentage >= 50) return 'good';
    return 'low';
  };

  const handleAddEssay = () => {
    if (!newEssay.title) return;
    
    const essay = {
      ...newEssay,
      id: `essay-${Date.now()}`,
      student_id: 'current-user',
      content: '',
      status: ESSAY_STATUS.NOT_STARTED,
      word_count: 0,
      character_count: 0,
      reading_time_minutes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onAddEssay(essay);
    setNewEssay({
      title: '',
      essay_type: ESSAY_TYPES.COMMON_APP,
      common_app_prompt_id: '',
      college_name: '',
      college_prompt: '',
      word_limit: 650,
      notes: '',
      tags: []
    });
    setIsEditing(false);
  };

  const handleUpdateEssay = (essay) => {
    onUpdateEssay(essay);
    setSelectedEssay(null);
    setIsEditing(false);
  };

  const handleRemoveEssay = (essayId) => {
    onRemoveEssay(essayId);
    setSelectedEssay(null);
  };

  const handleContentChange = (essayId, content) => {
    const wordCount = calculateWordCount(content);
    const characterCount = calculateCharacterCount(content);
    const readingTime = calculateReadingTime(wordCount);
    
    const updatedEssay = {
      ...essays.find(e => e.id === essayId),
      content,
      word_count: wordCount,
      character_count: characterCount,
      reading_time_minutes: readingTime,
      last_edited_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onUpdateEssay(updatedEssay);
  };

  const getFilteredEssays = () => {
    let filtered = essays;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(essay => essay.status === filterStatus);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(essay => essay.essay_type === filterType);
    }
    
    return filtered;
  };

  const getEssayStats = () => {
    const total = essays.length;
    const completed = essays.filter(e => e.status === ESSAY_STATUS.SUBMITTED).length;
    const inProgress = essays.filter(e => e.status === ESSAY_STATUS.IN_PROGRESS || e.status === ESSAY_STATUS.DRAFT).length;
    const notStarted = essays.filter(e => e.status === ESSAY_STATUS.NOT_STARTED).length;
    const totalWords = essays.reduce((sum, e) => sum + (e.word_count || 0), 0);
    
    return { total, completed, inProgress, notStarted, totalWords };
  };

  const stats = getEssayStats();
  const filteredEssays = getFilteredEssays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-200">Essay Writing Hub</CardTitle>
          <p className="text-gray-400">Write, edit, and get feedback on your college essays</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-300">{stats.total}</div>
              <div className="text-sm text-blue-400">Total Essays</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-300">{stats.completed}</div>
              <div className="text-sm text-green-400">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-300">{stats.inProgress}</div>
              <div className="text-sm text-yellow-400">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
              <AlertTriangle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-300">{stats.notStarted}</div>
              <div className="text-sm text-gray-400">Not Started</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-300">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-purple-400">Total Words</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-700">
          <TabsTrigger value="common-app" className="data-[state=active]:bg-blue-600">
            <FileText className="w-4 h-4 mr-2" />
            Common App
          </TabsTrigger>
          <TabsTrigger value="college-essays" className="data-[state=active]:bg-purple-600">
            <Users className="w-4 h-4 mr-2" />
            College Essays
          </TabsTrigger>
          <TabsTrigger value="supplemental" className="data-[state=active]:bg-indigo-600">
            <PenTool className="w-4 h-4 mr-2" />
            Supplemental
          </TabsTrigger>
          <TabsTrigger value="my-essays" className="data-[state=active]:bg-green-600">
            <BookOpen className="w-4 h-4 mr-2" />
            My Essays
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-orange-600">
            <Target className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Common App Tab */}
        <TabsContent value="common-app" className="space-y-6">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Common Application Essay Prompts</CardTitle>
              <p className="text-gray-400">Choose from the 7 official Common App prompts for 2024-2025</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_APP_PROMPTS.map((prompt, index) => (
                  <Card key={prompt.id} className="border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              Prompt {index + 1}
                            </Badge>
                            <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                              {prompt.word_limit} words
                            </Badge>
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {prompt.description}
                          </h4>
                          <p className="text-gray-300 leading-relaxed mb-4">
                            {prompt.prompt}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setNewEssay({
                              title: `Common App Essay - Prompt ${index + 1}`,
                              essay_type: ESSAY_TYPES.COMMON_APP,
                              common_app_prompt_id: prompt.id,
                              college_name: '',
                              college_prompt: prompt.prompt,
                              word_limit: prompt.word_limit,
                              notes: '',
                              tags: []
                            });
                            setIsEditing(true);
                            setActiveTab('my-essays');
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Start Essay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* College Essays Tab */}
        <TabsContent value="college-essays" className="space-y-6">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <Users className="w-5 h-5" />
                College-Specific Essays
              </CardTitle>
              <p className="text-gray-400">Manage essays for each college in your list</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mock colleges for demonstration */}
                {[
                  { name: "Harvard University", prompts: ["Why Harvard?", "Describe a challenge you've overcome"] },
                  { name: "Stanford University", prompts: ["Why Stanford?", "Tell us about something meaningful to you"] },
                  { name: "MIT", prompts: ["Why MIT?", "Describe your community"] },
                  { name: "UC Berkeley", prompts: ["Personal insight questions"] }
                ].map((college, index) => (
                  <Card key={index} className="border-gray-600 bg-gray-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-200">{college.name}</CardTitle>
                        <Badge className="bg-purple-100 text-purple-800">
                          {college.prompts.length} prompts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {college.prompts.map((prompt, promptIndex) => (
                          <div key={promptIndex} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm text-gray-300 mb-1">Prompt {promptIndex + 1}</p>
                              <p className="text-gray-200">{prompt}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-500 text-gray-300 hover:bg-gray-600"
                                onClick={() => {
                                  setNewEssay({
                                    title: `${college.name} - Prompt ${promptIndex + 1}`,
                                    essay_type: ESSAY_TYPES.SUPPLEMENTAL,
                                    college_name: college.name,
                                    college_prompt: prompt,
                                    word_limit: 650,
                                    notes: '',
                                    tags: [college.name]
                                  });
                                  setIsEditing(true);
                                  setActiveTab('my-essays');
                                }}
                              >
                                <PenTool className="w-3 h-3 mr-1" />
                                Write
                              </Button>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                                onClick={() => {
                                  // AI help for this prompt
                                  console.log(`AI help for ${college.name} prompt: ${prompt}`);
                                }}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Help
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-600">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-gray-500 text-gray-300 hover:bg-gray-600"
                            onClick={() => {
                              setNewEssay({
                                title: `${college.name} - New Prompt`,
                                essay_type: ESSAY_TYPES.SUPPLEMENTAL,
                                college_name: college.name,
                                college_prompt: '',
                                word_limit: 650,
                                notes: '',
                                tags: [college.name]
                              });
                              setIsEditing(true);
                              setActiveTab('my-essays');
                            }}
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            Add Custom Prompt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add College Button */}
                <Card className="border-dashed border-gray-600 bg-gray-700/30">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Add More Colleges</h3>
                    <p className="text-gray-400 mb-4">Add colleges to your list to see their specific essay prompts</p>
                    <Button
                      onClick={() => {
                        // Navigate to college list or search
                        console.log("Navigate to college search");
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Colleges
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplemental Tab */}
        <TabsContent value="supplemental" className="space-y-6">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Supplemental Essays</CardTitle>
              <p className="text-gray-400">College-specific essays and prompts</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12">
                  <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No supplemental essays yet</h3>
                  <p className="text-gray-400 mb-4">Add colleges to your list to see their specific essay prompts</p>
                  <Button
                    onClick={() => {
                      setNewEssay({
                        title: '',
                        essay_type: ESSAY_TYPES.SUPPLEMENTAL,
                        common_app_prompt_id: '',
                        college_name: '',
                        college_prompt: '',
                        word_limit: 650,
                        notes: '',
                        tags: []
                      });
                      setIsEditing(true);
                      setActiveTab('my-essays');
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Supplemental Essay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Essays Tab */}
        <TabsContent value="my-essays" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-200">Your Essays</h3>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.values(ESSAY_STATUS).map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(ESSAY_TYPES).map(type => (
                    <SelectItem key={type} value={type}>
                      {getEssayTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Essay
              </Button>
            </div>
          </div>

          {/* Add/Edit Essay Form */}
          {isEditing && (
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Add New Essay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Essay Title</Label>
                    <Input
                      value={newEssay.title}
                      onChange={(e) => setNewEssay(prev => ({...prev, title: e.target.value}))}
                      placeholder="Enter essay title"
                      className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Essay Type</Label>
                    <Select
                      value={newEssay.essay_type}
                      onValueChange={(value) => setNewEssay(prev => ({...prev, essay_type: value}))}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {Object.values(ESSAY_TYPES).map(type => (
                          <SelectItem key={type} value={type}>
                            {getEssayTypeLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newEssay.essay_type === ESSAY_TYPES.SUPPLEMENTAL && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">College Name</Label>
                      <Input
                        value={newEssay.college_name}
                        onChange={(e) => setNewEssay(prev => ({...prev, college_name: e.target.value}))}
                        placeholder="Which college is this for?"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Word Limit</Label>
                      <Input
                        type="number"
                        value={newEssay.word_limit}
                        onChange={(e) => setNewEssay(prev => ({...prev, word_limit: parseInt(e.target.value)}))}
                        placeholder="650"
                        className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-300">Essay Prompt (Optional)</Label>
                  <Textarea
                    value={newEssay.college_prompt}
                    onChange={(e) => setNewEssay(prev => ({...prev, college_prompt: e.target.value}))}
                    placeholder="Paste the essay prompt here..."
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Notes</Label>
                  <Textarea
                    value={newEssay.notes}
                    onChange={(e) => setNewEssay(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Add any notes about this essay..."
                    className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddEssay}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Essay
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Essays List */}
          <div className="space-y-4">
            {filteredEssays.length === 0 ? (
              <Card className="border-gray-700 bg-gray-800/80">
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No essays yet</h3>
                  <p className="text-gray-400 mb-4">Start writing your first college essay</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Essay
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredEssays.map((essay) => {
                const wordCountStatus = getWordCountStatus(essay.word_count, essay.word_limit);
                const wordCountColor = getWordCountColor(wordCountStatus);
                
                return (
                  <Card key={essay.id} className="border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-white mb-2">{essay.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                            <span>{getEssayTypeLabel(essay.essay_type)}</span>
                            {essay.college_name && (
                              <>
                                <span>•</span>
                                <span>{essay.college_name}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>Updated: {formatDate(essay.updated_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getStatusColor(essay.status)}>
                              {getStatusLabel(essay.status)}
                            </Badge>
                            <span className={`text-sm ${wordCountColor}`}>
                              {essay.word_count}/{essay.word_limit || '∞'} words
                            </span>
                            {essay.reading_time_minutes > 0 && (
                              <span className="text-sm text-gray-400">
                                • {essay.reading_time_minutes} min read
                              </span>
                            )}
                          </div>
                          {essay.notes && (
                            <p className="text-gray-300 text-sm">{essay.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setSelectedEssay(essay)}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleRemoveEssay(essay.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Essay Writing Templates</CardTitle>
              <p className="text-gray-400">Structured guides to help you write effective essays</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(ESSAY_TEMPLATES).map(([type, template]) => (
                  <Card key={type} className="border-gray-600 bg-gray-700/50">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        {getEssayTypeLabel(type)} Template
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-300 mb-2">Structure</h5>
                          <ol className="text-sm text-gray-400 space-y-1">
                            {template.structure.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-400 font-semibold">{index + 1}.</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-300 mb-2">Writing Tips</h5>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {template.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400 font-semibold">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
