
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkedInImportProps {
  onImport: (data: any) => void;
  onClose: () => void;
}

const LinkedInImport = ({ onImport, onClose }: LinkedInImportProps) => {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStep, setImportStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [importedProfile, setImportedProfile] = useState<any>(null);
  const { toast } = useToast();
  
  const [manualData, setManualData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    currentJob: '',
    currentCompany: '',
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[]
  });

  const validateLinkedInUrl = (url: string) => {
    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedInPattern.test(url);
  };

  const simulateLinkedInAPI = async (profileUrl: string) => {
    // Simulate different profiles based on URL
    const profiles = {
      'john-doe': {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedIn: profileUrl,
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
      },
      'jane-smith': {
        personalInfo: {
          fullName: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 (555) 987-6543',
          location: 'New York, NY',
          linkedIn: profileUrl,
          portfolio: 'https://janesmith.design',
          summary: 'Creative UX/UI Designer with 4+ years of experience designing intuitive digital experiences. Specialized in user research, prototyping, and design systems.'
        },
        experience: [
          {
            jobTitle: 'Senior UX Designer',
            company: 'Design Studio',
            location: 'New York, NY',
            startDate: '2021',
            endDate: '',
            current: true,
            description: '• Led design for mobile app with 500K+ users\n• Conducted user research and usability testing\n• Created comprehensive design system'
          }
        ],
        education: [
          {
            degree: 'Master of Fine Arts in Design',
            school: 'Parsons School of Design',
            location: 'New York, NY',
            graduationDate: '2020',
            gpa: '3.9'
          }
        ],
        skills: [
          'Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'
        ],
        projects: [
          {
            name: 'Mobile Banking App',
            description: 'Redesigned mobile banking app interface improving user satisfaction by 40%',
            technologies: 'Figma, Principle, InVision',
            url: 'https://dribbble.com/shots/banking-app',
            startDate: '2023',
            endDate: '2023'
          }
        ]
      }
    };

    // Extract username from URL
    const usernameMatch = profileUrl.match(/\/in\/([^\/]+)/);
    const username = usernameMatch ? usernameMatch[1] : '';
    
    // Return appropriate profile or default
    return profiles[username as keyof typeof profiles] || profiles['john-doe'];
  };

  const handleAutoImport = async () => {
    if (!validateLinkedInUrl(linkedInUrl)) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportStep('processing');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const profileData = await simulateLinkedInAPI(linkedInUrl);
      console.log('LinkedIn profile data retrieved:', profileData);
      
      setImportedProfile(profileData);
      setImportStep('success');
      
      toast({
        title: "Profile Imported Successfully",
        description: "Your LinkedIn profile data has been imported. Click 'Use This Data' to proceed.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('LinkedIn import error:', error);
      setImportStep('error');
      toast({
        title: "Import Failed",
        description: "Failed to import LinkedIn profile. Please try again or use manual entry.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmImport = () => {
    if (importedProfile) {
      console.log('Confirming LinkedIn import with data:', importedProfile);
      
      // Ensure proper data structure for the resume builder
      const formattedData = {
        personalInfo: {
          fullName: importedProfile.personalInfo?.fullName || '',
          email: importedProfile.personalInfo?.email || '',
          phone: importedProfile.personalInfo?.phone || '',
          location: importedProfile.personalInfo?.location || '',
          linkedIn: importedProfile.personalInfo?.linkedIn || '',
          portfolio: importedProfile.personalInfo?.portfolio || '',
          summary: importedProfile.personalInfo?.summary || ''
        },
        experience: importedProfile.experience || [],
        education: importedProfile.education || [],
        projects: importedProfile.projects || [],
        skills: importedProfile.skills || [],
        summary: importedProfile.personalInfo?.summary || ''
      };
      
      console.log('Formatted data being sent to parent:', formattedData);
      onImport(formattedData);
    }
  };

  const handleManualImport = () => {
    if (!manualData.fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter at least your full name to continue.",
        variant: "destructive"
      });
      return;
    }

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
    
    console.log('Manual data being sent to parent:', importedData);
    
    toast({
      title: "Data Imported",
      description: "Your information has been imported successfully.",
      variant: "default"
    });
    
    onImport(importedData);
  };

  if (importStep === 'success' && importedProfile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Profile Imported Successfully</span>
              </CardTitle>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✅ Import Complete</h4>
              <p className="text-sm text-green-800">
                We've successfully imported your LinkedIn profile data. Review the information below and proceed to build your resume.
              </p>
            </div>

            {/* Preview imported data */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Name:</strong> {importedProfile.personalInfo?.fullName}</p>
                  <p><strong>Email:</strong> {importedProfile.personalInfo?.email}</p>
                  <p><strong>Location:</strong> {importedProfile.personalInfo?.location}</p>
                  <p><strong>Summary:</strong> {importedProfile.personalInfo?.summary}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Experience ({importedProfile.experience?.length || 0} positions)</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {importedProfile.experience?.slice(0, 2).map((exp: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p><strong>{exp.jobTitle}</strong> at {exp.company}</p>
                      <p className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                  ))}
                  {importedProfile.experience?.length > 2 && (
                    <p className="text-sm text-gray-600">... and {importedProfile.experience.length - 2} more</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Skills ({importedProfile.skills?.length || 0} skills)</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{importedProfile.skills?.slice(0, 8).join(', ')}
                    {importedProfile.skills?.length > 8 && '...'}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleConfirmImport}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Use This Data
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setImportStep('input');
                  setImportedProfile(null);
                }}
                className="flex-1"
              >
                Import Different Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h3 className="text-lg font-semibold">LinkedIn Profile Import</h3>
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
              <Input
                id="linkedin-url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                className={!validateLinkedInUrl(linkedInUrl) && linkedInUrl ? 'border-red-300' : ''}
              />
              {linkedInUrl && !validateLinkedInUrl(linkedInUrl) && (
                <p className="text-sm text-red-600">Please enter a valid LinkedIn profile URL</p>
              )}
            </div>
            
            {importStep === 'processing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing your LinkedIn profile...</span>
                </div>
                <div className="mt-2 text-sm text-blue-700">
                  This may take a few seconds. Please wait.
                </div>
              </div>
            )}

            {importStep === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800">Import failed. Please try again or use manual entry.</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleAutoImport}
              disabled={!linkedInUrl || isImporting || !validateLinkedInUrl(linkedInUrl)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing Profile...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Import Profile Data
                </>
              )}
            </Button>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Try These Demo Profiles</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => setLinkedInUrl('https://linkedin.com/in/john-doe')}
                  className="text-blue-700 hover:underline block"
                >
                  https://linkedin.com/in/john-doe (Software Engineer)
                </button>
                <button 
                  onClick={() => setLinkedInUrl('https://linkedin.com/in/jane-smith')}
                  className="text-blue-700 hover:underline block"
                >
                  https://linkedin.com/in/jane-smith (UX Designer)
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Manual Entry</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={manualData.fullName}
                    onChange={(e) => setManualData({...manualData, fullName: e.target.value})}
                    placeholder="John Doe"
                    required
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
            <h4 className="font-medium text-yellow-900 mb-2">🔒 Privacy & Security</h4>
            <p className="text-sm text-yellow-800">
              Your LinkedIn data is processed securely and is not stored on our servers. The demo import simulates real LinkedIn integration for testing purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInImport;
