
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LinkedInCallbackHandlerProps {
  onImportSuccess: (data: any) => void;
  onImportStart: () => void;
  onImportError: () => void;
}

const LinkedInCallbackHandler = ({ onImportSuccess, onImportStart, onImportError }: LinkedInCallbackHandlerProps) => {
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const importPending = sessionStorage.getItem('linkedin_import_pending');

    if (importPending === 'true' && session?.provider_token && session.user.app_metadata.provider === 'linkedin_oidc') {
      sessionStorage.removeItem('linkedin_import_pending');
      onImportStart();

      const importProfile = async (accessToken: string) => {
        try {
          const { data, error } = await supabase.functions.invoke('linkedin-import', {
            body: { accessToken }
          });
    
          if (error) throw error;
          
          if (data.success) {
            toast({
              title: "Profile Imported Successfully",
              description: "Your LinkedIn profile has been imported.",
            });
            onImportSuccess(data.data);
          } else {
            throw new Error(data.error || 'Import failed');
          }
        } catch (error) {
          console.error('LinkedIn import error:', error);
          toast({
            title: "Import Failed",
            description: (error as Error).message || "Failed to import LinkedIn profile. Please try again.",
            variant: "destructive"
          });
          onImportError();
        }
      };
      
      if (session.provider_token) {
        importProfile(session.provider_token);
      }
    }
  }, [session, onImportSuccess, onImportStart, onImportError, toast]);

  return null; // This is a logic-only component
};

export default LinkedInCallbackHandler;
