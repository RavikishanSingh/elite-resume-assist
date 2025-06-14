
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import EditableText from "../EditableText";

interface ModernTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
}

const ModernTemplate = ({ data, onUpdate, isEditing = false }: ModernTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="w-full bg-white text-gray-800 px-12 py-10" style={{ 
      fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      maxWidth: '210mm',
      minHeight: '297mm',
      margin: '0 auto'
    }}>
      {/* Professional Header with Improved Spacing and Line Separator */}
      <header className="pb-8 mb-10" style={{ pageBreakInside: 'avoid' }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
            <EditableText
              value={personalInfo?.fullName || ''}
              onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
              placeholder="Your Full Name"
              isEditing={isEditing}
              className="inline-block"
            />
          </h1>
          
          {/* Primary Contact Information - Better Spaced with Safe Margins */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-base text-gray-600 mb-6 px-4 max-w-4xl mx-auto">
            {personalInfo?.email && (
              <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
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
              <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
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
              <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
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
          </div>
          
          {/* Secondary Contact Information - Web Links with Better Spacing and Safe Margins */}
          {(personalInfo?.linkedIn || personalInfo?.portfolio) && (
            <div className="flex flex-wrap justify-center items-center gap-8 text-base text-gray-600 mb-8 px-4 max-w-4xl mx-auto">
              {personalInfo?.linkedIn && (
                <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-blue-600 flex-shrink-0" />
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
                <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
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
          )}
        </div>
        
        {/* Header End Line Separator with Safe Margins */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto" style={{ maxWidth: 'calc(100% - 2rem)' }}></div>
      </header>

      {/* Professional Summary */}
      {personalInfo?.summary && (
        <section className="mb-10 px-2" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-600 mr-3"></div>
            Professional Summary
          </h2>
          <div className="text-gray-700 leading-relaxed pl-5 pr-2">
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
      )}

      {/* Professional Experience */}
      {experience?.length > 0 && (
        <section className="mb-10 px-2">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center" style={{ pageBreakAfter: 'avoid' }}>
            <div className="w-2 h-6 bg-blue-600 mr-3"></div>
            Professional Experience
          </h2>
          <div className="space-y-8 pl-5 pr-2">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="relative" style={{ pageBreakInside: 'avoid', orphans: 3, widows: 3 }}>
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <EditableText
                        value={exp.jobTitle || ''}
                        onSave={(value) => onUpdate?.('experience', 'jobTitle', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Job Title"
                      />
                    </h3>
                    <p className="text-blue-600 font-medium">
                      <EditableText
                        value={exp.company || ''}
                        onSave={(value) => onUpdate?.('experience', 'company', value, index)}
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
                        onSave={(value) => onUpdate?.('experience', 'startDate', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Start Date"
                      />
                      {' – '}
                      {exp.current ? 'Present' : (
                        <EditableText
                          value={exp.endDate || ''}
                          onSave={(value) => onUpdate?.('experience', 'endDate', value, index)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="End Date"
                        />
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm pr-2">
                  <EditableText
                    value={exp.description || ''}
                    onSave={(value) => onUpdate?.('experience', 'description', value, index)}
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
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-10 px-2" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-600 mr-3"></div>
            Core Competencies
          </h2>
          <div className="pl-5 pr-2">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                >
                  <EditableText
                    value={skill || ''}
                    onSave={(value) => {
                      const updatedSkills = [...skills];
                      updatedSkills[index] = value;
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
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-10 px-2">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center" style={{ pageBreakAfter: 'avoid' }}>
            <div className="w-2 h-6 bg-blue-600 mr-3"></div>
            Key Projects
          </h2>
          <div className="space-y-6 pl-5 pr-2">
            {projects.map((project: any, index: number) => (
              <div key={index} style={{ pageBreakInside: 'avoid', orphans: 2, widows: 2 }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <EditableText
                    value={project.name || ''}
                    onSave={(value) => onUpdate?.('projects', 'name', value, index)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="Project Name"
                  />
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm mb-2 pr-2">
                  <EditableText
                    value={project.description || ''}
                    onSave={(value) => onUpdate?.('projects', 'description', value, index)}
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
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-6 px-2" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center">
            <div className="w-2 h-6 bg-blue-600 mr-3"></div>
            Education
          </h2>
          <div className="space-y-4 pl-5 pr-2">
            {education.map((edu: any, index: number) => (
              <div key={index} className="flex justify-between items-start flex-wrap gap-2" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <EditableText
                      value={edu.degree || ''}
                      onSave={(value) => onUpdate?.('education', 'degree', value, index)}
                      isEditing={isEditing}
                      className="inline-block"
                      placeholder="Degree"
                    />
                  </h3>
                  <p className="text-blue-600 font-medium">
                    <EditableText
                      value={edu.school || ''}
                      onSave={(value) => onUpdate?.('education', 'school', value, index)}
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
                      onSave={(value) => onUpdate?.('education', 'graduationDate', value, index)}
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
      )}
    </div>
  );
};

export default ModernTemplate;
