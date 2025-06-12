
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink, Github } from "lucide-react";
import EditableText from "../EditableText";

interface ModernTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
}

const ModernTemplate = ({ data, onUpdate, isEditing = false }: ModernTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm]">
      {/* Header */}
      <header className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          <EditableText
            value={personalInfo?.fullName || ''}
            onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
            placeholder="Your Name"
            isEditing={isEditing}
            className="inline-block"
          />
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <EditableText
                value={personalInfo.email}
                onSave={(value) => onUpdate?.('personalInfo', 'email', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="email@example.com"
              />
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <EditableText
                value={personalInfo.phone}
                onSave={(value) => onUpdate?.('personalInfo', 'phone', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="Phone number"
              />
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <EditableText
                value={personalInfo.location}
                onSave={(value) => onUpdate?.('personalInfo', 'location', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="City, State"
              />
            </div>
          )}
          {personalInfo?.linkedIn && (
            <div className="flex items-center space-x-2">
              <Linkedin className="w-4 h-4" />
              <EditableText
                value={personalInfo.linkedIn}
                onSave={(value) => onUpdate?.('personalInfo', 'linkedIn', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="LinkedIn URL"
              />
            </div>
          )}
          {personalInfo?.portfolio && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <EditableText
                value={personalInfo.portfolio}
                onSave={(value) => onUpdate?.('personalInfo', 'portfolio', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="Portfolio URL"
              />
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 border-l-4 border-blue-600 pl-4">
            Professional Summary
          </h2>
          <div className="text-gray-700 leading-relaxed">
            <EditableText
              value={personalInfo.summary}
              onSave={(value) => onUpdate?.('personalInfo', 'summary', value)}
              multiline
              isEditing={isEditing}
              className="inline-block w-full"
              placeholder="Professional summary"
            />
          </div>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      <EditableText
                        value={exp.jobTitle || ''}
                        onSave={(value) => onUpdate?.('experience', 'jobTitle', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Job Title"
                      />
                    </h3>
                    <p className="text-lg text-blue-600 font-medium">
                      <EditableText
                        value={exp.company || ''}
                        onSave={(value) => onUpdate?.('experience', 'company', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Company Name"
                      />
                    </p>
                    {exp.location && (
                      <p className="text-gray-600">
                        <EditableText
                          value={exp.location}
                          onSave={(value) => onUpdate?.('experience', 'location', value, index)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="Location"
                        />
                      </p>
                    )}
                  </div>
                  <div className="text-right text-gray-600">
                    <p className="font-medium">
                      <EditableText
                        value={exp.startDate || ''}
                        onSave={(value) => onUpdate?.('experience', 'startDate', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Start Date"
                      />
                      {' - '}
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
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  <EditableText
                    value={exp.description || ''}
                    onSave={(value) => onUpdate?.('experience', 'description', value, index)}
                    multiline
                    isEditing={isEditing}
                    className="inline-block w-full"
                    placeholder="Job description and achievements"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      <EditableText
                        value={project.name || ''}
                        onSave={(value) => onUpdate?.('projects', 'name', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Project Name"
                      />
                    </h3>
                    <div className="flex space-x-4 mt-1">
                      {project.url && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-sm">Live Demo</span>
                        </div>
                      )}
                      {project.github && (
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Github className="w-3 h-3" />
                          <span className="text-sm">GitHub</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div className="text-right text-gray-600">
                      <p className="font-medium text-sm">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-2">
                  <EditableText
                    value={project.description || ''}
                    onSave={(value) => onUpdate?.('projects', 'description', value, index)}
                    multiline
                    isEditing={isEditing}
                    className="inline-block w-full"
                    placeholder="Project description"
                  />
                </div>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.split(',').map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                <div className="flex justify-between items-start">
                  <div>
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
                        placeholder="School Name"
                      />
                    </p>
                    {edu.location && (
                      <p className="text-gray-600">
                        <EditableText
                          value={edu.location}
                          onSave={(value) => onUpdate?.('education', 'location', value, index)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="Location"
                        />
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-gray-600">
                        GPA: <EditableText
                          value={edu.gpa}
                          onSave={(value) => onUpdate?.('education', 'gpa', value, index)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="GPA"
                        />
                      </p>
                    )}
                  </div>
                  <div className="text-gray-600">
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
