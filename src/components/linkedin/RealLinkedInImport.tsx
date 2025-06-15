import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/components/auth/AuthProvider';

interface RealLinkedInImportProps {
  onImportSuccess: (data: any) => void;
  onClose: () => void;
}

const RealLinkedInImport = ({ onImportSuccess, onClose }: RealLinkedInImportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const { toast } = useToast();
  const { signInWithLinkedIn } = useAuth();

  const handleLinkedInOAuth = async () => {
    setIsImporting(true);
    sessionStorage.setItem('linkedin_import_pending', 'true');
    const { error } = await signInWithLinkedIn();

    if (error) {
      setIsImporting(false);
      sessionStorage.removeItem('linkedin_import_pending');
      console.error('LinkedIn OAuth error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with LinkedIn. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleManualTokenImport = async () => {
    if (!accessToken.trim()) {
      toast({
        title: "Access Token Required",
        description: "Please enter your LinkedIn access token.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      const { data, error } = await supabase.functions.invoke('linkedin-import', {
        body: { accessToken: accessToken.trim() }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Profile Imported Successfully",
          description: "Your LinkedIn profile has been imported successfully.",
          variant: "default"
        });
        onImportSuccess(data.data);
      } else {
        throw new Error(data.error || 'Import failed');
      }

    } catch (error) {
      console.error('LinkedIn import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import LinkedIn profile. Please check your access token and try again.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
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
              <span>Real LinkedIn Import</span>
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Real LinkedIn API Integration</h4>
                <p className="text-sm text-blue-800">
                  This feature connects to the real LinkedIn API to import your professional profile data. 
                  You'll need to authenticate with LinkedIn and grant permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Option 1: OAuth Authentication (Recommended)</h3>
            <p className="text-gray-600">
              Securely authenticate with LinkedIn using OAuth. This is the recommended method.
            </p>
            <Button 
              onClick={handleLinkedInOAuth}
              disabled={isImporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating with LinkedIn...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Authenticate with LinkedIn
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Option 2: Manual Access Token (For Testing)</h3>
              <p className="text-sm text-gray-600">
                If you have a LinkedIn access token from the LinkedIn Developer Console, you can enter it directly below.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter LinkedIn Access Token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button 
                  onClick={handleManualTokenImport}
                  disabled={isImporting || !accessToken.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing Profile...
                    </>
                  ) : (
                    'Import with Access Token'
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Setup Required</h4>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>
                <strong>For OAuth to work:</strong> You need to configure LinkedIn OAuth in your Supabase project settings.
              </p>
              <p>
                <strong>For API access:</strong> You need a LinkedIn Developer account and approved application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealLinkedInImport;
