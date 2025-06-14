
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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
      console.log('Loading LinkedIn imported data into resume builder:', initialData);
      
      setResumeData(prev => ({
        personalInfo: initialData.personalInfo || prev.personalInfo,
        experience: initialData.experience || prev.experience,
        education: initialData.education || prev.education,
        projects: initialData.projects || prev.projects,
        skills: initialData.skills || prev.skills,
        summary: initialData.personalInfo?.summary || prev.summary
      }));
      
      console.log('Resume data updated with imported data');
    }
  }, [initialData]);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [resumeData]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    if (savedData && !initialData) {
      try {
        const parsed = JSON.parse(savedData);
        setResumeData(parsed);
        toast({
          title: "Previous work restored",
          description: "Your progress has been automatically restored.",
        });
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, [initialData, toast]);

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
      toast({
        title: "Progress saved!",
        description: `Moving to ${steps[currentStep + 1].title}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    toast({
      title: "Jumped to step",
      description: `Now on ${steps[stepIndex].title}`,
    });
  };

  const updateResumeData = (section: string, data: any) => {
    console.log('Updating resume data:', { section, data });
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSaveProgress = () => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    toast({
      title: "Progress saved!",
      description: "Your resume data has been saved locally.",
    });
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
            <Button variant="outline" onClick={handleSaveProgress} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Progress</span>
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Step Indicators - Now clickable */}
          <div className="flex justify-center mt-4 space-x-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-blue-600 text-white shadow-md'
                    : index < currentStep
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                }`}
              >
                {step.title}
              </button>
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
              {/* Enhanced tips with emojis */}
              {currentStep === 0 && (
                <p className="text-gray-600 mt-2">
                  📝 Start with your basic information. This will appear at the top of your resume.
                </p>
              )}
              {currentStep === 1 && (
                <p className="text-gray-600 mt-2">
                  💼 Add your work experience. Include internships, part-time jobs, and volunteer work.
                </p>
              )}
              {currentStep === 2 && (
                <p className="text-gray-600 mt-2">
                  🎓 Include your education background. Don't forget relevant coursework and achievements.
                </p>
              )}
              {currentStep === 3 && (
                <p className="text-gray-600 mt-2">
                  🚀 Showcase your projects! This is especially important for new graduates and career changers.
                </p>
              )}
              {currentStep === 4 && (
                <p className="text-gray-600 mt-2">
                  ⚡ List your technical and soft skills. Be specific and honest about your abilities.
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

          {/* Enhanced Navigation */}
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <Button 
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
