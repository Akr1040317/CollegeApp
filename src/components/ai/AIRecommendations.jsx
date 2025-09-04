import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  Star, 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { AIService } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";

export default function AIRecommendations({ userProfile, preferences, existingColleges = [] }) {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const generateRecommendations = async () => {
    if (!userProfile || !preferences) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile and preferences first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const aiRecommendations = await AIService.generateCollegeRecommendations(
        userProfile, 
        preferences, 
        existingColleges
      );
      setRecommendations(aiRecommendations);
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'reach': return 'bg-red-100 text-red-800 border-red-200';
      case 'target': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'safety': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'reach': return 'Reach School';
      case 'target': return 'Target School';
      case 'safety': return 'Safety School';
      default: return category;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'reach': return <TrendingUp className="w-4 h-4" />;
      case 'target': return <Star className="w-4 h-4" />;
      case 'safety': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI College Recommendations</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold">AI Recommendations Error</h3>
        </div>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={generateRecommendations} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  if (!recommendations) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI-Powered College Recommendations</h3>
          <p className="text-gray-600 mb-4">
            Get personalized college recommendations based on your profile, preferences, and academic achievements.
          </p>
          <Button onClick={generateRecommendations} className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Generate Recommendations
          </Button>
        </div>
      </Card>
    );
  }

  const { schools = [] } = recommendations;
  const reachSchools = schools.filter(s => s.category === 'reach');
  const targetSchools = schools.filter(s => s.category === 'target');
  const safetySchools = schools.filter(s => s.category === 'safety');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI College Recommendations</h3>
        <Button onClick={generateRecommendations} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>

      {/* Reach Schools */}
      {reachSchools.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Reach Schools
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reachSchools.map((school, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <Badge className={getCategoryColor(school.category)}>
                      {getCategoryIcon(school.category)}
                      <span className="ml-1">{getCategoryLabel(school.category)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Why it's a good fit:</h5>
                      <p className="text-sm text-gray-600">{school.fit_reason}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Key strengths:</h5>
                      <p className="text-sm text-gray-600">{school.key_strengths}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Notable programs:</h5>
                      <p className="text-sm text-gray-600">{school.notable_programs}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Acceptance Rate: {school.acceptance_rate}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Target Schools */}
      {targetSchools.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Target Schools
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {targetSchools.map((school, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <Badge className={getCategoryColor(school.category)}>
                      {getCategoryIcon(school.category)}
                      <span className="ml-1">{getCategoryLabel(school.category)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Why it's a good fit:</h5>
                      <p className="text-sm text-gray-600">{school.fit_reason}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Key strengths:</h5>
                      <p className="text-sm text-gray-600">{school.key_strengths}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Notable programs:</h5>
                      <p className="text-sm text-gray-600">{school.notable_programs}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Acceptance Rate: {school.acceptance_rate}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Safety Schools */}
      {safetySchools.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Safety Schools
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {safetySchools.map((school, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <Badge className={getCategoryColor(school.category)}>
                      {getCategoryIcon(school.category)}
                      <span className="ml-1">{getCategoryLabel(school.category)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Why it's a good fit:</h5>
                      <p className="text-sm text-gray-600">{school.fit_reason}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Key strengths:</h5>
                      <p className="text-sm text-gray-600">{school.key_strengths}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Notable programs:</h5>
                      <p className="text-sm text-gray-600">{school.notable_programs}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Acceptance Rate: {school.acceptance_rate}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}