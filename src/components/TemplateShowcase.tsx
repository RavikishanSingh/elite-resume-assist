
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";

import { sampleResumeData } from "@/data/sample-resume";
import ModernTemplate from "@/components/templates/ModernTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import TechTemplate from "@/components/templates/TechTemplate";

const TemplatePreview = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="transform scale-[0.24] origin-center">
      <div className="w-[816px] h-[1056px] bg-white shadow-md">
        {children}
      </div>
    </div>
  </div>
);

const templates = [
  {
    name: 'Modern',
    description: 'Clean and professional.',
    preview: (
      <TemplatePreview>
        <ModernTemplate data={sampleResumeData} isEditing={false} />
      </TemplatePreview>
    ),
  },
  {
    name: 'Classic',
    description: 'A timeless, traditional format.',
    preview: (
      <TemplatePreview>
        <ClassicTemplate data={sampleResumeData} isEditing={false} />
      </TemplatePreview>
    ),
  },
  {
    name: 'Creative',
    description: 'For roles where personality shines.',
    preview: (
      <TemplatePreview>
        <CreativeTemplate data={sampleResumeData} isEditing={false} />
      </TemplatePreview>
    ),
  },
  {
    name: 'Minimal',
    description: 'Simple, clean, and elegant.',
    preview: (
      <TemplatePreview>
        <MinimalTemplate data={sampleResumeData} isEditing={false} />
      </TemplatePreview>
    ),
  },
  {
    name: 'Executive',
    description: 'Confident and leadership-focused.',
    preview: (
      <TemplatePreview>
        <ExecutiveTemplate data={sampleResumeData} isEditing={false} />
      </TemplatePreview>
    ),
  },
  {
    name: 'Tech',
    description: 'Perfect for developers and engineers.',
    preview: (
      <TemplatePreview>
        <TechTemplate data={sampleResumeData} isEditing={false} />
      </TemplatePreview>
    ),
  },
];

const TemplateShowcase = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 px-4 py-2 rounded-full mb-6">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">Professionally Designed Templates</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Find a Style That Fits You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from a variety of templates designed to impress recruiters and pass through ATS scans. 
            Each one is fully customizable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.name} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2">
              <div className="h-64 bg-gray-200 border-b border-gray-300 overflow-hidden relative">
                {template.preview}
              </div>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
