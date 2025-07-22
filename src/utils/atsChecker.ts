export interface ATSFeedback {
  category: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export const calculateATSScore = (resumeData: any): { score: number; feedback: ATSFeedback[] } => {
  const feedback: ATSFeedback[] = [];
  let totalScore = 0;
  const maxScore = 25; // 5 categories × 5 points each

  // Check contact information (5 points max)
  const contactScore = checkContactInfo(resumeData.personalInfo);
  feedback.push({
    category: 'Contact Information',
    score: contactScore,
    feedback: contactScore >= 4 ? 'Complete contact information provided' : 'Missing or incomplete contact information',
    suggestions: contactScore < 4 ? [
      'Include full name, phone number, email, and location',
      'Consider adding LinkedIn profile URL',
      'Ensure email is professional',
      'Add portfolio or website if relevant'
    ] : []
  });
  totalScore += contactScore;

  // Check skills section (5 points max)
  const skillsScore = checkSkills(resumeData.skills);
  feedback.push({
    category: 'Skills & Keywords',
    score: skillsScore,
    feedback: skillsScore >= 4 ? 'Strong skills section with relevant keywords' : 'Skills section needs improvement',
    suggestions: skillsScore < 4 ? [
      'Add more relevant technical skills',
      'Include industry-specific keywords',
      'Organize skills by category (Technical, Soft Skills, etc.)',
      'Include both hard and soft skills',
      'Match skills to job requirements'
    ] : []
  });
  totalScore += skillsScore;

  // Check experience section (5 points max)
  const experienceScore = checkExperience(resumeData.experience);
  feedback.push({
    category: 'Work Experience',
    score: experienceScore,
    feedback: experienceScore >= 4 ? 'Well-structured work experience section' : 'Work experience section needs enhancement',
    suggestions: experienceScore < 4 ? [
      'Include specific dates and duration',
      'Use action verbs to start bullet points',
      'Add quantifiable achievements and metrics',
      'Include 3-5 bullet points per role',
      'Focus on accomplishments, not just duties',
      'Use relevant keywords from job descriptions'
    ] : []
  });
  totalScore += experienceScore;

  // Check education section (5 points max)
  const educationScore = checkEducation(resumeData.education);
  feedback.push({
    category: 'Education',
    score: educationScore,
    feedback: educationScore >= 4 ? 'Education section is complete' : 'Education section could be improved',
    suggestions: educationScore < 4 ? [
      'Include degree, institution, and graduation year',
      'Add relevant coursework or academic achievements',
      'Include GPA if above 3.5',
      'Add certifications and professional development',
      'Include honors or awards if applicable'
    ] : []
  });
  totalScore += educationScore;

  // Check formatting and readability (5 points max)
  const formatScore = checkFormatting(resumeData);
  feedback.push({
    category: 'Formatting & Structure',
    score: formatScore,
    feedback: formatScore >= 4 ? 'Good formatting and structure' : 'Formatting needs improvement',
    suggestions: formatScore < 4 ? [
      'Use consistent formatting throughout',
      'Ensure proper section organization',
      'Use bullet points for easy scanning',
      'Keep consistent font and spacing',
      'Maintain proper white space',
      'Use clear section headers'
    ] : []
  });
  totalScore += formatScore;

  return {
    score: Math.round((totalScore / maxScore) * 100),
    feedback
  };
};

const checkContactInfo = (personalInfo: any): number => {
  let score = 0;
  if (personalInfo?.fullName?.trim()) score += 1.5;
  if (personalInfo?.email?.trim()) score += 1.5;
  if (personalInfo?.phone?.trim()) score += 1;
  if (personalInfo?.location?.trim()) score += 0.5;
  if (personalInfo?.linkedIn?.trim()) score += 0.5;
  return Math.min(score, 5);
};

const checkSkills = (skills: any[]): number => {
  if (!skills || skills.length === 0) return 0;
  
  let score = 0;
  
  // Base score for having skills
  if (skills.length >= 10) score += 2;
  else if (skills.length >= 7) score += 1.5;
  else if (skills.length >= 5) score += 1;
  else if (skills.length >= 3) score += 0.5;

  // Check for technical skills variety
  const technicalKeywords = ['programming', 'software', 'technical', 'development', 'coding', 'javascript', 'python', 'react', 'node', 'sql', 'database'];
  const hasTechnicalSkills = skills.some(skill => 
    technicalKeywords.some(keyword => skill.toLowerCase().includes(keyword))
  );
  if (hasTechnicalSkills) score += 1;

  // Check for soft skills
  const softSkillKeywords = ['communication', 'leadership', 'teamwork', 'problem-solving', 'management', 'collaboration', 'analytical'];
  const hasSoftSkills = skills.some(skill =>
    softSkillKeywords.some(keyword => skill.toLowerCase().includes(keyword))
  );
  if (hasSoftSkills) score += 1;
  
  // Bonus for diverse skill set
  if (hasTechnicalSkills && hasSoftSkills) score += 1;

  return Math.min(score, 5);
};

const checkExperience = (experience: any[]): number => {
  if (!experience || experience.length === 0) return 0;
  
  let score = 0;
  
  // Points for having experience entries
  if (experience.length >= 4) score += 2;
  else if (experience.length >= 3) score += 1.5;
  else if (experience.length >= 2) score += 1;
  else if (experience.length >= 1) score += 0.5;

  // Check for detailed descriptions
  experience.forEach(exp => {
    if (exp.description && exp.description.trim().length > 100) score += 0.3;
    if (exp.company?.trim() && exp.jobTitle?.trim()) score += 0.3;
    if (exp.startDate?.trim()) score += 0.2;
    
    // Bonus for quantifiable achievements
    if (exp.description && /\d+%|\d+\+|\$\d+|increased|improved|reduced|achieved/i.test(exp.description)) {
      score += 0.4;
    }
    
    // Bonus for action verbs
    if (exp.description && /^•?\s*(Led|Developed|Implemented|Managed|Created|Designed|Built|Optimized)/im.test(exp.description)) {
      score += 0.3;
    }
  });

  return Math.min(score, 5);
};

const checkEducation = (education: any[]): number => {
  if (!education || education.length === 0) return 0;
  
  let score = 0;
  
  education.forEach(edu => {
    if (edu.degree?.trim()) score += 1.5;
    if (edu.school?.trim()) score += 1.5;
    if (edu.graduationDate?.trim()) score += 1;
    if (edu.gpa && parseFloat(edu.gpa) >= 3.5) score += 1;
  });

  return Math.min(score, 5);
};

const checkFormatting = (resumeData: any): number => {
  let score = 0;
  
  // Check if all major sections are present
  const sections = ['personalInfo', 'experience', 'education', 'skills'];
  const presentSections = sections.filter(section => resumeData[section] && 
    (Array.isArray(resumeData[section]) ? resumeData[section].length > 0 : Object.keys(resumeData[section]).length > 0)
  );
  
  // Base score for section presence
  score += (presentSections.length / sections.length) * 3;
  
  // Bonus for having summary
  if (resumeData.personalInfo?.summary?.trim()) score += 1;
  
  // Bonus for having projects
  if (resumeData.projects && resumeData.projects.length > 0) score += 1;
  
  return Math.round(score);
};