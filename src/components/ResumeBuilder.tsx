
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import ProjectsForm from "./forms/ProjectsForm";
import SkillsForm from "./forms/SkillsForm";
import ResumePreview from "./ResumePreview";

interface ResumeBuilderProps {
  onBack: () => void;
  initialData?: any;
}

const ResumeBuilder = ({ onBack, initialData }: ResumeBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    projects: [],
    skills: [],
    summary: ''
  });

  // Load initial data if provided (from LinkedIn import)
  useEffect(() => {
    if (initialData) {
      setResumeData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const steps = [
    { title: "Personal Info", component: PersonalInfoForm },
    { title: "Experience", component: ExperienceForm },
    { title: "Education", component: EducationForm },
    { title: "Projects", component: ProjectsForm },
    { title: "Skills", component: SkillsForm },
    { title: "Preview", component: ResumePreview }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateResumeData = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
            <div className="w-24"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  index === currentStep
                    ? 'bg-blue-600 text-white'
                    : index < currentStep
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {steps[currentStep].title}
              </CardTitle>
              {/* Beginner Tips */}
              {currentStep === 0 && (
                <p className="text-gray-600 mt-2">
                  Start with your basic information. This will appear at the top of your resume.
                </p>
              )}
              {currentStep === 1 && (
                <p className="text-gray-600 mt-2">
                  Add your work experience. Include internships, part-time jobs, and volunteer work.
                </p>
              )}
              {currentStep === 2 && (
                <p className="text-gray-600 mt-2">
                  Include your education background. Don't forget relevant coursework and achievements.
                </p>
              )}
              {currentStep === 3 && (
                <p className="text-gray-600 mt-2">
                  Showcase your projects! This is especially important for new graduates and career changers.
                </p>
              )}
              {currentStep === 4 && (
                <p className="text-gray-600 mt-2">
                  List your technical and soft skills. Be specific and honest about your abilities.
                </p>
              )}
            </CardHeader>
            <CardContent className="p-8">
              <CurrentStepComponent 
                data={resumeData}
                onUpdate={updateResumeData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastStep={currentStep === steps.length - 1}
                isFirstStep={currentStep === 0}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              <Button 
                onClick={handleNext}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
