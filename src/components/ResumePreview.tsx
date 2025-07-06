import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Eye, FileText } from 'lucide-react';
import { generatePDF } from '../utils/html2pdfGenerator';
import { sampleResumeData } from '../data/sample-resume';

// Import all templates
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechTemplate from './templates/TechTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

const templates = [
  { id: 'modern', name: 'Modern', component: ModernTemplate, description: 'Clean and contemporary design' },
  { id: 'professional', name: 'Professional', component: ProfessionalTemplate, description: 'Two-column layout with sidebar' },
  { id: 'classic', name: 'Classic', component: ClassicTemplate, description: 'Traditional and timeless format' },
  { id: 'creative', name: 'Creative', component: CreativeTemplate, description: 'Bold and artistic layout' },
  { id: 'minimal', name: 'Minimal', component: MinimalTemplate, description: 'Simple and elegant design' },
  { id: 'executive', name: 'Executive', component: ExecutiveTemplate, description: 'Premium executive format' },
];

interface ResumePreviewProps {
  data?: any;
  onUpdate?: (section: string, data: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}

const ResumePreview = ({ data, onUpdate, onNext, onPrevious, isLastStep, isFirstStep }: ResumePreviewProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  // Use provided data or fallback to sample data
  const resumeData = data || sampleResumeData;

  const handleDownloadPDF = async () => {
    try {
      await generatePDF();
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const getCurrentTemplate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return null;
    
    const TemplateComponent = template.component;
    return (
      <TemplateComponent 
        data={resumeData}
        isPDFMode={true}
        isEditing={false}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Controls */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Resume Preview</h1>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} Template
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              </Button>
              <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Status Alert */}
      {!data && (
        <div className="container mx-auto px-4 py-2">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  <strong>Preview Mode:</strong> This is showing sample data. Complete the previous steps to see your actual information here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-4xl shadow-2xl">
            <CardContent className="p-0">
              <div className="bg-white min-h-[297mm] print:shadow-none" id="resume-content">
                {getCurrentTemplate()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Gallery */}
      <div className="container mx-auto px-4 py-8 border-t">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Choose Your Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {templates.map(template => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                selectedTemplate === template.id ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4">
                <div className="w-full h-32 bg-gradient-to-br from-muted to-muted/60 rounded mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
                  <span className="text-sm font-medium text-muted-foreground relative z-10">
                    {template.name}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation for builder context */}
      {(onNext || onPrevious) && (
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto flex justify-between">
            {onPrevious && (
              <Button variant="outline" onClick={onPrevious}>
                ← Back to Skills
              </Button>
            )}
            <div className="flex gap-4">
              <Button 
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {onNext && !isLastStep && (
                <Button onClick={onNext}>
                  Next Step →
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;