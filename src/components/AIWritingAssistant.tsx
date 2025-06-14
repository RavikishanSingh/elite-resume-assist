
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
    jobTitle?: string;
    company?: string;
    projectName?: string;
    technologies?: string;
    experience?: any[];
    skills?: string[];
    education?: any[];
  };
}

const AIWritingAssistant = ({ value, onChange, placeholder, userContext }: AIWritingAssistantProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    setIsGenerating(true);
    
    try {
      let contextPrompt = "";
      let responses: string[] = [];

      // Determine content type and create appropriate prompt
      if (userContext?.jobTitle && userContext?.company) {
        // Job Description
        contextPrompt = `Write a professional job description for a ${userContext.jobTitle} position at ${userContext.company}. `;
        if (userContext.fullName) contextPrompt += `The employee is ${userContext.fullName}. `;
        contextPrompt += "Focus on key responsibilities, achievements, and impact. Use bullet points and be specific about accomplishments.";
        
        responses = [
          "• Led development of key features that improved user engagement by 40% and reduced load times by 25%\n• Collaborated with cross-functional teams of 8+ members to deliver projects on schedule and within budget\n• Mentored 3 junior developers and conducted code reviews to maintain high code quality standards\n• Implemented automated testing processes that reduced bugs by 60% and improved deployment efficiency",
          "• Designed and developed scalable web applications serving 10,000+ daily active users\n• Optimized database queries and application performance, resulting in 35% faster response times\n• Participated in agile development cycles and contributed to technical decision-making processes\n• Created comprehensive documentation and conducted knowledge-sharing sessions with the team",
          "• Built responsive user interfaces using modern frameworks and best practices\n• Integrated third-party APIs and services to enhance application functionality\n• Collaborated with UX/UI designers to implement pixel-perfect designs and smooth user experiences\n• Participated in on-call rotations and resolved critical production issues with 99.9% uptime"
        ];
      } else if (userContext?.projectName) {
        // Project Description
        contextPrompt = `Write a compelling project description for "${userContext.projectName}". `;
        if (userContext.technologies) contextPrompt += `Technologies used: ${userContext.technologies}. `;
        contextPrompt += "Focus on what was built, your specific role, challenges overcome, and measurable impact.";
        
        responses = [
          "Developed a full-stack web application that streamlines user workflow and improves productivity by 50%. Implemented user authentication, real-time data synchronization, and responsive design. Overcame challenges with database optimization and API integration. Successfully deployed to production with 99% uptime and positive user feedback.",
          "Built an innovative solution that addresses real-world problems faced by target users. Designed intuitive user interface and robust backend architecture. Applied best practices in code organization, testing, and documentation. Achieved significant performance improvements and received recognition for technical excellence and user-centered design.",
          "Created a comprehensive platform that demonstrates proficiency in modern development technologies. Implemented key features including data visualization, user management, and secure payment processing. Solved complex technical challenges and delivered a scalable solution that can handle growing user demands."
        ];
      } else {
        // Professional Summary (default)
        contextPrompt = "Write a professional summary for a resume. ";
        if (userContext?.fullName) contextPrompt += `Name: ${userContext.fullName}. `;
        if (userContext?.experience?.length > 0) {
          contextPrompt += "\nWork Experience:\n";
          userContext.experience.forEach((exp, index) => {
            if (index < 3) {
              contextPrompt += `- ${exp.jobTitle} at ${exp.company}\n`;
            }
          });
        }
        if (userContext?.skills?.length > 0) {
          contextPrompt += `\nKey Skills: ${userContext.skills.slice(0, 8).join(', ')}\n`;
        }
        contextPrompt += "\nWrite a compelling 2-3 sentence professional summary.";
        
        responses = [
          "Experienced professional with a proven track record of delivering results in dynamic environments. Skilled in leveraging technology and data-driven insights to drive business growth and operational efficiency. Passionate about continuous learning and contributing to innovative solutions that make a meaningful impact.",
          "Results-oriented professional with expertise in problem-solving and strategic thinking. Demonstrated ability to work collaboratively in fast-paced environments while maintaining attention to detail. Committed to excellence and driving positive outcomes through innovative approaches and strong communication skills.",
          "Dynamic professional with strong analytical and technical skills, experienced in project management and team collaboration. Proven ability to adapt to changing requirements and deliver high-quality results under pressure. Seeking opportunities to contribute to organizational success while continuing professional development."
        ];
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If user has existing content, modify it; otherwise, generate new content
      let generatedContent;
      if (value.trim()) {
        // Modify existing content
        const modifiedResponses = [
          value + "\n• Enhanced with additional achievements and quantified results to strengthen impact",
          value.replace(/\./g, ', demonstrating strong problem-solving abilities and attention to detail.'),
          value + " Additionally, contributed to team success through effective collaboration and knowledge sharing."
        ];
        generatedContent = modifiedResponses[Math.floor(Math.random() * modifiedResponses.length)];
      } else {
        // Generate new content
        generatedContent = responses[Math.floor(Math.random() * responses.length)];
      }
      
      onChange(generatedContent);
      
      toast({
        title: value.trim() ? "Content Enhanced!" : "AI Content Generated!",
        description: value.trim() ? 
          "Your content has been improved with AI suggestions." : 
          "AI-generated content is ready. Feel free to edit it to match your style.",
      });
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate content. Please try again or write manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getButtonText = () => {
    if (isGenerating) return 'Generating...';
    return value.trim() ? 'Enhance with AI' : 'Generate with AI';
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
          onClick={generateContent}
          disabled={isGenerating}
          className="flex items-center space-x-2"
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          <span>{getButtonText()}</span>
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
        💡 Tip: {value.trim() ? 
          'Click "Enhance with AI" to improve your existing content with AI suggestions.' : 
          'Use AI to generate a starting point, then customize it to reflect your unique voice and experiences.'
        }
      </p>
    </div>
  );
};

export default AIWritingAssistant;
