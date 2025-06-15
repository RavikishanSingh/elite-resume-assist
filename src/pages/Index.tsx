import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Star, Users, FileText, Brain, Sparkles, Zap, Shield, Globe } from "lucide-react";
import ResumeBuilder from "@/components/ResumeBuilder";
import SignInModal from "@/components/auth/SignInModal";
import ResumeManager from "@/components/resume/ResumeManager";
import LinkedInImport from "@/components/LinkedInImport";
import { generatePDF } from "@/utils/pdfGenerator";
import { useAuth } from '@/components/auth/AuthProvider';
import RealLinkedInImport from '@/components/linkedin/RealLinkedInImport';
import TemplateShowcase from '@/components/TemplateShowcase';

const Index = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLinkedInImport, setShowLinkedInImport] = useState(false);
  const [showRealLinkedInImport, setShowRealLinkedInImport] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showResumes, setShowResumes] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const { user, signOut, loading } = useAuth();

  const handleSignIn = (email: string, password: string) => {
    // Simple mock authentication
    setIsSignedIn(true);
    setUserName(email.split('@')[0]);
    setShowSignIn(false);
    console.log('User signed in:', email);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserName('');
    setShowResumes(false);
  };

  const handleCreateNewResume = () => {
    setShowResumes(false);
    setImportedData(null);
    setShowBuilder(true);
  };

  const handleLinkedInImport = (data: any) => {
    console.log('LinkedIn data imported in Index:', data);
    console.log('Data structure:', JSON.stringify(data, null, 2));
    
    // Set the new imported data
    setImportedData(data);
    setShowLinkedInImport(false);
    setShowBuilder(true);
    
    // Show success toast
    console.log('Successfully imported LinkedIn profile data');
  };

  const handleRealLinkedInImport = (data: any) => {
    console.log('Real LinkedIn data imported:', data);
    setImportedData(data);
    setShowRealLinkedInImport(false);
    setShowBuilder(true);
  };

  const handleEditResume = (resume: any) => {
    // Load resume data and open builder
    setShowResumes(false);
    setImportedData(resume.data);
    setShowBuilder(true);
  };

  const handleDownloadResume = async (resume: any) => {
    try {
      const pdf = await generatePDF(resume.data);
      pdf.save(`${resume.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showBuilder) {
    return <ResumeBuilder 
      onBack={() => {
        setShowBuilder(false);
        setImportedData(null);
        // Only show resumes if user is signed in
        if (isSignedIn) {
          setShowResumes(true);
        }
      }}
      initialData={importedData}
    />;
  }

  if (showResumes && isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SmartResume
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {userName}!</span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </nav>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <ResumeManager
            onCreateNew={handleCreateNewResume}
            onEditResume={handleEditResume}
            onDownloadResume={handleDownloadResume}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 py-6 relative">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartResume
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Resume Builder</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-gray-600 font-medium">Welcome, {user.email?.split('@')[0]}!</span>
                  <Button variant="outline" onClick={() => setShowResumes(true)} className="hover:bg-blue-50">
                    My Resumes
                  </Button>
                  <Button variant="outline" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => window.location.href = '/auth'} className="hover:bg-blue-50">
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">AI-Powered Resume Generation</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Build Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Resume with AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create professional, ATS-friendly resumes in minutes. Import directly from LinkedIn or build from scratch with intelligent AI assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                onClick={() => { setImportedData(null); setShowBuilder(true); }}
              >
                <Zap className="mr-3 w-5 h-5" />
                Start Building Free
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-10 py-6 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => user ? setShowRealLinkedInImport(true) : window.location.href = '/auth'}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                {user ? 'Import from LinkedIn' : 'Sign In to Import'}
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">50K+</span>
                </div>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600">User Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-gray-900">ATS</span>
                </div>
                <p className="text-sm text-gray-600">Friendly</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900">100+</span>
                </div>
                <p className="text-sm text-gray-600">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn Integration Highlight */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full mb-8">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-white font-semibold">LinkedIn Integration Now Live!</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Skip the Manual Work
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Import your professional profile directly from LinkedIn in seconds. Save hours of typing and get a perfectly formatted resume instantly.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-xl font-semibold mb-4 text-white">❌ Traditional Way</h3>
                <ul className="text-left space-y-3 text-blue-100">
                  <li>• Manually type all information</li>
                  <li>• Remember dates and details</li>
                  <li>• Format everything perfectly</li>
                  <li>• Takes 2-3 hours</li>
                </ul>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/40">
                <h3 className="text-xl font-semibold mb-4 text-white">✅ With LinkedIn Import</h3>
                <ul className="text-left space-y-3 text-white">
                  <li>• Import in seconds</li>
                  <li>• All data automatically formatted</li>
                  <li>• Professional descriptions included</li>
                  <li>• Ready in under 10 minutes</li>
                </ul>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={() => setShowLinkedInImport(true)}
              className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Try LinkedIn Import Now
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform provides all the tools and features to create, optimize, and perfect your resume for any industry.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:scale-105 group">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <CardTitle className="text-2xl mb-3">LinkedIn Integration</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    Import your professional information directly from LinkedIn with intelligent data extraction and automatic formatting.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-indigo-50 hover:scale-105 group">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">AI-Powered Analysis</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    Get instant feedback on grammar, tone, keywords, and job-specific optimization with advanced AI technology.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-indigo-50 to-blue-50 hover:scale-105 group">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">Professional Templates</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    Choose from 6 modern, ATS-friendly templates with real-time editing and industry-specific formatting.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Additional Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Privacy Protected</h3>
                <p className="text-gray-600">Your data is secure and never shared with third parties.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Create professional resumes in under 10 minutes.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Global Standards</h3>
                <p className="text-gray-600">Supports international resume formats and standards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who've landed their dream jobs with our AI-powered resume builder and LinkedIn integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                onClick={() => { setImportedData(null); setShowBuilder(true); }}
              >
                <Sparkles className="mr-3 w-5 h-5" />
                Start From Scratch
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowLinkedInImport(true)}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Import from LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <TemplateShowcase />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SmartResume</span>
          </div>
          <p className="text-gray-400 mb-4">&copy; 2025 SmartResume. Built with AI to help you succeed.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={handleSignIn}
      />

      {showLinkedInImport && (
        <LinkedInImport
          onImport={handleLinkedInImport}
          onClose={() => setShowLinkedInImport(false)}
        />
      )}

      {showRealLinkedInImport && (
        <RealLinkedInImport
          onImportSuccess={handleRealLinkedInImport}
          onClose={() => setShowRealLinkedInImport(false)}
        />
      )}
    </div>
  );
};

export default Index;
