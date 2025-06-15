
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";

const templates = [
  {
    name: 'Modern',
    description: 'Clean and professional.',
    preview: (
      <div className="w-full h-full bg-white p-2 space-y-2">
        <div className="h-6 bg-slate-200 rounded-sm w-3/4"></div>
        <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
        <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
        <div className="h-3 bg-slate-100 rounded-sm w-2/3"></div>
        <div className="flex space-x-2 pt-2">
          <div className="w-1/3 space-y-2">
            <div className="h-4 bg-slate-200 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
          </div>
          <div className="w-2/3 space-y-2">
            <div className="h-4 bg-slate-200 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: 'Classic',
    description: 'A timeless, traditional format.',
    preview: (
        <div className="w-full h-full bg-white p-2 space-y-2 border-t-4 border-slate-700">
            <div className="text-center space-y-1">
                <div className="h-5 bg-slate-300 rounded-sm w-1/2 mx-auto"></div>
                <div className="h-2 bg-slate-200 rounded-sm w-3/4 mx-auto"></div>
            </div>
            <div className="h-0.5 bg-slate-300 w-full"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-1/4"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-1/4 mt-2"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
        </div>
    ),
  },
  {
    name: 'Creative',
    description: 'For roles where personality shines.',
    preview: (
        <div className="w-full h-full bg-white flex">
            <div className="w-1/3 bg-purple-100 p-2 space-y-2">
                <div className="h-10 w-10 bg-purple-300 rounded-full mx-auto"></div>
                <div className="h-3 bg-purple-200 rounded-sm w-full"></div>
                <div className="h-2 bg-purple-200 rounded-sm w-2/3"></div>
            </div>
            <div className="w-2/3 p-2 space-y-2">
                <div className="h-5 bg-slate-200 rounded-sm w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
            </div>
        </div>
    ),
  },
  {
    name: 'Minimal',
    description: 'Simple, clean, and elegant.',
    preview: (
        <div className="w-full h-full bg-white p-3 space-y-3">
            <div className="h-4 bg-slate-300 rounded-sm w-1/2"></div>
            <div className="h-2 bg-slate-100 rounded-sm w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-1/4 mt-4"></div>
            <div className="h-2 bg-slate-100 rounded-sm w-full"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-1/4 mt-4"></div>
            <div className="h-2 bg-slate-100 rounded-sm w-full"></div>
        </div>
    ),
  },
  {
    name: 'Executive',
    description: 'Confident and leadership-focused.',
    preview: (
        <div className="w-full h-full bg-white p-2 space-y-2">
            <div className="h-8 bg-slate-700 w-full p-2">
                <div className="h-4 bg-white rounded-sm w-1/2"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded-sm w-1/4"></div>
            <div className="h-2 bg-slate-100 rounded-sm"></div>
        </div>
    ),
  },
  {
    name: 'Tech',
    description: 'Perfect for developers and engineers.',
    preview: (
        <div className="w-full h-full bg-white flex">
            <div className="w-1/3 bg-gray-800 p-2 space-y-2">
                <div className="h-4 bg-gray-600 rounded-sm w-full"></div>
                <div className="h-2 bg-gray-700 rounded-sm w-2/3"></div>
                <div className="h-2 bg-gray-700 rounded-sm w-full mt-4"></div>
                <div className="h-2 bg-gray-700 rounded-sm w-full"></div>
            </div>
            <div className="w-2/3 p-2 space-y-2">
                <div className="h-5 bg-slate-200 rounded-sm w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-sm w-full"></div>
            </div>
        </div>
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
              <div className="h-64 bg-gray-100 border-b border-gray-200">
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
