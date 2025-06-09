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
    try {
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 40;
      const usableWidth = pageWidth - (2 * margin);
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, fontSize: number = 12, fontStyle: string = 'normal', maxWidth?: number) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        
        if (maxWidth) {
          const lines = pdf.splitTextToSize(text, maxWidth);
          pdf.text(lines, x, y);
          return y + (lines.length * fontSize * 1.2);
        } else {
          pdf.text(text, x, y);
          return y + (fontSize * 1.2);
        }
      };

      // Helper function to check if we need a new page
      const checkNewPage = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Header - Personal Info
      if (data.personalInfo) {
        const { fullName, email, phone, location, linkedIn, portfolio, summary } = data.personalInfo;
        
        if (fullName) {
          yPosition = addText(fullName, margin, yPosition + 20, 24, 'bold');
          yPosition += 10;
        }

        // Contact info in a line
        const contactInfo = [];
        if (email) contactInfo.push(email);
        if (phone) contactInfo.push(phone);
        if (location) contactInfo.push(location);
        
        if (contactInfo.length > 0) {
          yPosition = addText(contactInfo.join(' | '), margin, yPosition, 10);
          yPosition += 5;
        }

        // Links
        const links = [];
        if (linkedIn) links.push(linkedIn);
        if (portfolio) links.push(portfolio);
        
        if (links.length > 0) {
          yPosition = addText(links.join(' | '), margin, yPosition, 10);
          yPosition += 15;
        }

        // Summary
        if (summary) {
          checkNewPage(60);
          yPosition = addText('SUMMARY', margin, yPosition, 14, 'bold');
          yPosition += 10;
          yPosition = addText(summary, margin, yPosition, 11, 'normal', usableWidth);
          yPosition += 20;
        }
      }

      // Experience
      if (data.experience && data.experience.length > 0) {
        checkNewPage(80);
        yPosition = addText('EXPERIENCE', margin, yPosition, 14, 'bold');
        yPosition += 15;

        data.experience.forEach((exp: any, index: number) => {
          checkNewPage(100);
          
          // Job title and dates
          if (exp.jobTitle) {
            yPosition = addText(exp.jobTitle, margin, yPosition, 12, 'bold');
          }
          
          const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
          if (dateRange.trim() !== ' - ') {
            pdf.text(dateRange, pageWidth - margin - 100, yPosition - 12);
          }
          
          // Company
          if (exp.company) {
            yPosition = addText(exp.company, margin, yPosition, 11, 'italic');
            yPosition += 5;
          }
          
          // Description
          if (exp.description) {
            yPosition = addText(exp.description, margin, yPosition, 10, 'normal', usableWidth);
          }
          
          yPosition += 15;
        });
      }

      // Projects
      if (data.projects && data.projects.length > 0) {
        checkNewPage(80);
        yPosition = addText('PROJECTS', margin, yPosition, 14, 'bold');
        yPosition += 15;

        data.projects.forEach((project: any) => {
          checkNewPage(80);
          
          if (project.name) {
            yPosition = addText(project.name, margin, yPosition, 12, 'bold');
          }
          
          if (project.description) {
            yPosition = addText(project.description, margin, yPosition, 10, 'normal', usableWidth);
          }
          
          if (project.technologies) {
            yPosition += 5;
            yPosition = addText(`Technologies: ${project.technologies}`, margin, yPosition, 9, 'italic', usableWidth);
          }
          
          yPosition += 15;
        });
      }

      // Education
      if (data.education && data.education.length > 0) {
        checkNewPage(80);
        yPosition = addText('EDUCATION', margin, yPosition, 14, 'bold');
        yPosition += 15;

        data.education.forEach((edu: any) => {
          checkNewPage(60);
          
          if (edu.degree) {
            yPosition = addText(edu.degree, margin, yPosition, 12, 'bold');
          }
          
          if (edu.graduationDate) {
            pdf.text(edu.current ? 'Currently Pursuing' : edu.graduationDate, pageWidth - margin - 100, yPosition - 12);
          }
          
          if (edu.school) {
            yPosition = addText(edu.school, margin, yPosition, 11, 'normal');
          }
          
          yPosition += 15;
        });
      }

      // Skills
      if (data.skills && data.skills.length > 0) {
        const skillsText = data.skills.filter((skill: string) => skill.trim()).join(', ');
        if (skillsText) {
          checkNewPage(60);
          yPosition = addText('SKILLS', margin, yPosition, 14, 'bold');
          yPosition += 10;
          yPosition = addText(skillsText, margin, yPosition, 10, 'normal', usableWidth);
        }
      }

      // Download the PDF
      const fileName = `${data.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);
      
      console.log('PDF generated successfully with proper formatting');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
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
            <span>{isEditMode ? 'Exit Edit Mode' : 'Edit Resume'}</span>
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
            Click on any text in the resume to edit it. Press Enter to save or Escape to cancel. Changes are saved automatically when you click outside the field.
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
