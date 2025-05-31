
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface TechTemplateProps {
  data: any;
}

const TechTemplate = ({ data }: TechTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white p-8 shadow-lg min-h-[297mm]">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {personalInfo?.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Sidebar */}
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
                    {skill}
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
              <p className="text-gray-300 text-sm leading-relaxed">
                {personalInfo.summary}
              </p>
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
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <div className="flex space-x-2">
                        {project.url && (
                          <ExternalLink className="w-4 h-4 text-green-400" />
                        )}
                        {project.github && (
                          <Github className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2 whitespace-pre-line">{project.description}</p>
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
                        <h3 className="font-bold text-white">{exp.jobTitle}</h3>
                        <p className="text-green-400 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-line">{exp.description}</p>
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
                    <h3 className="font-bold text-white">{edu.degree}</h3>
                    <p className="text-green-400 font-medium">{edu.school}</p>
                    <p className="text-gray-400 text-sm">{edu.graduationDate}</p>
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
