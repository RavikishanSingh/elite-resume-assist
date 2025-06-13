import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Brain, Eye, Palette, Edit, Save } from "lucide-react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import AIAnalysis from "./AIAnalysis";
import { generatePDF } from "../utils/pdfGenerator";

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
    setIsGeneratingPDF(true);
    try {
      const pdf = await generatePDF(data, selectedTemplate);
      const fileName = `${data.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);
      console.log('PDF generated successfully with template:', selectedTemplate);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
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
        <h3 className="text-2xl font-bold text-gray-900">Resume Preview</h3>
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
            variant={isEditMode ? "default" : "outline"}
            onClick={() => {
              setIsEditMode(!isEditMode);
              console.log('Edit mode toggled:', !isEditMode);
            }}
            className="flex items-center space-x-2"
          >
            {isEditMode ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            <span>{isEditMode ? 'Exit Edit Mode' : 'Edit Resume'}</span>
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={isGeneratingPDF}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
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
          <h4 className="text-lg font-semibold text-gray-900">Choose Your Template</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key)}
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

        {/* Template Preview */}
        <Card className="border-2 border-gray-200">
          <CardContent className="p-0">
            <div 
              id="resume-preview" 
              className={`bg-white overflow-hidden ${!isEditMode ? 'transform scale-75 origin-top' : ''} transition-transform`}
              style={{ minHeight: isEditMode ? 'auto' : '297mm' }}
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

      {/* LinkedIn Import Feature */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">🔗 LinkedIn Integration</h4>
        <p className="text-sm text-blue-800 mb-4">
          Import your professional information directly from LinkedIn to quickly populate your resume.
        </p>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-100"
          onClick={() => alert('LinkedIn integration coming soon! This will allow you to import your profile data directly.')}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>Import from LinkedIn</span>
        </Button>
      </div>

      {/* Enhanced Features */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-medium text-purple-900 mb-3">✨ Enhanced Features</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-purple-800">Template Customization</h5>
            <p className="text-sm text-purple-700">Choose from 6 professional templates optimized for different industries</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-purple-800">Real-time Editing</h5>
            <p className="text-sm text-purple-700">Edit your resume directly in the preview with instant updates</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-purple-800">AI-Powered Analysis</h5>
            <p className="text-sm text-purple-700">Get intelligent feedback on content, keywords, and formatting</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-purple-800">High-Quality PDF Export</h5>
            <p className="text-sm text-purple-700">Generate pixel-perfect PDFs that preserve your chosen template styling</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">🎉 Your Resume is Ready!</h4>
        <p className="text-sm text-green-800">
          Your professional resume has been generated with {Object.keys(templates).length} template options. You can download it as a PDF or get AI-powered feedback to make it even better.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Resume Tips for Success</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep your resume to 1-2 pages maximum</li>
          <li>• Use action verbs and quantify your achievements</li>
          <li>• Tailor your resume for each job application</li>
          <li>• Proofread carefully for spelling and grammar errors</li>
          <li>• Save your resume as a PDF to preserve formatting</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumePreview;
