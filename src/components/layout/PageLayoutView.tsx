
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Eye, Download, Grip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SectionReorder from './SectionReorder';
import PageBreakIndicator from './PageBreakIndicator';

interface PageLayoutViewProps {
  data: any;
  selectedTemplate: string;
  onSectionReorder: (sections: string[]) => void;
  onDownload: () => void;
  onBackToPreview: () => void;
  TemplateComponent: any;
}

const PageLayoutView = ({ 
  data, 
  selectedTemplate, 
  onSectionReorder, 
  onDownload, 
  onBackToPreview,
  TemplateComponent 
}: PageLayoutViewProps) => {
  const { toast } = useToast();
  
  // Default section order
  const defaultSections = [
    { id: 'summary', name: 'Professional Summary', enabled: !!data.personalInfo?.summary },
    { id: 'experience', name: 'Professional Experience', enabled: data.experience?.length > 0 },
    { id: 'skills', name: 'Core Competencies', enabled: data.skills?.length > 0 },
    { id: 'projects', name: 'Key Projects', enabled: data.projects?.length > 0 },
    { id: 'education', name: 'Education', enabled: data.education?.length > 0 }
  ];

  const [sections, setSections] = useState(defaultSections);

  const handleSectionReorder = (newSections: typeof sections) => {
    setSections(newSections);
    onSectionReorder(newSections.map(s => s.id));
    toast({
      title: "Section Order Updated",
      description: "Your resume sections have been reordered. Changes will be reflected in the PDF.",
    });
  };

  const toggleSection = (sectionId: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    );
    setSections(updatedSections);
    onSectionReorder(updatedSections.filter(s => s.enabled).map(s => s.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Page Layout Manager</h3>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onBackToPreview}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Back to Preview</span>
          </Button>
          <Button
            onClick={onDownload}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Reorder Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grip className="w-5 h-5" />
                <span>Section Order</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SectionReorder
                sections={sections}
                onReorder={handleSectionReorder}
                onToggle={toggleSection}
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Drag sections to reorder them. Toggle sections on/off using the switches. Changes are reflected in real-time in the preview.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview with Page Breaks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview with Page Breaks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <PageBreakIndicator />
                <div 
                  id="layout-preview" 
                  className="w-full bg-white shadow-lg border border-gray-200 mx-auto relative"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top left',
                    marginBottom: '-40%'
                  }}
                >
                  <TemplateComponent 
                    data={data} 
                    sectionOrder={sections.filter(s => s.enabled).map(s => s.id)}
                    isPDFMode={true}
                    showPageBreaks={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips and Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Page Layout Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Optimal Section Order:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Professional Summary (top of page 1)</li>
                <li>• Core Competencies (quick overview)</li>
                <li>• Professional Experience (main content)</li>
                <li>• Key Projects (if applicable)</li>
                <li>• Education (usually last)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Page Break Tips:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Keep related content together</li>
                <li>• Avoid orphaned headers</li>
                <li>• Experience entries stay unified</li>
                <li>• Skills section fits on one area</li>
                <li>• Education can span if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageLayoutView;
