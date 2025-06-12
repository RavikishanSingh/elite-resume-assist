import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import EditableText from "../EditableText";

interface CreativeTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
}

const CreativeTemplate = ({ data, onUpdate, isEditing = false }: CreativeTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm]">
      {/* Header with Creative Design */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-8">
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
                placeholder="123-456-7890"
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
                placeholder="City, State"
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
                placeholder="linkedin.com/in/username"
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
                placeholder="portfolio.com"
              />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Summary */}
          {personalInfo?.summary && (
            <section>
              <h2 className="text-lg font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">
                About Me
              </h2>
              <div className="text-gray-700 text-sm leading-relaxed">
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

          {/* Skills */}
          {skills?.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-purple-600 mb-3 border-b-2 border-purple-200 pb-1">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill: string, index: number) => (
                  <div key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
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
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {experience?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-4 border-b-2 border-purple-200 pb-2">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-purple-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-4 border-b-2 border-purple-200 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.split(',').map((tech: string, i: number) => (
                          <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
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
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-4 border-b-2 border-purple-200 pb-2">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600 font-medium">{edu.school}</p>
                    <p className="text-gray-600 text-sm">{edu.graduationDate}</p>
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

export default CreativeTemplate;
