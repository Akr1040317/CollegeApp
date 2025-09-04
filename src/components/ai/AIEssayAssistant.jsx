import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  Lightbulb, 
  FileText, 
  Star, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { AIService } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

export default function AIEssayAssistant({ userProfile = null }) {
  const [activeTab, setActiveTab] = useState('brainstorm');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Brainstorming state
  const [brainstormPrompt, setBrainstormPrompt] = useState('');
  const [essayType, setEssayType] = useState('common_app');
  const [brainstormIdeas, setBrainstormIdeas] = useState(null);

  // Analysis state
  const [analysisEssay, setAnalysisEssay] = useState('');
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [analysisType, setAnalysisType] = useState('common_app');
  const [analysisResult, setAnalysisResult] = useState(null);

  const generateIdeas = async () => {
    if (!brainstormPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter an essay prompt to generate ideas.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ideas = await AIService.generateEssayIdeas(
        brainstormPrompt, 
        essayType, 
        userProfile
      );
      setBrainstormIdeas(ideas);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeEssay = async () => {
    if (!analysisEssay.trim() || !analysisPrompt.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter both the essay prompt and your essay content.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await AIService.analyzeEssay(
        analysisEssay, 
        analysisPrompt, 
        analysisType, 
        userProfile
      );
      setAnalysisResult(analysis);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength >= 8) return 'text-green-600 bg-green-100';
    if (strength >= 6) return 'text-yellow-600 bg-yellow-100';
    if (strength >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStrengthLabel = (strength) => {
    if (strength >= 8) return 'Strong';
    if (strength >= 6) return 'Good';
    if (strength >= 4) return 'Needs Work';
    return 'Weak';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">AI Essay Assistant</h2>
        <p className="text-gray-600">
          Get AI-powered brainstorming ideas and detailed feedback for your college essays
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brainstorm" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Brainstorm Ideas
          </TabsTrigger>
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Analyze Essay
          </TabsTrigger>
        </TabsList>

        {/* Brainstorming Tab */}
        <TabsContent value="brainstorm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Essay Brainstorming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="essay-type">Essay Type</Label>
                  <Select value={essayType} onValueChange={setEssayType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select essay type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common_app">Common App Personal Statement</SelectItem>
                      <SelectItem value="supplemental">Supplemental Essay</SelectItem>
                      <SelectItem value="scholarship">Scholarship Essay</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt">Essay Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Paste the essay prompt here..."
                  value={brainstormPrompt}
                  onChange={(e) => setBrainstormPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={generateIdeas} 
                disabled={isLoading || !brainstormPrompt.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Ideas
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {brainstormIdeas && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Generated Ideas</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {brainstormIdeas.ideas.map((idea, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            {index + 1}
                          </Badge>
                          <p className="text-sm">{idea}</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={generateIdeas}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate More Ideas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Essay Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="analysis-type">Essay Type</Label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select essay type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common_app">Common App Personal Statement</SelectItem>
                      <SelectItem value="supplemental">Supplemental Essay</SelectItem>
                      <SelectItem value="scholarship">Scholarship Essay</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="analysis-prompt">Essay Prompt</Label>
                <Textarea
                  id="analysis-prompt"
                  placeholder="Paste the essay prompt here..."
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="analysis-essay">Your Essay</Label>
                <Textarea
                  id="analysis-essay"
                  placeholder="Paste your essay content here..."
                  value={analysisEssay}
                  onChange={(e) => setAnalysisEssay(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Word count: {analysisEssay.split(/\s+/).filter(word => word.length > 0).length}
                </p>
              </div>

              <Button 
                onClick={analyzeEssay} 
                disabled={isLoading || !analysisEssay.trim() || !analysisPrompt.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Essay...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Analyze Essay
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {analysisResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Analysis Results</h3>
                    </div>
                    <Badge className={getStrengthColor(analysisResult.strength)}>
                      <Star className="w-3 h-3 mr-1" />
                      {analysisResult.strength}/10 - {getStrengthLabel(analysisResult.strength)}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Content & Message</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {analysisResult.content}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Structure & Flow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {analysisResult.structure}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Writing Quality</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {analysisResult.writing}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Specific Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {analysisResult.suggestions}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Overall Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {analysisResult.assessment}
                      </p>
                    </CardContent>
                  </Card>

                  <Button 
                    variant="outline" 
                    onClick={analyzeEssay}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Analyze Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}