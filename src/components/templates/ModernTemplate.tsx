
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
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm]">
      {/* Enhanced Header with Better Layout */}
      <header className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <EditableText
            value={personalInfo?.fullName || ''}
            onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
            placeholder="Your Name"
            isEditing={isEditing}
            className="inline-block"
          />
        </h1>
        
        {/* Enhanced Contact Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 flex-shrink-0" />
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
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 flex-shrink-0" />
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
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
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
            <div className="flex items-center space-x-3">
              <Linkedin className="w-4 h-4 flex-shrink-0" />
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
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 flex-shrink-0" />
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

      {/* Enhanced Summary Section */}
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

      {/* Enhanced Experience Section */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
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
                  </div>
                  <div className="text-right text-gray-600 ml-4">
                    <p className="font-medium whitespace-nowrap">
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
                    placeholder="Job description"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Enhanced Projects Section */}
      {projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-1"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <EditableText
                    value={project.name || ''}
                    onSave={(value) => onUpdate?.('projects', 'name', value, index)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="Project Name"
                  />
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">
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
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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

      {/* Enhanced Education Section */}
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
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                  </div>
                  <div className="text-gray-600 ml-4">
                    <p className="font-medium whitespace-nowrap">
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

      {/* Enhanced Skills Section */}
      {skills?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-l-4 border-blue-600 pl-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
