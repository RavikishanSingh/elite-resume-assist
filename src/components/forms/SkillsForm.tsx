import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface SkillsFormProps {
  data: any;
  onUpdate: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  completedSteps?: Set<number>;
}

const SkillsForm = ({ data, onUpdate, onNext }: SkillsFormProps) => {
const SkillsForm = ({ data, onUpdate, onNext, onPrevious }: SkillsFormProps) => {
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [currentSkill, setCurrentSkill] = useState('');

  useEffect(() => {
    onUpdate('skills', skills);
  }, [skills, onUpdate]);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'Git',
    'HTML/CSS', 'AWS', 'Docker', 'Project Management', 'Agile', 'Leadership',
    'Communication', 'Problem Solving', 'Team Collaboration'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Add your technical and soft skills. Include programming languages, frameworks, tools, and key competencies.
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">
          Add Skills
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., JavaScript, Project Management, Python"
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={addSkill}
            variant="outline"
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {skills.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Your Skills ({skills.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Suggested Skills (Click to Add)
        </Label>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills
            .filter(skill => !skills.includes(skill))
            .map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-50 border-gray-300"
                onClick={() => {
                  setSkills([...skills, skill]);
                }}
              >
                {skill}
                <Plus className="w-3 h-3 ml-1" />
              </Badge>
            ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include both technical and soft skills</li>
          <li>• Add skills mentioned in job descriptions you're targeting</li>
          <li>• Be honest about your skill level</li>
          <li>• Include industry-specific tools and certifications</li>
        </ul>
      </div>

      <div className="flex justify-end pt-6">
        <div className="flex justify-between w-full">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
            className="flex items-center space-x-2"
          >
            <span>← Previous</span>
          </Button>
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8"
            >
              Continue to Projects →
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => window.location.href = '#preview'}
              className="px-6"
            >
              Skip to Preview
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SkillsForm;
