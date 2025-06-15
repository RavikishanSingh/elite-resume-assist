import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import EditableText from "../EditableText";

interface ModernTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
  isPDFMode?: boolean;
  sectionOrder?: string[];
  showPageBreaks?: boolean;
}

const ModernTemplate = ({ 
  data, 
  onUpdate, 
  isEditing = false, 
  isPDFMode = false,
  sectionOrder = ['summary', 'experience', 'skills', 'projects', 'education'],
  showPageBreaks = false
}: ModernTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  // Render sections based on order with intelligent page break controls for ALL sections
  const renderSection = (sectionId: string, index: number) => {
    // Apply smart page breaks - first section after header stays, others break intelligently
    const sectionStyle = {
      pageBreakInside: 'avoid' as const,
      breakInside: 'avoid' as const,
      pageBreakAfter: 'avoid' as const,
      breakAfter: 'avoid' as const,
      // For sections that might be long, allow page breaks before them if needed
      ...(index > 1 && {
        pageBreakBefore: 'auto' as const,
        breakBefore: 'auto' as const
      })
    };

    switch (sectionId) {
      case 'summary':
        return personalInfo?.summary && (
          <section 
            key={sectionId} 
            className="mb-8" 
            style={sectionStyle}
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
              <div className="w-2 h-6 bg-blue-600 mr-3"></div>
              Professional Summary
            </h2>
            <div className="text-gray-700 leading-relaxed pl-5">
              <EditableText
                value={personalInfo.summary}
                onSave={(value) => onUpdate?.('personalInfo', 'summary', value)}
                multiline
                isEditing={isEditing}
                className="inline-block w-full"
                placeholder="Professional summary highlighting your key qualifications and career objectives"
              />
            </div>
          </section>
        );

      case 'experience':
        return experience?.length > 0 && (
          <section 
            key={sectionId} 
            className="mb-8"
            style={{
              ...sectionStyle,
              // Experience section can be long, so allow smart page breaks
              pageBreakBefore: index > 0 ? 'auto' : 'avoid',
              breakBefore: index > 0 ? 'auto' : 'avoid'
            }}
          >
            <h2 
              className="text-xl font-semibold text-blue-600 mb-6 flex items-center" 
              style={{ 
                pageBreakAfter: 'avoid', 
                breakAfter: 'avoid',
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}
            >
              <div className="w-2 h-6 bg-blue-600 mr-3"></div>
              Professional Experience
            </h2>
            <div className="space-y-6 pl-5">
              {experience.map((exp: any, expIndex: number) => (
                <div 
                  key={expIndex} 
                  className="relative" 
                  style={{ 
                    pageBreakInside: 'avoid', 
                    breakInside: 'avoid', 
                    orphans: 4, 
                    widows: 4
                  }}
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <EditableText
                          value={exp.jobTitle || ''}
                          onSave={(value) => onUpdate?.('experience', 'jobTitle', value, expIndex)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="Job Title"
                        />
                      </h3>
                      <p className="text-blue-600 font-medium">
                        <EditableText
                          value={exp.company || ''}
                          onSave={(value) => onUpdate?.('experience', 'company', value, expIndex)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="Company Name"
                        />
                      </p>
                    </div>
                    <div className="text-right text-gray-600 text-sm flex-shrink-0">
                      <p className="font-medium">
                        <EditableText
                          value={exp.startDate || ''}
                          onSave={(value) => onUpdate?.('experience', 'startDate', value, expIndex)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="Start Date"
                        />
                        {' – '}
                        {exp.current ? 'Present' : (
                          <EditableText
                            value={exp.endDate || ''}
                            onSave={(value) => onUpdate?.('experience', 'endDate', value, expIndex)}
                            isEditing={isEditing}
                            className="inline-block"
                            placeholder="End Date"
                          />
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    <EditableText
                      value={exp.description || ''}
                      onSave={(value) => onUpdate?.('experience', 'description', value, expIndex)}
                      multiline
                      isEditing={isEditing}
                      className="inline-block w-full"
                      placeholder="• Key achievement or responsibility&#10;• Quantified result or impact&#10;• Relevant skill or technology used"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        return skills?.length > 0 && (
          <section 
            key={sectionId} 
            className="mb-8" 
            style={{
              ...sectionStyle,
              // Skills section should start fresh if it would be cut
              pageBreakBefore: index > 1 ? 'auto' : 'avoid',
              breakBefore: index > 1 ? 'auto' : 'avoid'
            }}
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
              <div className="w-2 h-6 bg-blue-600 mr-3"></div>
              Core Competencies
            </h2>
            <div className="pl-5">
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: string, skillIndex: number) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                  >
                    <EditableText
                      value={skill || ''}
                      onSave={(value) => {
                        const updatedSkills = [...skills];
                        updatedSkills[skillIndex] = value;
                        onUpdate?.('skills', '', updatedSkills.join(','));
                      }}
                      isEditing={isEditing}
                      className="inline-block"
                      placeholder="Skill"
                    />
                  </span>
                ))}
              </div>
            </div>
          </section>
        );

      case 'projects':
        return projects?.length > 0 && (
          <section 
            key={sectionId} 
            className="mb-8"
            style={{
              ...sectionStyle,
              // Projects section should definitely start on new page if it would be cut
              pageBreakBefore: index > 1 ? 'always' : 'auto',
              breakBefore: index > 1 ? 'always' : 'auto'
            }}
          >
            <h2 
              className="text-xl font-semibold text-blue-600 mb-6 flex items-center" 
              style={{ 
                pageBreakAfter: 'avoid', 
                breakAfter: 'avoid',
                pageBreakInside: 'avoid',
                breakInside: 'avoid'
              }}
            >
              <div className="w-2 h-6 bg-blue-600 mr-3"></div>
              Key Projects
            </h2>
            <div className="space-y-6 pl-5">
              {projects.map((project: any, projIndex: number) => (
                <div 
                  key={projIndex} 
                  style={{ 
                    pageBreakInside: 'avoid', 
                    breakInside: 'avoid', 
                    orphans: 3, 
                    widows: 3
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <EditableText
                      value={project.name || ''}
                      onSave={(value) => onUpdate?.('projects', 'name', value, projIndex)}
                      isEditing={isEditing}
                      className="inline-block"
                      placeholder="Project Name"
                    />
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm mb-2">
                    <EditableText
                      value={project.description || ''}
                      onSave={(value) => onUpdate?.('projects', 'description', value, projIndex)}
                      multiline
                      isEditing={isEditing}
                      className="inline-block w-full"
                      placeholder="Project description and key achievements"
                    />
                  </div>
                  {project.technologies && (
                    <p className="text-blue-600 font-medium text-sm">
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        return education?.length > 0 && (
          <section 
            key={sectionId} 
            className="mb-6" 
            style={{
              ...sectionStyle,
              // Education can start on new page if needed
              pageBreakBefore: index > 2 ? 'auto' : 'avoid',
              breakBefore: index > 2 ? 'auto' : 'avoid'
            }}
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
              <div className="w-2 h-6 bg-blue-600 mr-3"></div>
              Education
            </h2>
            <div className="space-y-4 pl-5">
              {education.map((edu: any, eduIndex: number) => (
                <div 
                  key={eduIndex} 
                  className="flex justify-between items-start flex-wrap gap-2" 
                  style={{ 
                    pageBreakInside: 'avoid', 
                    breakInside: 'avoid'
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <EditableText
                        value={edu.degree || ''}
                        onSave={(value) => onUpdate?.('education', 'degree', value, eduIndex)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Degree"
                      />
                    </h3>
                    <p className="text-blue-600 font-medium">
                      <EditableText
                        value={edu.school || ''}
                        onSave={(value) => onUpdate?.('education', 'school', value, eduIndex)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Institution Name"
                      />
                    </p>
                    {edu.gpa && (
                      <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-right text-gray-600 text-sm flex-shrink-0">
                    <p className="font-medium">
                      <EditableText
                        value={edu.graduationDate || ''}
                        onSave={(value) => onUpdate?.('education', 'graduationDate', value, eduIndex)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Graduation Date"
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full bg-white text-gray-800 px-6 py-6" 
      style={{ 
        fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto'
      }}
    >
      {/* Compact Professional Header */}
      <header 
        className="pb-6 mb-6" 
        style={{ 
          pageBreakInside: 'avoid', 
          breakInside: 'avoid',
          pageBreakAfter: 'avoid',
          breakAfter: 'avoid'
        }}
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            <EditableText
              value={personalInfo?.fullName || ''}
              onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
              placeholder="Your Full Name"
              isEditing={isEditing}
              className="inline-block"
            />
          </h1>
          
          {/* Primary Contact Information - Compact Layout */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 mb-3 max-w-4xl mx-auto">
            {personalInfo?.email && (
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate max-w-xs">
                  <EditableText
                    value={personalInfo.email}
                    onSave={(value) => onUpdate?.('personalInfo', 'email', value)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="email@example.com"
                  />
                </span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate max-w-xs">
                  <EditableText
                    value={personalInfo.phone}
                    onSave={(value) => onUpdate?.('personalInfo', 'phone', value)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="(555) 123-4567"
                  />
                </span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate max-w-xs">
                  <EditableText
                    value={personalInfo.location}
                    onSave={(value) => onUpdate?.('personalInfo', 'location', value)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="City, State"
                  />
                </span>
              </div>
            )}
            {personalInfo?.linkedIn && (
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <Linkedin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate max-w-xs">
                  <EditableText
                    value={personalInfo.linkedIn}
                    onSave={(value) => onUpdate?.('personalInfo', 'linkedIn', value)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="linkedin.com/in/username"
                  />
                </span>
              </div>
            )}
            {personalInfo?.portfolio && (
              <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="truncate max-w-xs">
                  <EditableText
                    value={personalInfo.portfolio}
                    onSave={(value) => onUpdate?.('personalInfo', 'portfolio', value)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="portfolio.com"
                  />
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Header End Line Separator - Compact */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
      </header>

      {/* Render sections in the specified order with intelligent page breaks for ALL sections */}
      {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
    </div>
  );
};

export default ModernTemplate;
