import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import EditableText from "../EditableText";

interface TechTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
}

const TechTemplate = ({ data, onUpdate, isEditing = false }: TechTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white p-8 shadow-lg min-h-[297mm]">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <EditableText
            value={personalInfo?.fullName || ''}
            onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
            placeholder="Your Name"
            isEditing={isEditing}
            className="inline-block text-white"
          />
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {personalInfo?.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <EditableText
                value={personalInfo.email}
                onSave={(value) => onUpdate?.('personalInfo', 'email', value)}
                isEditing={isEditing}
                className="inline-block text-white"
                placeholder="email@example.com"
              />
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <EditableText
                value={personalInfo.phone}
                onSave={(value) => onUpdate?.('personalInfo', 'phone', value)}
                isEditing={isEditing}
                className="inline-block text-white"
                placeholder="Phone number"
              />
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <EditableText
                value={personalInfo.location}
                onSave={(value) => onUpdate?.('personalInfo', 'location', value)}
                isEditing={isEditing}
                className="inline-block text-white"
                placeholder="Location"
              />
            </div>
          )}
          {personalInfo?.linkedIn && (
            <div className="flex items-center space-x-1">
              <Linkedin className="w-3 h-3" />
              <EditableText
                value={personalInfo.linkedIn}
                onSave={(value) => onUpdate?.('personalInfo', 'linkedIn', value)}
                isEditing={isEditing}
                className="inline-block text-white"
                placeholder="LinkedIn"
              />
            </div>
          )}
          {personalInfo?.portfolio && (
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <EditableText
                value={personalInfo.portfolio}
                onSave={(value) => onUpdate?.('personalInfo', 'portfolio', value)}
                isEditing={isEditing}
                className="inline-block text-white"
                placeholder="Portfolio"
              />
            </div>
          )}
        </div>
      </header>

      {/* Left Sidebar */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          {/* Tech Stack */}
          {skills?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-green-400 mb-3 border-b border-green-400 pb-1">
                <span className="flex items-center space-x-2">
                  <span>{'</>'}</span>
                  <span>Tech Stack</span>
                </span>
              </h2>
              <div className="space-y-2">
                {skills.map((skill: string, index: number) => (
                  <div key={index} className="bg-gray-800 border border-green-400 px-3 py-1 rounded text-sm font-mono">
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
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Summary */}
          {personalInfo?.summary && (
            <section>
              <h2 className="text-lg font-bold text-green-400 mb-3 border-b border-green-400 pb-1">
                About
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed">
                <EditableText
                  value={personalInfo.summary}
                  onSave={(value) => onUpdate?.('personalInfo', 'summary', value)}
                  multiline
                  isEditing={isEditing}
                  className="inline-block w-full"
                  placeholder="Summary"
                />
              </div>
            </section>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Projects */}
          {projects?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-green-400 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project: any, index: number) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">
                        <EditableText
                          value={project.name || ''}
                          onSave={(value) => onUpdate?.('projects', 'name', value, index)}
                          isEditing={isEditing}
                          className="inline-block"
                          placeholder="Project Name"
                        />
                      </h3>
                      <div className="flex space-x-2">
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm mb-2 whitespace-pre-line">
                      <EditableText
                        value={project.description || ''}
                        onSave={(value) => onUpdate?.('projects', 'description', value, index)}
                        multiline
                        isEditing={isEditing}
                        className="inline-block w-full"
                        placeholder="Project Description"
                      />
                    </div>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.split(',').map((tech: string, i: number) => (
                          <span key={i} className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-mono">
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

          {/* Experience */}
          {experience?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-green-400 pb-2">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp: any, index: number) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">
                          <EditableText
                            value={exp.jobTitle || ''}
                            onSave={(value) => onUpdate?.('experience', 'jobTitle', value, index)}
                            isEditing={isEditing}
                            className="inline-block"
                            placeholder="Job Title"
                          />
                        </h3>
                        <p className="text-green-400 font-medium">
                          <EditableText
                            value={exp.company || ''}
                            onSave={(value) => onUpdate?.('experience', 'company', value, index)}
                            isEditing={isEditing}
                            className="inline-block"
                            placeholder="Company Name"
                          />
                        </p>
                      </div>
                      <span className="text-gray-400 text-sm">
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
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm whitespace-pre-line">
                      <EditableText
                        value={exp.description || ''}
                        onSave={(value) => onUpdate?.('experience', 'description', value, index)}
                        multiline
                        isEditing={isEditing}
                        className="inline-block w-full"
                        placeholder="Job Description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-green-400 mb-4 border-b border-green-400 pb-2">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                    <h3 className="font-bold text-white">
                      <EditableText
                        value={edu.degree || ''}
                        onSave={(value) => onUpdate?.('education', 'degree', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Degree"
                      />
                    </h3>
                    <p className="text-green-400 font-medium">
                      <EditableText
                        value={edu.school || ''}
                        onSave={(value) => onUpdate?.('education', 'school', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="School Name"
                      />
                    </p>
                    <p className="text-gray-400 text-sm">
                      <EditableText
                        value={edu.graduationDate || ''}
                        onSave={(value) => onUpdate?.('education', 'graduationDate', value, index)}
                        isEditing={isEditing}
                        className="inline-block"
                        placeholder="Graduation Date"
                      />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechTemplate;
