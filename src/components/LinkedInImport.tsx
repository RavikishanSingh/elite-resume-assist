
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, ExternalLink } from "lucide-react";

interface LinkedInImportProps {
  onImport: (data: any) => void;
  onClose: () => void;
}

const LinkedInImport = ({ onImport, onClose }: LinkedInImportProps) => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [manualData, setManualData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    currentJob: '',
    currentCompany: ''
  });

  const handleAutoImport = async () => {
    setIsImporting(true);
    
    // Simulate LinkedIn import (in a real app, this would use LinkedIn API)
    setTimeout(() => {
      // Mock data import
      const mockData = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedIn: linkedInUrl,
          portfolio: 'https://johndoe.dev',
          summary: 'Experienced Software Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and leading cross-functional teams.'
        },
        experience: [
          {
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            startDate: '2022',
            endDate: '',
            current: true,
            description: '• Led development of microservices architecture serving 1M+ users\n• Mentored junior developers and improved team productivity by 30%\n• Implemented CI/CD pipelines reducing deployment time by 50%'
          },
          {
            jobTitle: 'Software Engineer',
            company: 'StartupXYZ',
            location: 'Remote',
            startDate: '2020',
            endDate: '2022',
            current: false,
            description: '• Developed React applications with modern JavaScript/TypeScript\n• Collaborated with design team to implement responsive UI components\n• Optimized application performance achieving 95+ Lighthouse scores'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of California',
            location: 'Berkeley, CA',
            graduationDate: '2019',
            gpa: '3.8'
          }
        ],
        skills: [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Git', 'CI/CD', 'Agile'
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
            technologies: 'React, Node.js, MongoDB, Stripe API, AWS',
            url: 'https://ecommerce-demo.com',
            github: 'https://github.com/johndoe/ecommerce',
            startDate: '2023',
            endDate: '2023'
          }
        ]
      };
      
      onImport(mockData);
      setIsImporting(false);
    }, 2000);
  };

  const handleManualImport = () => {
    const importedData = {
      personalInfo: {
        fullName: manualData.fullName,
        email: manualData.email,
        phone: manualData.phone,
        location: manualData.location,
        linkedIn: manualData.linkedIn,
        portfolio: manualData.portfolio,
        summary: manualData.summary
      },
      experience: manualData.currentJob ? [{
        jobTitle: manualData.currentJob,
        company: manualData.currentCompany,
        location: manualData.location,
        startDate: new Date().getFullYear().toString(),
        endDate: '',
        current: true,
        description: ''
      }] : [],
      education: [],
      skills: [],
      projects: []
    };
    
    onImport(importedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>Import from LinkedIn</span>
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Import Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Option 1: Automatic Import (Demo)</h3>
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
              <Input
                id="linkedin-url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAutoImport}
              disabled={!linkedInUrl || isImporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing from LinkedIn...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Import Profile Data
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600">
              This will import your professional information including work experience, education, and skills.
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Option 2: Manual Entry</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={manualData.fullName}
                    onChange={(e) => setManualData({...manualData, fullName: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={manualData.email}
                    onChange={(e) => setManualData({...manualData, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={manualData.phone}
                    onChange={(e) => setManualData({...manualData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={manualData.location}
                    onChange={(e) => setManualData({...manualData, location: e.target.value})}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentJob">Current Job Title</Label>
                  <Input
                    id="currentJob"
                    value={manualData.currentJob}
                    onChange={(e) => setManualData({...manualData, currentJob: e.target.value})}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input
                    id="currentCompany"
                    value={manualData.currentCompany}
                    onChange={(e) => setManualData({...manualData, currentCompany: e.target.value})}
                    placeholder="Tech Corp"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={manualData.summary}
                  onChange={(e) => setManualData({...manualData, summary: e.target.value})}
                  placeholder="Brief description of your professional background and key skills..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleManualImport}
                className="w-full"
                variant="outline"
              >
                Import Manual Data
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Coming Soon</h4>
            <p className="text-sm text-yellow-800">
              Full LinkedIn API integration is in development. For now, you can use the demo import or enter your information manually.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInImport;
