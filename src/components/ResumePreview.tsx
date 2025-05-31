
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Brain, Eye } from "lucide-react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import AIAnalysis from "./AIAnalysis";

interface ResumePreviewProps {
  data: any;
  onUpdate: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const ResumePreview = ({ data }: ResumePreviewProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleDownload = () => {
    // We'll implement PDF generation here
    const element = document.getElementById('resume-preview');
    if (element) {
      window.print();
    }
  };

  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate
  };

  const SelectedTemplate = templates[selectedTemplate as keyof typeof templates];

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
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modern">Modern Template</TabsTrigger>
          <TabsTrigger value="classic">Classic Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modern" className="mt-6">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-0">
              <div id="resume-preview" className="bg-white">
                <ModernTemplate data={data} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classic" className="mt-6">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-0">
              <div id="resume-preview" className="bg-white">
                <ClassicTemplate data={data} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">🎉 Your Resume is Ready!</h4>
        <p className="text-sm text-green-800">
          Your professional resume has been generated. You can download it as a PDF or get AI-powered feedback to make it even better.
        </p>
      </div>
    </div>
  );
};

export default ResumePreview;
