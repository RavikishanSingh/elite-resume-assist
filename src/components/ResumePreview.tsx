import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Brain, Eye, Palette, Edit, Save, RefreshCw } from "lucide-react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import AIAnalysis from "./AIAnalysis";
import { generatePDFFromHTML } from "../utils/htmlToPdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface ResumePreviewProps {
  data: any;
  onUpdate: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const ResumePreview = ({ data, onUpdate }: ResumePreviewProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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
    console.log('=== Starting Professional Multi-Page PDF Download ===');
    console.log('Selected template:', selectedTemplate);
    
    try {
      // Validate data
      if (!data || !data.personalInfo?.fullName) {
        throw new Error('Please fill in at least your name before downloading');
      }

      console.log('Generating professional multi-page PDF...');
      
      // Show progress to user
      toast({
        title: "Preparing PDF...",
        description: "Optimizing layout for professional multi-page output",
        duration: 2000
      });

      // Wait for UI to settle and ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the enhanced HTML-to-PDF generator
      const pdf = await generatePDFFromHTML(data, selectedTemplate);
      
      if (!pdf) {
        throw new Error('PDF generation returned null');
      }

      // Generate professional filename
      const name = data.personalInfo?.fullName || 'Resume';
      const sanitizedName = name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      const templateSuffix = selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1);
      const date = new Date().toISOString().split('T')[0];
      const filename = `${sanitizedName}_Professional_Resume_${templateSuffix}_${date}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
      
      console.log(`Professional PDF saved as: ${filename}`);
      
      toast({
        title: "Success! 🎉",
        description: `Professional multi-page resume downloaded as ${filename}`,
        duration: 4000
      });
      
    } catch (error) {
      console.error('PDF download error:', error);
      
      let errorMessage = 'Failed to generate professional PDF. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsGeneratingPDF(false);
      console.log('=== Professional PDF Download Complete ===');
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

  const templates = {
    modern: { component: ModernTemplate, name: 'Modern', description: 'Clean and professional' },
    classic: { component: ClassicTemplate, name: 'Classic', description: 'Traditional format' },
    creative: { component: CreativeTemplate, name: 'Creative', description: 'Colorful and unique' },
    minimal: { component: MinimalTemplate, name: 'Minimal', description: 'Simple and elegant' },
    executive: { component: ExecutiveTemplate, name: 'Executive', description: 'Leadership focused' },
    tech: { component: TechTemplate, name: 'Tech', description: 'Perfect for developers' }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Professional Resume Preview</h3>
        <div className="flex space-x-3">
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
            <span>{isGeneratingPDF ? 'Creating Professional PDF...' : 'Download Professional PDF'}</span>
          </Button>
        </div>
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">✏️ Edit Mode Active</h4>
          <p className="text-sm text-blue-800">
            Click on any text in the resume to edit it. Press Enter to save, or Escape to cancel. 
            For multi-line text, use Ctrl+Enter to save.
          </p>
        </div>
      )}

      {/* Template Selection */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-purple-600" />
          <h4 className="text-lg font-semibold text-gray-900">Choose Your Professional Template</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedTemplate(key);
                toast({
                  title: "Template Changed",
                  description: `Switched to ${template.name} template - PDF will capture this design perfectly`,
                });
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
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

        {/* Enhanced Template Preview */}
        <Card className="border-2 border-gray-200">
          <CardContent className="p-0">
            <div 
              id="resume-preview" 
              className="bg-white mx-auto shadow-lg"
              style={{ 
                width: '210mm',
                minHeight: '297mm',
                maxWidth: '100%',
                transform: 'scale(0.65)',
                transformOrigin: 'top center',
                backgroundColor: '#ffffff',
                fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.4',
                color: '#2d3748',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '20mm',
                boxSizing: 'border-box'
              }}
            >
              <SelectedTemplate 
                data={data} 
                onUpdate={handleUpdateData} 
                isEditing={isEditMode} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Features */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-medium text-green-900 mb-3">🎯 Professional Multi-Page PDF Generation</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-green-800">Advanced HTML-to-Canvas Technology</h5>
            <p className="text-sm text-green-700">High-resolution capture (3x scale) ensuring crisp text and perfect formatting. Automatic multi-page handling for longer resumes while maintaining professional layout standards.</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-green-800">Professional Standards</h5>
            <p className="text-sm text-green-700">A4 format (210×297mm) with optimal margins, professional typography (Inter font family), and proper page breaks for hiring manager readability.</p>
          </div>
        </div>
      </div>

      {/* Professional Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📋 Professional Resume Excellence</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep content concise and impactful with quantified achievements</li>
          <li>• Use professional language and industry-relevant keywords</li>
          <li>• Maintain consistent formatting and proper spacing throughout</li>
          <li>• Ensure contact information is current and professional</li>
          <li>• Multi-page resumes are acceptable for experienced professionals</li>
          <li>• Always save and send as PDF to preserve formatting</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumePreview;
