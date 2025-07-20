import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

interface ATSScoreMeterProps {
  score: number;
  maxScore?: number;
  showDetails?: boolean;
  className?: string;
}

export const ATSScoreMeter: React.FC<ATSScoreMeterProps> = ({
  score,
  maxScore = 100,
  showDetails = true,
  className = ''
}) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5" />
          ATS Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getScoreIcon(score)}
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-gray-500">/ {maxScore}</span>
          </div>
          <Badge variant={getScoreBadgeVariant(score)}>
            {getScoreLabel(score)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0</span>
            <span>{percentage.toFixed(1)}%</span>
            <span>{maxScore}</span>
          </div>
        </div>

        {showDetails && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">
              {score >= 80 && "Your resume is well-optimized for ATS systems!"}
              {score >= 60 && score < 80 && "Your resume is good but could use some improvements."}
              {score >= 40 && score < 60 && "Your resume needs several improvements for better ATS compatibility."}
              {score < 40 && "Your resume requires significant optimization for ATS systems."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ATSScoreMeter;