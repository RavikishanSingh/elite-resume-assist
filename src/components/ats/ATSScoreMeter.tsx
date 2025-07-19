import React from 'react';
import { TrendingUp, Target, Award, CheckCircle } from 'lucide-react';

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

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Award;
    if (score >= 70) return CheckCircle;
    return Target;
  };

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
            {size === 'large' && React.createElement(getScoreIcon(score), { className: "w-8 h-8 mx-auto mb-2 text-gray-600" })}
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
        {score >= 80 && size === 'large' && (
          <div className="absolute inset-0 rounded-full">
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${getScoreGradient(score)} opacity-10 animate-pulse`}></div>
          </div>
        )}

        {/* Progress rings for large size */}
        {size === 'large' && (
          <div className="absolute inset-2 rounded-full border-2 border-gray-100">
            <div className="absolute inset-2 rounded-full border border-gray-50"></div>
          </div>
        )}
      </div>

      {/* Score breakdown for large size */}
      {size === 'large' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <div>Applicant Tracking System Compatibility</div>
        </div>
      )}

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
        <div className="mt-6 text-center max-w-sm">
          <div className="text-xl font-bold text-gray-900 mb-2">
            {score >= 90 ? 'Excellent' : 
             score >= 80 ? 'Very Good' : 
             score >= 70 ? 'Good' : 
             score >= 60 ? 'Fair' : 
             score >= 40 ? 'Needs Work' : 'Poor'}
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            {score >= 90 ? 'Outstanding! Your resume is perfectly optimized for ATS systems and will likely pass through automated screening.' :
             score >= 80 ? 'Great job! Your resume is well-optimized and should perform excellently with most ATS systems.' :
             score >= 70 ? 'Good foundation! Your resume has solid ATS compatibility with some room for improvement.' :
             score >= 60 ? 'Decent start! Consider adding more keywords and improving formatting for better ATS performance.' :
             score >= 40 ? 'Needs attention! Your resume requires significant optimization to pass through ATS systems effectively.' :
             'Critical improvements needed! Your resume may struggle with ATS systems and needs immediate optimization.'}
          </div>
          
          {/* Action recommendations */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs font-medium text-blue-900 mb-1">
              {score >= 80 ? '🎉 Keep it up!' : score >= 60 ? '💡 Quick wins available' : '🚀 Let\'s improve this'}
            </div>
            <div className="text-xs text-blue-800">
              {score >= 80 ? 'Your resume is performing excellently!' :
               score >= 60 ? 'Focus on adding more relevant keywords and quantifiable achievements.' :
               'Start with contact information, skills section, and job descriptions.'}
            </div>
          </div>
        </div>
      )}

      {/* Mini progress indicators for medium/large sizes */}
      {(size === 'medium' || size === 'large') && (
        <div className="mt-4 flex justify-center space-x-1">
          {[20, 40, 60, 80, 100].map((threshold, index) => (
            <div
              key={threshold}
              className={`w-2 h-1 rounded-full transition-all duration-500 ${
                score >= threshold 
                  ? threshold <= 60 ? 'bg-red-400' : threshold <= 80 ? 'bg-yellow-400' : 'bg-green-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSScoreMeter;
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