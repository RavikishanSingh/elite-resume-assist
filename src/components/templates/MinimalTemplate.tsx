
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import EditableText from "../EditableText";

interface MinimalTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
}

const MinimalTemplate = ({ data, onUpdate, isEditing = false }: MinimalTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  // Helper function to check if a section has content
  const hasContent = (section: any[] | undefined) => {
    return section && section.length > 0 && section.some(item => 
      Object.values(item).some(value => value && String(value).trim() !== '')
    );
  };

  const hasPersonalInfo = personalInfo && (
    personalInfo.fullName || personalInfo.email || personalInfo.phone || 
    personalInfo.location || personalInfo.linkedIn || personalInfo.portfolio || personalInfo.summary
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm] font-light">
      {/* Header */}
      {hasPersonalInfo && (
        <header className="text-center mb-8">
          <h1 className="text-5xl font-thin text-gray-900 mb-4 tracking-wide">
            <EditableText
              value={personalInfo?.fullName || ''}
              onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
              placeholder="Your Name"
              isEditing={isEditing}
            />
          </h1>
          <div className="flex justify-center space-x-4 text-gray-600 text-sm">
            {personalInfo?.email && (
              <EditableText
                value={personalInfo.email}
                onSave={(value) => onUpdate?.('personalInfo', 'email', value)}
                isEditing={isEditing}
              />
            )}
            {personalInfo?.phone && <span>•</span>}
            {personalInfo?.phone && (
              <EditableText
                value={personalInfo.phone}
                onSave={(value) => onUpdate?.('personalInfo', 'phone', value)}
                isEditing={isEditing}
              />
            )}
            {personalInfo?.location && <span>•</span>}
            {personalInfo?.location && (
              <EditableText
                value={personalInfo.location}
                onSave={(value) => onUpdate?.('personalInfo', 'location', value)}
                isEditing={isEditing}
              />
            )}
          </div>
          {(personalInfo?.linkedIn || personalInfo?.portfolio) && (
            <div className="flex justify-center space-x-4 text-gray-600 text-sm mt-2">
              {personalInfo?.linkedIn && (
                <EditableText
                  value={personalInfo.linkedIn}
                  onSave={(value) => onUpdate?.('personalInfo', 'linkedIn', value)}
                  isEditing={isEditing}
                />
              )}
              {personalInfo?.portfolio && personalInfo?.linkedIn && <span>•</span>}
              {personalInfo?.portfolio && (
                <EditableText
                  value={personalInfo.portfolio}
                  onSave={(value) => onUpdate?.('personalInfo', 'portfolio', value)}
                  isEditing={isEditing}
                />
              )}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed text-center italic">
            <EditableText
              value={personalInfo.summary}
              onSave={(value) => onUpdate?.('personalInfo', 'summary', value)}
              multiline
              isEditing={isEditing}
            />
          </p>
        </section>
      )}

      {/* Experience */}
      {hasContent(experience) && (
        <section className="mb-8">
          <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
            EXPERIENCE
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  <EditableText
                    value={exp.jobTitle}
                    onSave={(value) => onUpdate?.('experience', 'jobTitle', value, index)}
                    isEditing={isEditing}
                  />
                </h3>
                <p className="text-gray-700 font-light">
                  <EditableText
                    value={exp.company}
                    onSave={(value) => onUpdate?.('experience', 'company', value, index)}
                    isEditing={isEditing}
                  />
                </p>
                <p className="text-gray-600 text-sm mb-3">
                  <EditableText
                    value={exp.startDate}
                    onSave={(value) => onUpdate?.('experience', 'startDate', value, index)}
                    isEditing={isEditing}
                  />
                  {' - '}
                  {exp.current ? 'Present' : (
                    <EditableText
                      value={exp.endDate}
                      onSave={(value) => onUpdate?.('experience', 'endDate', value, index)}
                      isEditing={isEditing}
                    />
                  )}
                </p>
                <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                  <EditableText
                    value={exp.description}
                    onSave={(value) => onUpdate?.('experience', 'description', value, index)}
                    multiline
                    isEditing={isEditing}
                  />
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasContent(projects) && (
        <section className="mb-8">
          <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
            PROJECTS
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  <EditableText
                    value={project.name}
                    onSave={(value) => onUpdate?.('projects', 'name', value, index)}
                    isEditing={isEditing}
                  />
                </h3>
                <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line mb-2">
                  <EditableText
                    value={project.description}
                    onSave={(value) => onUpdate?.('projects', 'description', value, index)}
                    multiline
                    isEditing={isEditing}
                  />
                </p>
                {project.technologies && (
                  <p className="text-gray-600 text-sm">
                    Technologies: <EditableText
                      value={project.technologies}
                      onSave={(value) => onUpdate?.('projects', 'technologies', value, index)}
                      isEditing={isEditing}
                    />
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skills?.length > 0 && skills.some(skill => skill.trim()) && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
              SKILLS
            </h2>
            <div className="text-center">
              <p className="text-gray-700">
                {skills.filter(skill => skill.trim()).map((skill, index) => (
                  <span key={index}>
                    <EditableText
                      value={skill}
                      onSave={(value) => {
                        const updatedSkills = [...skills];
                        updatedSkills[index] = value;
                        onUpdate?.('skills', '', updatedSkills.join(','));
                      }}
                      isEditing={isEditing}
                    />
                    {index < skills.filter(s => s.trim()).length - 1 && ' • '}
                  </span>
                ))}
              </p>
            </div>
          </section>
        )}

        {hasContent(education) && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
              EDUCATION
            </h2>
            <div className="space-y-3 text-center">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900">
                    <EditableText
                      value={edu.degree}
                      onSave={(value) => onUpdate?.('education', 'degree', value, index)}
                      isEditing={isEditing}
                    />
                  </h3>
                  <p className="text-gray-700 font-light">
                    <EditableText
                      value={edu.school}
                      onSave={(value) => onUpdate?.('education', 'school', value, index)}
                      isEditing={isEditing}
                    />
                  </p>
                  <p className="text-gray-600 text-sm">
                    {edu.current ? 'Currently Pursuing' : (
                      <EditableText
                        value={edu.graduationDate}
                        onSave={(value) => onUpdate?.('education', 'graduationDate', value, index)}
                        isEditing={isEditing}
                      />
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
