import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Brain, Eye, Palette, Edit, Save } from "lucide-react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import TechTemplate from "./templates/TechTemplate";
import AIAnalysis from "./AIAnalysis";

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

  const handleUpdateData = (section: string, field: string, value: string, index?: number) => {
    if (index !== undefined) {
      const updatedSection = [...data[section]];
      updatedSection[index] = { ...updatedSection[index], [field]: value };
      onUpdate(section, updatedSection);
    } else if (section === 'personalInfo') {
      onUpdate(section, { ...data.personalInfo, [field]: value });
    } else if (section === 'skills') {
      const updatedSkills = [...data.skills];
      updatedSkills[index || 0] = value;
      onUpdate(section, updatedSkills);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');

      // Create canvas from the resume element
      const canvas = await html2canvas.default(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-preview');
          if (clonedElement) {
            clonedElement.style.transform = 'scale(1)';
            clonedElement.style.transformOrigin = 'top left';
          }
        }
      });

      // Calculate dimensions for A4 page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `${data.personalInfo?.fullName || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print dialog
      window.print();
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
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center space-x-2"
          >
            {isEditMode ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            <span>{isEditMode ? 'Save Changes' : 'Edit Resume'}</span>
          </Button>
          <Button 
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">✏️ Edit Mode Active</h4>
          <p className="text-sm text-blue-800">
            Click on any text in the resume to edit it. Changes are saved automatically.
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
            <div id="resume-preview" className="bg-white transform scale-75 origin-top">
              <SelectedTemplate data={data} onUpdate={handleUpdateData} isEditing={isEditMode} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">🎉 Your Resume is Ready!</h4>
        <p className="text-sm text-green-800">
          Your professional resume has been generated with {Object.keys(templates).length} template options. You can download it as a PDF or get AI-powered feedback to make it even better.
        </p>
      </div>

      {/* Beginner Tips */}
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
