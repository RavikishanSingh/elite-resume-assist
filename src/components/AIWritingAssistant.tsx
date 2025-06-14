
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIWritingAssistantProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  userContext?: {
    fullName?: string;
    experience?: any[];
    skills?: string[];
    education?: any[];
  };
}

const AIWritingAssistant = ({ value, onChange, placeholder, userContext }: AIWritingAssistantProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSummary = async () => {
    setIsGenerating(true);
    
    try {
      // Create a context prompt based on user's information
      let contextPrompt = "Write a professional summary for a resume based on the following information:\n\n";
      
      if (userContext?.fullName) {
        contextPrompt += `Name: ${userContext.fullName}\n`;
      }
      
      if (userContext?.experience?.length > 0) {
        contextPrompt += "\nWork Experience:\n";
        userContext.experience.forEach((exp, index) => {
          if (index < 3) { // Only use first 3 experiences to avoid too long prompts
            contextPrompt += `- ${exp.jobTitle} at ${exp.company}\n`;
          }
        });
      }
      
      if (userContext?.skills?.length > 0) {
        contextPrompt += `\nKey Skills: ${userContext.skills.slice(0, 8).join(', ')}\n`;
      }
      
      if (userContext?.education?.length > 0) {
        const education = userContext.education[0];
        contextPrompt += `\nEducation: ${education.degree} from ${education.school}\n`;
      }
      
      contextPrompt += "\nWrite a compelling 2-3 sentence professional summary that highlights key strengths and career objectives. Make it specific and impactful.";

      // Simple AI generation using a mock response for now
      // In a real implementation, this would call an AI service
      const mockResponses = [
        "Experienced professional with a proven track record of delivering results in dynamic environments. Skilled in leveraging technology and data-driven insights to drive business growth and operational efficiency. Passionate about continuous learning and contributing to innovative solutions that make a meaningful impact.",
        "Results-oriented professional with expertise in problem-solving and strategic thinking. Demonstrated ability to work collaboratively in fast-paced environments while maintaining attention to detail. Committed to excellence and driving positive outcomes through innovative approaches and strong communication skills.",
        "Dynamic professional with strong analytical and technical skills, experienced in project management and team collaboration. Proven ability to adapt to changing requirements and deliver high-quality results under pressure. Seeking opportunities to contribute to organizational success while continuing professional development."
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      onChange(randomResponse);
      
      toast({
        title: "AI Summary Generated!",
        description: "Your professional summary has been created. Feel free to edit it to match your style.",
      });
      
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate summary. Please try again or write manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">AI Writing Assistant</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSummary}
          disabled={isGenerating}
          className="flex items-center space-x-2"
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
        </Button>
      </div>
      
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="resize-none"
      />
      
      <p className="text-xs text-gray-500">
        💡 Tip: Use AI to generate a starting point, then customize it to reflect your unique voice and experiences.
      </p>
    </div>
  );
};

export default AIWritingAssistant;
