import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Search, FileText, Download, Palette, Users, Shield, Mail } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      icon: FileText,
      questions: [
        {
          question: 'How do I create my first resume?',
          answer: 'Click the "Create Resume" button on the dashboard. You can either import your LinkedIn profile, fill in the information manually, or choose from our demo profiles to get started quickly.'
        },
        {
          question: 'What information do I need to provide?',
          answer: 'You\'ll need your personal information, work experience, education, skills, and any projects or certifications you want to highlight. You can always save as draft and come back later.'
        },
        {
          question: 'Can I save multiple versions of my resume?',
          answer: 'Yes! You can create and save multiple resumes, each tailored for different job applications or industries. All your resumes are accessible from the dashboard.'
        }
      ]
    },
    {
      category: 'Templates & Design',
      icon: Palette,
      questions: [
        {
          question: 'How many templates are available?',
          answer: 'We offer 35+ professionally designed templates across various categories including Modern, Classic, Creative, Executive, and industry-specific templates for Tech, Healthcare, Finance, and more.'
        },
        {
          question: 'Can I customize the template colors and fonts?',
          answer: 'While our templates are professionally designed with optimal ATS compatibility, you can switch between different templates to find the one that best matches your style.'
        },
        {
          question: 'Are the templates ATS-friendly?',
          answer: 'Yes! All our templates are designed to be compatible with Applicant Tracking Systems (ATS) while maintaining a professional and attractive appearance.'
        }
      ]
    },
    {
      category: 'ATS & Optimization',
      icon: Search,
      questions: [
        {
          question: 'What is an ATS score?',
          answer: 'ATS (Applicant Tracking System) score measures how well your resume will perform when scanned by automated systems used by employers. A higher score means better compatibility.'
        },
        {
          question: 'How can I improve my ATS score?',
          answer: 'Use standard section headings, include relevant keywords from the job description, avoid images and complex formatting, and use our AI writing assistant to optimize your content.'
        },
        {
          question: 'What is a good ATS score?',
          answer: 'Generally, a score above 80 is considered excellent, 60-80 is good, and below 60 may need improvement. Our system provides specific suggestions to improve your score.'
        }
      ]
    },
    {
      category: 'Exporting & Downloading',
      icon: Download,
      questions: [
        {
          question: 'How do I download my resume?',
          answer: 'Click the "Download PDF" button in the preview section. Your resume will be generated as a high-quality PDF file that you can save and share.'
        },
        {
          question: 'Can I download my resume in different formats?',
          answer: 'Currently, we support PDF format, which is the industry standard for resume submissions and is compatible with all ATS systems.'
        },
        {
          question: 'Is there a limit to how many times I can download?',
          answer: 'No limits! You can download your resume as many times as you need, and you can make updates and download new versions anytime.'
        }
      ]
    },
    {
      category: 'Account & Privacy',
      icon: Shield,
      questions: [
        {
          question: 'Is my data secure?',
          answer: 'Yes! We use industry-standard encryption to protect your data. Your information is stored securely and is never shared with third parties without your consent.'
        },
        {
          question: 'How long is my data stored?',
          answer: 'Your profile data is stored as long as your account is active. Resume drafts are stored for 7 days unless you save them permanently to your account.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time from the settings page. This will permanently remove all your data from our servers.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-gray-600">Find answers to common questions</p>
            </div>
          </div>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {searchQuery && filteredFaqs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {(searchQuery ? filteredFaqs : faqs).map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.category}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle>{category.category}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Still Need Help?</CardTitle>
                  <CardDescription>Our support team is here to assist you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you couldn't find the answer you're looking for, please don't hesitate to reach out to our support team.
                We typically respond within 24 hours.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate('/about')}>
                  About Us
                </Button>
                <Button variant="outline" onClick={() => navigate('/blogs')}>
                  Read Our Blog
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Community</h3>
                <p className="text-sm text-gray-600">
                  Join thousands of users who create professional resumes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">35+ Templates</h3>
                <p className="text-sm text-gray-600">
                  Choose from our extensive template library
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Your data is encrypted and protected
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
