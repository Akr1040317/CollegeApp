import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  PenTool, 
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
  FileText,
  Lightbulb,
  Copy,
  Download
} from 'lucide-react';
import { 
  ESSAY_STATUS, 
  getStatusLabel, 
  getStatusColor,
  calculateWordCount,
  calculateCharacterCount,
  calculateReadingTime,
  getWordCountStatus,
  getWordCountColor,
  AI_FEEDBACK_CATEGORIES,
  getFeedbackScoreColor,
  getOverallScoreColor
} from '@/types/essays';

export default function EssayEditor({ 
  essay, 
  onUpdateEssay, 
  onAnalyzeEssay,
  onSaveEssay 
}) {
  const [content, setContent] = useState(essay?.content || '');
  const [title, setTitle] = useState(essay?.title || '');
  const [status, setStatus] = useState(essay?.status || ESSAY_STATUS.NOT_STARTED);
  const [notes, setNotes] = useState(essay?.notes || '');
  const [showPreview, setShowPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(essay?.ai_feedback || null);

  useEffect(() => {
    if (essay) {
      setContent(essay.content || '');
      setTitle(essay.title || '');
      setStatus(essay.status || ESSAY_STATUS.NOT_STARTED);
      setNotes(essay.notes || '');
      setFeedback(essay.ai_feedback || null);
    }
  }, [essay]);

  const wordCount = calculateWordCount(content);
  const characterCount = calculateCharacterCount(content);
  const readingTime = calculateReadingTime(wordCount);
  const wordCountStatus = getWordCountStatus(wordCount, essay?.word_limit);
  const wordCountColor = getWordCountColor(wordCountStatus);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    
    // Auto-save every 30 seconds
    const updatedEssay = {
      ...essay,
      content: newContent,
      word_count: calculateWordCount(newContent),
      character_count: calculateCharacterCount(newContent),
      reading_time_minutes: calculateReadingTime(calculateWordCount(newContent)),
      last_edited_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onUpdateEssay(updatedEssay);
  };

  const handleSave = () => {
    const updatedEssay = {
      ...essay,
      title,
      content,
      status,
      notes,
      word_count: wordCount,
      character_count: characterCount,
      reading_time_minutes: readingTime,
      updated_at: new Date().toISOString()
    };
    
    onSaveEssay(updatedEssay);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await onAnalyzeEssay(content, essay);
      setFeedback(analysis);
      
      const updatedEssay = {
        ...essay,
        ai_feedback: analysis,
        updated_at: new Date().toISOString()
      };
      
      onUpdateEssay(updatedEssay);
    } catch (error) {
      console.error('Error analyzing essay:', error);
    }
    setIsAnalyzing(false);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    const updatedEssay = {
      ...essay,
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    onUpdateEssay(updatedEssay);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const downloadEssay = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!essay) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No essay selected</h3>
        <p className="text-gray-400">Select an essay to start editing</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <Badge className={getStatusColor(status)}>
                  {getStatusLabel(status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {essay.essay_type?.replace('_', ' ').toUpperCase()}
                </span>
                {essay.college_name && (
                  <span>• {essay.college_name}</span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={downloadEssay}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-200">Essay Editor</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${wordCountColor}`}>
                    {wordCount}/{essay.word_limit || '∞'} words
                  </span>
                  <span className="text-sm text-gray-400">
                    • {characterCount} characters
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {content || 'Start writing your essay...'}
                  </div>
                </div>
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing your essay here..."
                  className="min-h-96 text-base leading-relaxed bg-gray-700 border-gray-600 text-white focus:border-blue-500 resize-none"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Actions */}
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Status & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {Object.values(ESSAY_STATUS).map(statusOption => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {getStatusLabel(statusOption)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !content.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get AI Feedback
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Essay
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Word Count Stats */}
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Writing Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Words</span>
                <span className={`font-semibold ${wordCountColor}`}>{wordCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Characters</span>
                <span className="text-white font-semibold">{characterCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Reading Time</span>
                <span className="text-white font-semibold">{readingTime} min</span>
              </div>
              {essay.word_limit && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      wordCountStatus === 'over' ? 'bg-red-500' :
                      wordCountStatus === 'near' ? 'bg-orange-500' :
                      wordCountStatus === 'good' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.min((wordCount / essay.word_limit) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Feedback */}
          {feedback && (
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">AI Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.overall_score && (
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className={`text-3xl font-bold ${getFeedbackScoreColor(feedback.overall_score)}`}>
                      {feedback.overall_score}/10
                    </div>
                    <p className="text-sm text-gray-600">Overall Score</p>
                  </div>
                )}

                {feedback.feedback_categories?.map((item, index) => (
                  <div key={index} className="border-l-4 border-purple-300 pl-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-sm text-white">{item.category}</h4>
                      <Badge variant="outline" className={getFeedbackScoreColor(item.score)}>
                        {item.score}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{item.feedback}</p>
                    {item.suggestions && (
                      <p className="text-xs text-purple-400 italic">{item.suggestions}</p>
                    )}
                  </div>
                ))}

                {feedback.strengths && (
                  <div>
                    <h4 className="font-semibold text-sm text-green-400 mb-2">Strengths</h4>
                    <ul className="text-xs space-y-1">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-green-300">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.areas_for_improvement && (
                  <div>
                    <h4 className="font-semibold text-sm text-orange-400 mb-2">Areas for Improvement</h4>
                    <ul className="text-xs space-y-1">
                      {feedback.areas_for_improvement.map((area, index) => (
                        <li key={index} className="text-orange-300">• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="border-gray-700 bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-gray-200">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
