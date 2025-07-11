export interface ATSFeedback {
  category: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export const calculateATSScore = (resumeData: any): { score: number; feedback: ATSFeedback[] } => {
  const feedback: ATSFeedback[] = [];
  let totalScore = 0;
  const maxScore = 100;

  // Check contact information (20 points)
  const contactScore = checkContactInfo(resumeData.personalInfo);
  feedback.push({
    category: 'Contact Information',
    score: contactScore,
    feedback: contactScore >= 15 ? 'Good contact information provided' : 'Missing or incomplete contact information',
    suggestions: contactScore < 15 ? [
      'Include full name, phone number, email, and location',
      'Consider adding LinkedIn profile URL',
      'Ensure email is professional'
    ] : []
  });
  totalScore += contactScore;

  // Check skills section (25 points)
  const skillsScore = checkSkills(resumeData.skills);
  feedback.push({
    category: 'Skills & Keywords',
    score: skillsScore,
    feedback: skillsScore >= 20 ? 'Strong skills section with relevant keywords' : 'Skills section needs improvement',
    suggestions: skillsScore < 20 ? [
      'Add more relevant technical skills',
      'Include industry-specific keywords',
      'Organize skills by category (Technical, Soft Skills, etc.)'
    ] : []
  });
  totalScore += skillsScore;

  // Check experience section (30 points)
  const experienceScore = checkExperience(resumeData.experience);
  feedback.push({
    category: 'Work Experience',
    score: experienceScore,
    feedback: experienceScore >= 25 ? 'Well-structured work experience section' : 'Work experience section needs enhancement',
    suggestions: experienceScore < 25 ? [
      'Include specific dates and duration',
      'Use action verbs to start bullet points',
      'Add quantifiable achievements and metrics',
      'Include 3-5 bullet points per role'
    ] : []
  });
  totalScore += experienceScore;

  // Check education section (15 points)
  const educationScore = checkEducation(resumeData.education);
  feedback.push({
    category: 'Education',
    score: educationScore,
    feedback: educationScore >= 12 ? 'Education section is complete' : 'Education section could be improved',
    suggestions: educationScore < 12 ? [
      'Include degree, institution, and graduation year',
      'Add relevant coursework or academic achievements',
      'Include GPA if above 3.5'
    ] : []
  });
  totalScore += educationScore;

  // Check formatting and readability (10 points)
  const formatScore = checkFormatting(resumeData);
  feedback.push({
    category: 'Formatting & Structure',
    score: formatScore,
    feedback: formatScore >= 8 ? 'Good formatting and structure' : 'Formatting needs improvement',
    suggestions: formatScore < 8 ? [
      'Use consistent formatting throughout',
      'Ensure proper section organization',
      'Use bullet points for easy scanning',
      'Keep consistent font and spacing'
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
  if (personalInfo?.fullName) score += 5;
  if (personalInfo?.email) score += 5;
  if (personalInfo?.phone) score += 5;
  if (personalInfo?.location) score += 3;
  if (personalInfo?.linkedIn) score += 2;
  return Math.min(score, 20);
};

const checkSkills = (skills: any[]): number => {
  if (!skills || skills.length === 0) return 0;
  
  let score = 0;
  if (skills.length >= 5) score += 10;
  else if (skills.length >= 3) score += 7;
  else score += 3;

  // Check for technical skills variety
  const hasVariety = skills.some(skill => 
    skill.toLowerCase().includes('programming') ||
    skill.toLowerCase().includes('software') ||
    skill.toLowerCase().includes('technical')
  );
  if (hasVariety) score += 8;

  // Check for soft skills
  const hasSoftSkills = skills.some(skill =>
    ['communication', 'leadership', 'teamwork', 'problem-solving', 'management'].some(soft =>
      skill.toLowerCase().includes(soft)
    )
  );
  if (hasSoftSkills) score += 7;

  return Math.min(score, 25);
};

const checkExperience = (experience: any[]): number => {
  if (!experience || experience.length === 0) return 0;
  
  let score = 0;
  
  // Points for having experience entries
  if (experience.length >= 3) score += 10;
  else if (experience.length >= 2) score += 8;
  else score += 5;

  // Check for detailed descriptions
  experience.forEach(exp => {
    if (exp.description && exp.description.length > 50) score += 3;
    if (exp.company && exp.position) score += 2;
    if (exp.startDate && exp.endDate) score += 2;
  });

  return Math.min(score, 30);
};

const checkEducation = (education: any[]): number => {
  if (!education || education.length === 0) return 0;
  
  let score = 0;
  
  education.forEach(edu => {
    if (edu.degree) score += 5;
    if (edu.institution) score += 3;
    if (edu.graduationDate) score += 2;
    if (edu.gpa && parseFloat(edu.gpa) >= 3.5) score += 2;
  });

  return Math.min(score, 15);
};

const checkFormatting = (resumeData: any): number => {
  let score = 0;
  
  // Check if all major sections are present
  const sections = ['personalInfo', 'experience', 'education', 'skills'];
  const presentSections = sections.filter(section => resumeData[section] && 
    (Array.isArray(resumeData[section]) ? resumeData[section].length > 0 : Object.keys(resumeData[section]).length > 0)
  );
  
  score += (presentSections.length / sections.length) * 10;
  
  return Math.round(score);
};