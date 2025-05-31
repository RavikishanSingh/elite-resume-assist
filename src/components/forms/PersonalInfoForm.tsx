import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFormProps {
  data: any;
  onUpdate: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const PersonalInfoForm = ({ data, onUpdate, onNext }: PersonalInfoFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    ...data.personalInfo
  });

  useEffect(() => {
    onUpdate('personalInfo', formData);
  }, [formData, onUpdate]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location *
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="New York, NY"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="linkedIn" className="text-sm font-medium text-gray-700">
            LinkedIn Profile
          </Label>
          <Input
            id="linkedIn"
            value={formData.linkedIn}
            onChange={(e) => handleChange('linkedIn', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">
            Portfolio/Website
          </Label>
          <Input
            id="portfolio"
            value={formData.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="johndoe.com"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary" className="text-sm font-medium text-gray-700">
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
          rows={4}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          2-3 sentences highlighting your expertise and what you bring to potential employers.
        </p>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-8"
        >
          Continue to Experience
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
