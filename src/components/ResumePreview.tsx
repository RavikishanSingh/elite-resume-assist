import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Eye, FileText, TrendingUp } from 'lucide-react';
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
import ProfessionalTemplate from './templates/ProfessionalTemplate';
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

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-lg">
            <TabsTrigger value="preview">Resume Preview</TabsTrigger>
            <TabsTrigger value="ats-score" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              ATS Score
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
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
            <div className="flex justify-center">
              <Card className="w-full max-w-4xl shadow-2xl">
                <CardContent className="p-0">
                  <div className="bg-white min-h-[297mm] print:shadow-none" id="resume-content">
                    {getCurrentTemplate()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Template Gallery */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground text-center">Choose Your Template</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-3 max-w-6xl mx-auto">
                {templates.map(template => {
                  const TemplateComponent = template.component;
                  return (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                        selectedTemplate === template.id ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-2">
                        <div className="w-full h-20 bg-white rounded mb-2 overflow-hidden border relative">
                          <div className="scale-[0.08] origin-top-left w-[1250%] h-[1250%] pointer-events-none">
                            <TemplateComponent 
                              data={resumeData}
                              isPDFMode={true}
                              isEditing={false}
                            />
                          </div>
                        </div>
                        <h3 className="font-semibold text-xs mb-1 text-center">{template.name}</h3>
                        <p className="text-[10px] text-muted-foreground text-center leading-tight">{template.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ats-score" className="space-y-6">
            <ATSScoreTab data={resumeData} />
          </TabsContent>
        </Tabs>
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