import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Target,
  Lightbulb,
  Award,
  BarChart3,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { calculateATSScore, type ATSFeedback } from '@/utils/atsChecker';
import ATSScoreMeter from './ATSScoreMeter';
import ATSImprovementSuggestions from './ATSImprovementSuggestions';
import ATSKeywordAnalyzer from './ATSKeywordAnalyzer';

interface ATSScoreTabProps {
  data: any;
}

const ATSScoreTab = ({ data }: ATSScoreTabProps) => {
  const [atsAnalysis, setAtsAnalysis] = useState<{ score: number; feedback: ATSFeedback[] } | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (data) {
      setIsAnalyzing(true);
      // Simulate analysis delay for better UX
      setTimeout(() => {
        const analysis = calculateATSScore(data);
        if (atsAnalysis) {
          setPreviousScore(atsAnalysis.score);
        }
        setAtsAnalysis(analysis);
        setIsAnalyzing(false);
      }, 1000);
    }
  }, [data]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 80) return { label: 'Very Good', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (score >= 60) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (score >= 40) return { label: 'Needs Work', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    return { label: 'Poor', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const getScoreChange = () => {
    if (previousScore === null || !atsAnalysis) return null;
    const change = atsAnalysis.score - previousScore;
    if (change > 0) return { icon: ArrowUp, color: 'text-green-600', text: `+${change}` };
    if (change < 0) return { icon: ArrowDown, color: 'text-red-600', text: `${change}` };
    return { icon: Minus, color: 'text-gray-600', text: '0' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'contact information': return User;
      case 'skills & keywords': return Wrench;
      case 'work experience': return Briefcase;
      case 'education': return GraduationCap;
      case 'formatting & structure': return FileText;
      default: return Target;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your resume for ATS compatibility...</p>
        </div>
      </div>
    );
  }

  if (!atsAnalysis) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to analyze resume. Please ensure you have filled out the required sections.
        </AlertDescription>
      </Alert>
    );
  }

  const scoreBadge = getScoreBadge(atsAnalysis.score);
  const scoreChange = getScoreChange();

  return (
    <div className="space-y-6">
      {/* Header with Score Overview */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ATS Compatibility Analysis</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive analysis of how well your resume performs with Applicant Tracking Systems
        </p>
      </div>

      {/* Score Meter Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl">Overall ATS Score</CardTitle>
            </div>
            {scoreChange && (
              <div className={`flex items-center gap-1 ${scoreChange.color}`}>
                <scoreChange.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{scoreChange.text}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge className={`${scoreBadge.color} border text-lg px-4 py-2`}>
              {scoreBadge.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ATSScoreMeter score={atsAnalysis.score} size="large" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg border">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">ATS Compatibility</p>
              <p className="text-lg font-bold text-gray-900">{atsAnalysis.score}%</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Strengths Found</p>
              <p className="text-lg font-bold text-gray-900">{atsAnalysis.feedback.filter(f => f.score >= 15).length}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Areas to Improve</p>
              <p className="text-lg font-bold text-gray-900">{atsAnalysis.feedback.filter(f => f.score < 15).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="tips">Pro Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid gap-4">
            {atsAnalysis.feedback.map((item, index) => {
              const IconComponent = getCategoryIcon(item.category);
              const isGood = item.score >= 15;
              const isFair = item.score >= 10 && item.score < 15;
              
              return (
                <Card key={index} className={`border-l-4 ${
                  isGood ? 'border-l-green-500 bg-green-50' : 
                  isFair ? 'border-l-yellow-500 bg-yellow-50' : 
                  'border-l-red-500 bg-red-50'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-6 h-6 ${
                          isGood ? 'text-green-600' : 
                          isFair ? 'text-yellow-600' : 
                          'text-red-600'
                        }`} />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.category}</h3>
                          <p className="text-gray-600">{item.feedback}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(item.score * 4)}`}>
                          {Math.round(item.score * 4)}%
                        </div>
                        <Progress value={item.score * 4} className="w-24 mt-2" />
                      </div>
                    </div>
                    
                    {item.suggestions.length > 0 && (
                      <div className="mt-4 p-4 bg-white rounded-lg border">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          Improvement Suggestions
                        </h4>
                        <ul className="space-y-1">
                          {item.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="improvements">
          <ATSImprovementSuggestions data={data} feedback={atsAnalysis.feedback} />
        </TabsContent>

        <TabsContent value="keywords">
          <ATSKeywordAnalyzer data={data} />
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Zap className="w-5 h-5" />
                  Quick Wins (5-10 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Add contact information:</strong> Ensure phone, email, and location are clearly visible
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Include relevant keywords:</strong> Add industry-specific terms from job descriptions
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Use standard section headers:</strong> "Experience", "Education", "Skills" work best
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Target className="w-5 h-5" />
                  Medium Impact (15-30 minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Quantify achievements:</strong> Add numbers, percentages, and metrics to bullet points
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Optimize job descriptions:</strong> Start with action verbs and include relevant skills
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Add a professional summary:</strong> 2-3 sentences highlighting your value proposition
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Award className="w-5 h-5" />
                  High Impact (30+ minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Tailor for each application:</strong> Customize keywords and skills for specific job postings
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Add relevant projects:</strong> Include portfolio work that demonstrates key skills
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Optimize for industry:</strong> Research and include industry-specific terminology
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ATSScoreTab;