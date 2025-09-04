import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GraduationCap, 
  Target, 
  Clock, 
  BookOpen,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { AIService } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

const APPLICATION_STEPS = [
  { value: 'profile', label: 'Building Your Profile' },
  { value: 'research', label: 'Researching Colleges' },
  { value: 'testing', label: 'Standardized Testing' },
  { value: 'essays', label: 'Writing Essays' },
  { value: 'recommendations', label: 'Getting Recommendations' },
  { value: 'applications', label: 'Submitting Applications' },
  { value: 'financial_aid', label: 'Financial Aid & Scholarships' },
  { value: 'decisions', label: 'Making Decisions' },
  { value: 'enrollment', label: 'Enrollment Process' }
];

export default function AIGuidance({ userProfile = null }) {
  const [currentStep, setCurrentStep] = useState('profile');
  const [specificQuestion, setSpecificQuestion] = useState('');
  const [guidance, setGuidance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const generateGuidance = async () => {
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile first to get personalized guidance.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const aiGuidance = await AIService.generateApplicationGuidance(
        userProfile, 
        currentStep, 
        specificQuestion || null
      );
      setGuidance(aiGuidance);
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

  const getStepIcon = (step) => {
    switch (step) {
      case 'profile': return <GraduationCap className="w-4 h-4" />;
      case 'research': return <BookOpen className="w-4 h-4" />;
      case 'testing': return <Target className="w-4 h-4" />;
      case 'essays': return <BookOpen className="w-4 h-4" />;
      case 'recommendations': return <GraduationCap className="w-4 h-4" />;
      case 'applications': return <Target className="w-4 h-4" />;
      case 'financial_aid': return <TrendingUp className="w-4 h-4" />;
      case 'decisions': return <CheckCircle className="w-4 h-4" />;
      case 'enrollment': return <GraduationCap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStepDescription = (step) => {
    switch (step) {
      case 'profile': return 'Building a strong academic and extracurricular profile';
      case 'research': return 'Finding the right colleges for you';
      case 'testing': return 'Preparing for and taking standardized tests';
      case 'essays': return 'Crafting compelling personal statements and essays';
      case 'recommendations': return 'Securing strong recommendation letters';
      case 'applications': return 'Completing and submitting applications';
      case 'financial_aid': return 'Understanding and applying for financial aid';
      case 'decisions': return 'Making informed college decisions';
      case 'enrollment': return 'Completing enrollment and preparation';
      default: return 'General application guidance';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Lightbulb className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">AI Application Guidance</h2>
        <p className="text-gray-600">
          Get personalized, step-by-step guidance for your college application journey
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Get Personalized Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Application Step</label>
              <Select value={currentStep} onValueChange={setCurrentStep}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current step" />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STEPS.map((step) => (
                    <SelectItem key={step.value} value={step.value}>
                      <div className="flex items-center gap-2">
                        {getStepIcon(step.value)}
                        <span>{step.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {getStepDescription(currentStep)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Specific Question (Optional)
            </label>
            <Textarea
              placeholder="Ask a specific question about your current step..."
              value={specificQuestion}
              onChange={(e) => setSpecificQuestion(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={generateGuidance} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Guidance...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Get AI Guidance
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {guidance && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <CardTitle>Your Personalized Guidance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {guidance}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={generateGuidance}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Get Updated Guidance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium text-sm">Start Early</h4>
                <p className="text-xs text-gray-600">Begin your application process at least 12-18 months before your intended start date.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-sm">Research Thoroughly</h4>
                <p className="text-xs text-gray-600">Visit campuses, talk to current students, and understand each school's culture and programs.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-sm">Be Authentic</h4>
                <p className="text-xs text-gray-600">Let your genuine personality and experiences shine through in your essays and applications.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <h4 className="font-medium text-sm">Stay Organized</h4>
                <p className="text-xs text-gray-600">Keep track of deadlines, requirements, and application materials for each school.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}