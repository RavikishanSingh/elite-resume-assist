import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Target, Users, Zap, Shield, Award, Heart } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">About Us</h1>
              <p className="text-gray-600">Learn more about our mission and values</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're dedicated to helping professionals create outstanding resumes that get noticed.
              Our platform combines cutting-edge AI technology with expert-designed templates
              to make resume building simple, fast, and effective.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  To empower every professional with the tools they need to showcase their unique
                  skills and experience effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform with the latest AI technology and
                  user feedback to deliver the best experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  Join thousands of professionals who trust our platform to help them
                  land their dream jobs.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Privacy & Security</h3>
                  <p className="text-gray-600">
                    Your data is encrypted and secure. We never share your information
                    with third parties without your consent.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Templates</h3>
                  <p className="text-gray-600">
                    Access 35+ expertly designed templates that are ATS-friendly and
                    industry-specific.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI-Powered Tools</h3>
                  <p className="text-gray-600">
                    Leverage artificial intelligence to improve your content and
                    optimize for applicant tracking systems.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">User-Friendly</h3>
                  <p className="text-gray-600">
                    Intuitive interface designed for everyone, from recent graduates
                    to experienced executives.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <div className="bg-white rounded-lg p-8 shadow-sm text-left space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Founded by career professionals and technology experts, our platform was born
                from a simple observation: creating a professional resume shouldn't be complicated
                or expensive.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We've helped thousands of professionals across industries create resumes that
                stand out and get results. Our commitment is to continuously improve and provide
                the best resume-building experience possible.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're a recent graduate entering the job market or an experienced
                professional seeking new opportunities, we're here to support your career journey.
              </p>
            </div>
          </section>

          <section className="text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Join our community and create your professional resume today.
            </p>
            <Button onClick={() => navigate('/dashboard')} size="lg">
              Go to Dashboard
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
