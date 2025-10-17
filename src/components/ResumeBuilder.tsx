import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileText, User, Briefcase, GraduationCap, Wrench, Eye } from "lucide-react";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ProjectsForm from "./forms/ProjectsForm";
import ResumePreview from "./ResumePreview";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthProvider';
import { useResumes } from '@/hooks/useResumes';

interface ResumeBuilderProps {
  onBack: () => void;
  initialData?: any;
  resumeId?: string | null;
}

const ResumeBuilder = ({ onBack, initialData, resumeId }: ResumeBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    projects: []
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveResume, updateResume } = useResumes();

  const steps = [
    {
      id: 'personal',
      title: 'Personal Info',
      icon: User,
      component: PersonalInfoForm,
      description: 'Basic contact information'
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: Briefcase,
      component: ExperienceForm,
      description: 'Work history and achievements'
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      component: EducationForm,
      description: 'Educational background'
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Wrench,
      component: SkillsForm,
      description: 'Technical and soft skills'
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: FileText,
      component: ProjectsForm,
      description: 'Portfolio and key projects'
    },
    {
      id: 'preview',
      title: 'Preview',
      icon: Eye,
      component: ResumePreview,
      description: 'Review and download'
    }
  ];

  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      console.log('Loading initial data into ResumeBuilder:', initialData);
      setResumeData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  const updateResumeData = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));

    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
  };

  const handleNext = () => {
    try {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "There was an issue navigating to the next step. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    try {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error", 
        description: "There was an issue navigating to the previous step. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    try {
      setCurrentStep(stepIndex);
    } catch (error) {
      console.error('Step navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "There was an issue navigating to that step. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your resume.",
        variant: "destructive"
      });
      return;
    }

    try {
      const title = resumeData.personalInfo?.fullName
        ? `${resumeData.personalInfo.fullName} Resume`
        : 'My Resume';

      if (resumeId) {
        await updateResume(resumeId, {
          title,
          resume_data: resumeData,
          template_type: 'modern'
        });
      } else {
        await saveResume(resumeData, title, 'modern');
      }

      toast({
        title: "Resume saved!",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <img src="/upscalemedia-transformed.png" alt="Resume Pilot" className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Button variant="outline" onClick={handleSave}>
                  Save Progress
                </Button>
              )}
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = completedSteps.has(index);
              const isAccessible = true; // Allow access to all steps

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{step.title}</span>
                    {isCompleted && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
           <CardHeader className="text-center">
             <CardTitle className="text-2xl flex items-center justify-center space-x-2">
               {(() => {
                 const Icon = steps[currentStep].icon;
                 return <Icon className="w-6 h-6" />;
               })()}
               <span>{steps[currentStep].title}</span>
             </CardTitle>
             <p className="text-gray-600 mt-2">{steps[currentStep].description}</p>
           </CardHeader>
           <CardContent className="p-8">
             <CurrentStepComponent
               data={resumeData}
               onUpdate={updateResumeData}
               onNext={handleNext}
               onPrevious={handlePrevious}
               isLastStep={isLastStep}
               isFirstStep={isFirstStep}
               completedSteps={completedSteps}
             />
           </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;