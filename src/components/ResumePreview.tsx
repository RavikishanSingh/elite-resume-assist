import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, Eye, FileText, TrendingUp, Edit, ChevronLeft, ChevronRight, Settings, Palette, Layout } from 'lucide-react';
import { generatePDF } from '../utils/html2pdfGenerator';
import { sampleResumeData } from '../data/sample-resume';
import ATSScoreTab from './ats/ATSScoreTab';

// Import all templates
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechTemplate from './templates/TechTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import HealthcareTemplate from './templates/HealthcareTemplate';
import LegalTemplate from './templates/LegalTemplate';
import SalesTemplate from './templates/SalesTemplate';
import MarketingTemplate from './templates/MarketingTemplate';
import FinanceTemplate from './templates/FinanceTemplate';
import ConsultingTemplate from './templates/ConsultingTemplate';
import EducationTemplate from './templates/EducationTemplate';
import NonProfitTemplate from './templates/NonProfitTemplate';
import StartupTemplate from './templates/StartupTemplate';
import RetailTemplate from './templates/RetailTemplate';
import HospitalityTemplate from './templates/HospitalityTemplate';
import ManufacturingTemplate from './templates/ManufacturingTemplate';
import MediaTemplate from './templates/MediaTemplate';
import GovernmentTemplate from './templates/GovernmentTemplate';
import EngineeringTemplate from './templates/EngineeringTemplate';
import ArchitectureTemplate from './templates/ArchitectureTemplate';
import FreelancerTemplate from './templates/FreelancerTemplate';
import InternTemplate from './templates/InternTemplate';
import RemoteTemplate from './templates/RemoteTemplate';
import InternationalTemplate from './templates/InternationalTemplate';
import ScienceTemplate from './templates/ScienceTemplate';
import ArtisticTemplate from './templates/ArtisticTemplate';
import SportsTemplate from './templates/SportsTemplate';
import VeteranTemplate from './templates/VeteranTemplate';
import EntryLevelTemplate from './templates/EntryLevelTemplate';
import CareerChangeTemplate from './templates/CareerChangeTemplate';
import ExecutiveCTemplate from './templates/ExecutiveCTemplate';
import DataScienceTemplate from './templates/DataScienceTemplate';
import CybersecurityTemplate from './templates/CybersecurityTemplate';

const templates = [
  { id: 'modern', name: 'Modern', component: ModernTemplate, description: 'Clean and contemporary design' },
  { id: 'professional', name: 'Professional', component: ProfessionalTemplate, description: 'Two-column layout with sidebar' },
  { id: 'classic', name: 'Classic', component: ClassicTemplate, description: 'Traditional and timeless format' },
  { id: 'creative', name: 'Creative', component: CreativeTemplate, description: 'Bold and artistic layout' },
  { id: 'minimal', name: 'Minimal', component: MinimalTemplate, description: 'Simple and elegant design' },
  { id: 'executive', name: 'Executive', component: ExecutiveTemplate, description: 'Premium executive format' },
  { id: 'tech', name: 'Tech', component: TechTemplate, description: 'Developer-focused dark theme' },
  { id: 'academic', name: 'Academic', component: AcademicTemplate, description: 'Research and academia focused' },
  { id: 'healthcare', name: 'Healthcare', component: HealthcareTemplate, description: 'Medical and healthcare professionals' },
  { id: 'legal', name: 'Legal', component: LegalTemplate, description: 'Law and legal professionals' },
  { id: 'sales', name: 'Sales', component: SalesTemplate, description: 'Sales and business development' },
  { id: 'marketing', name: 'Marketing', component: MarketingTemplate, description: 'Marketing and brand professionals' },
  { id: 'finance', name: 'Finance', component: FinanceTemplate, description: 'Financial and banking sector' },
  { id: 'consulting', name: 'Consulting', component: ConsultingTemplate, description: 'Management consulting' },
  { id: 'education', name: 'Education', component: EducationTemplate, description: 'Teachers and educators' },
  { id: 'nonprofit', name: 'Non-Profit', component: NonProfitTemplate, description: 'Social impact organizations' },
  { id: 'startup', name: 'Startup', component: StartupTemplate, description: 'Entrepreneurial and startup roles' },
  { id: 'retail', name: 'Retail', component: RetailTemplate, description: 'Retail and customer service' },
  { id: 'hospitality', name: 'Hospitality', component: HospitalityTemplate, description: 'Hotels and restaurants' },
  { id: 'manufacturing', name: 'Manufacturing', component: ManufacturingTemplate, description: 'Industrial and production' },
  { id: 'media', name: 'Media', component: MediaTemplate, description: 'Creative media and entertainment' },
  { id: 'government', name: 'Government', component: GovernmentTemplate, description: 'Public sector and civil service' },
  { id: 'engineering', name: 'Engineering', component: EngineeringTemplate, description: 'Engineering professionals' },
  { id: 'architecture', name: 'Architecture', component: ArchitectureTemplate, description: 'Architects and designers' },
  { id: 'freelancer', name: 'Freelancer', component: FreelancerTemplate, description: 'Independent contractors' },
  { id: 'intern', name: 'Intern', component: InternTemplate, description: 'Students and interns' },
  { id: 'remote', name: 'Remote', component: RemoteTemplate, description: 'Remote work specialists' },
  { id: 'international', name: 'International', component: InternationalTemplate, description: 'Global professionals' },
  { id: 'science', name: 'Science', component: ScienceTemplate, description: 'Research scientists' },
  { id: 'artistic', name: 'Artistic', component: ArtisticTemplate, description: 'Artists and creatives' },
  { id: 'sports', name: 'Sports', component: SportsTemplate, description: 'Athletic professionals' },
  { id: 'veteran', name: 'Veteran', component: VeteranTemplate, description: 'Military veterans' },
  { id: 'entrylevel', name: 'Entry Level', component: EntryLevelTemplate, description: 'Recent graduates' },
  { id: 'careerchange', name: 'Career Change', component: CareerChangeTemplate, description: 'Career transition' },
  { id: 'executivec', name: 'C-Suite', component: ExecutiveCTemplate, description: 'C-level executives' },
  { id: 'datascience', name: 'Data Science', component: DataScienceTemplate, description: 'Data scientists and analysts' },
  { id: 'cybersecurity', name: 'Cybersecurity', component: CybersecurityTemplate, description: 'Security professionals' },
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
        isEditing={isEditMode}
        onUpdate={onUpdate}
        activeSection={activeSection}
      />
    );
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const index = templates.findIndex(t => t.id === templateId);
    setCurrentTemplateIndex(index);
  };

  const handlePreviousTemplate = () => {
    const newIndex = currentTemplateIndex > 0 ? currentTemplateIndex - 1 : templates.length - 1;
    setCurrentTemplateIndex(newIndex);
    setSelectedTemplate(templates[newIndex].id);
  };

  const handleNextTemplate = () => {
    const newIndex = currentTemplateIndex < templates.length - 1 ? currentTemplateIndex + 1 : 0;
    setCurrentTemplateIndex(newIndex);
    setSelectedTemplate(templates[newIndex].id);
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Controls */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Resume Preview</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Template:</span>
                <span className="font-medium text-gray-900">{templates[currentTemplateIndex].name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveSection(null)}
                className={!activeSection ? 'bg-blue-100 border-blue-300' : ''}
              >
                <Layout className="w-4 h-4 mr-2" />
                Full View
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditMode(!isEditMode)}
                className={isEditMode ? 'bg-blue-100 border-blue-300' : ''}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditMode ? 'Exit Edit' : 'Edit Mode'}
              </Button>
              <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Slider */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousTemplate}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex-1 mx-6">
              <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2">
                {templates.slice(Math.max(0, currentTemplateIndex - 2), currentTemplateIndex + 3).map((template, index) => {
                  const actualIndex = Math.max(0, currentTemplateIndex - 2) + index;
                  const isSelected = template.id === selectedTemplate;
                  
                  return (
                    <div
                      key={template.id}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                        isSelected ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <Card className={`w-24 h-32 ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                        <CardContent className="p-2 h-full flex flex-col">
                          <div className="flex-1 bg-gray-100 rounded mb-2 overflow-hidden relative">
                            <div className="scale-[0.06] origin-top-left w-[1667%] h-[1667%] pointer-events-none">
                              <template.component 
                                data={resumeData}
                                isPDFMode={true}
                                isEditing={false}
                              />
                            </div>
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-xs mb-1">{template.name}</h3>
                            <p className="text-[8px] text-muted-foreground leading-tight">{template.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
              
              {/* Template counter */}
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">
                  {currentTemplateIndex + 1} of {templates.length} templates
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextTemplate}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-600 mr-4">Quick Edit:</span>
            {[
              { id: 'personalInfo', name: 'Personal Info', icon: '👤' },
              { id: 'experience', name: 'Experience', icon: '💼' },
              { id: 'education', name: 'Education', icon: '🎓' },
              { id: 'skills', name: 'Skills', icon: '🛠️' },
              { id: 'projects', name: 'Projects', icon: '📁' }
            ].map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                onClick={() => handleSectionClick(section.id)}
                className={`flex items-center gap-2 ${
                  activeSection === section.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-xs">{section.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="preview">Resume Preview</TabsTrigger>
            <TabsTrigger value="ats-score" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              ATS Score
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            {/* Edit Mode Notice */}
            {isEditMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <strong>Edit Mode Active:</strong> Click on any text in the resume to edit it directly. Changes are saved automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Data Status Alert */}
            {!data && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <strong>Preview Mode:</strong> This is showing sample data. Complete the previous steps to see your actual information here.
                  </p>
                </div>
              </div>
            )}

            {/* Resume Preview Area */}
            <div className="flex justify-center">
              <Card className="w-full max-w-4xl shadow-2xl">
                <CardContent className="p-0">
                  <div className="bg-white min-h-[297mm] print:shadow-none" id="resume-content">
                    {getCurrentTemplate()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ats-score" className="space-y-6">
            <ATSScoreTab data={resumeData} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              {/* Template Customization */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Template Customization
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {templates.slice(0, 8).map((template) => (
                      <div
                        key={template.id}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                          selectedTemplate === template.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateChange(template.id)}
                      >
                        <div className="text-center">
                          <div className="w-full h-16 bg-gray-100 rounded mb-2 overflow-hidden">
                            <div className="scale-[0.03] origin-top-left w-[3333%] h-[3333%]">
                              <template.component 
                                data={resumeData}
                                isPDFMode={true}
                                isEditing={false}
                              />
                            </div>
                          </div>
                          <h4 className="font-medium text-xs">{template.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download as PDF
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Export as Word
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Tips */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Resume Tips</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Keep your resume to 1-2 pages maximum</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Use action verbs to start bullet points</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Include quantifiable achievements with numbers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Tailor your resume for each job application</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Navigation for builder context */}
      {(onNext || onPrevious) && (
        <div className="container mx-auto px-4 py-6 border-t bg-white">
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