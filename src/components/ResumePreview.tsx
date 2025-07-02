import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Brain, Eye, Palette, Edit, Save, RefreshCw, Layout } from "lucide-react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import AIAnalysis from "./AIAnalysis";
import PageLayoutView from "./layout/PageLayoutView";
import { generatePixelPerfectPDF, addPrintStyles } from "../utils/html2pdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface ResumePreviewProps {
  data: any;
  onUpdate: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const ResumePreview = ({
  data,
  onUpdate
}: ResumePreviewProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPageLayout, setShowPageLayout] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(['summary', 'experience', 'skills', 'projects', 'education']);
  const { toast } = useToast();

  const handleUpdateData = (section: string, field: string, value: string, index?: number) => {
    console.log('Updating data:', { section, field, value, index });
    if (index !== undefined) {
      // Handle array-based sections (experience, education, projects)
      const updatedSection = [...(data[section] || [])];
      if (updatedSection[index]) {
        updatedSection[index] = { ...updatedSection[index], [field]: value };
      }
      onUpdate(section, updatedSection);
    } else if (section === 'personalInfo') {
      // Handle personalInfo object
      onUpdate(section, { ...data.personalInfo, [field]: value });
    } else if (section === 'skills') {
      // Handle skills array
      if (typeof value === 'string' && value.includes(',')) {
        // If comma-separated string, split it
        const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
        onUpdate(section, skillsArray);
      } else {
        // Single skill update
        const updatedSkills = [...(data.skills || [])];
        updatedSkills[index || 0] = value;
        onUpdate(section, updatedSkills);
      }
    }
  };

  const handleDownload = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    
    try {
      // Validate data
      if (!data || !data.personalInfo?.fullName) {
        throw new Error('Please fill in at least your name before downloading');
      }

      // Add print styles for better PDF generation
      addPrintStyles();

      // Show progress to user
      toast({
        title: "Generating Pixel-Perfect PDF...",
        description: "Creating your resume with exact visual fidelity",
        duration: 3000
      });

      // Wait for UI to settle and styles to apply
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate PDF using html2pdf for pixel-perfect results
      await generatePixelPerfectPDF(data);
      
      toast({
        title: "Success! 🎉",
        description: "Pixel-perfect resume PDF downloaded successfully",
        duration: 4000
      });
    } catch (error) {
      console.error('PDF download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.';
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleRefreshPreview = () => {
    // Force a re-render of the preview
    setSelectedTemplate(selectedTemplate);
    toast({
      title: "Preview Refreshed",
      description: "The resume preview has been updated with your latest changes.",
      variant: "default"
    });
  };

  const handleSectionReorder = (newSectionOrder: string[]) => {
    setSectionOrder(newSectionOrder);
  };

  const templates = {
    modern: {
      component: ModernTemplate,
      name: 'Modern',
      description: 'Clean and professional'
    },
    classic: {
      component: ClassicTemplate,
      name: 'Classic',
      description: 'Traditional format'
    },
    creative: {
      component: CreativeTemplate,
      name: 'Creative',
      description: 'Colorful and unique'
    },
    minimal: {
      component: MinimalTemplate,
      name: 'Minimal',
      description: 'Simple and elegant'
    },
    executive: {
      component: ExecutiveTemplate,
      name: 'Executive',
      description: 'Leadership focused'
    },
    tech: {
      component: TechTemplate,
      name: 'Tech',
      description: 'Perfect for developers'
    }
  };

  const SelectedTemplate = templates[selectedTemplate as keyof typeof templates].component;

  if (showAnalysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">AI Resume Analysis</h3>
          <Button
            variant="outline"
            onClick={() => setShowAnalysis(false)}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Back to Preview</span>
          </Button>
        </div>
        <AIAnalysis resumeData={data} />
      </div>
    );
  }

  if (showPageLayout) {
    return (
      <PageLayoutView
        data={data}
        selectedTemplate={selectedTemplate}
        onSectionReorder={handleSectionReorder}
        onDownload={handleDownload}
        onBackToPreview={() => setShowPageLayout(false)}
        TemplateComponent={SelectedTemplate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-3xl font-bold text-gray-900">Professional Resume Preview</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAnalysis(true)}
                className="flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>AI Analysis</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPageLayout(true)}
                className="flex items-center space-x-2"
              >
                <Layout className="w-4 h-4" />
                <span>Page Layout</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleRefreshPreview}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  console.log('Edit mode toggled:', !isEditMode);
                }}
                className="flex items-center space-x-2"
              >
                {isEditMode ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditMode ? 'Save & Exit' : 'Edit Resume'}</span>
              </Button>
              <Button
                onClick={handleDownload}
                disabled={isGeneratingPDF}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Mode Notice */}
        {isEditMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">✏️ Edit Mode Active</h4>
            <p className="text-sm text-blue-800">
              Click on any text in the resume to edit it. Press Enter to save, or Escape to cancel. 
              For multi-line text, use Ctrl+Enter to save.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Template Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Palette className="w-5 h-5 text-purple-600" />
                <h4 className="text-lg font-semibold text-gray-900">Templates</h4>
              </div>
              
              <div className="space-y-3">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTemplate(key);
                      toast({
                        title: "Template Changed",
                        description: `Switched to ${template.name} template`
                      });
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTemplate === key 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <h5 className="font-semibold text-gray-900 mb-1">{template.name}</h5>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </button>
                ))}
              </div>

              {/* PDF Generation Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">✨ Pixel-Perfect PDF</h5>
                <p className="text-sm text-green-700">
                  Advanced HTML-to-PDF rendering with intelligent page breaks ensures your resume matches the preview exactly with no content cutting.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Resume Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Page Format Container - Matches A4 dimensions */}
              <div className="flex justify-center bg-gray-100 p-8">
                <div 
                  id="resume-preview" 
                  className="bg-white shadow-xl border border-gray-300 mx-auto overflow-hidden"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '20mm',
                    paddingBottom: '25mm', // Extra bottom margin
                    fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                    fontSize: '11pt',
                    lineHeight: '1.4',
                    color: '#2d3748',
                    transform: 'scale(0.75)',
                    transformOrigin: 'top center',
                    marginBottom: '-25%'
                  }}
                >
                  <div className="no-break">
                    <SelectedTemplate 
                      data={data} 
                      onUpdate={handleUpdateData} 
                      isEditing={isEditMode}
                      isPDFMode={true}
                      sectionOrder={sectionOrder}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-3">📋 Pixel-Perfect PDF Generation</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-blue-800 mb-2">✨ Advanced HTML-to-PDF Rendering</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Exact visual match with preview</li>
                <li>• Intelligent page break prevention</li>
                <li>• No section splitting between pages</li>
                <li>• Perfect color and font reproduction</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-800 mb-2">🎯 Professional Quality</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• High-resolution 2x scaling</li>
                <li>• Proper A4 margins (20mm/15mm)</li>
                <li>• Background graphics preserved</li>
                <li>• Print-ready professional output</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
