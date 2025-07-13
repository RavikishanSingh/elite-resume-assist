import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ATSScoreMeterProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const ATSScoreMeter = ({ score, size = 'medium', showLabel = true }: ATSScoreMeterProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-24 h-24',
          text: 'text-lg',
          strokeWidth: 8,
          radius: 40
        };
      case 'large':
        return {
          container: 'w-48 h-48',
          text: 'text-4xl',
          strokeWidth: 12,
          radius: 88
        };
      default:
        return {
          container: 'w-32 h-32',
          text: 'text-2xl',
          strokeWidth: 10,
          radius: 54
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const circumference = 2 * Math.PI * sizeClasses.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses.container}`}>
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r={sizeClasses.radius}
            stroke="currentColor"
            strokeWidth={sizeClasses.strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={sizeClasses.radius}
            stroke={getScoreColor(score)}
            strokeWidth={sizeClasses.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))'
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-bold ${sizeClasses.text} text-gray-900`}>
              {score}
            </div>
            {size === 'large' && (
              <div className="text-sm text-gray-600 font-medium">
                ATS Score
              </div>
            )}
          </div>
        </div>

        {/* Animated pulse effect for high scores */}
        {score >= 80 && (
          <div className="absolute inset-0 rounded-full animate-pulse">
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${getScoreGradient(score)} opacity-20`}></div>
          </div>
        )}
      </div>

      {showLabel && size !== 'large' && (
        <div className="mt-3 text-center">
          <div className="flex items-center gap-1 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">ATS Compatibility</span>
          </div>
        </div>
      )}

      {/* Score interpretation */}
      {size === 'large' && (
        <div className="mt-4 text-center">
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {score >= 90 ? 'Excellent' : 
             score >= 80 ? 'Very Good' : 
             score >= 70 ? 'Good' : 
             score >= 60 ? 'Fair' : 
             score >= 40 ? 'Needs Work' : 'Poor'}
          </div>
          <div className="text-sm text-gray-600 max-w-xs">
            {score >= 80 ? 'Your resume is highly optimized for ATS systems' :
             score >= 60 ? 'Your resume has good ATS compatibility with room for improvement' :
             'Your resume needs significant optimization for ATS systems'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScoreMeter;