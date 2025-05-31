
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink, Github } from "lucide-react";

interface ModernTemplateProps {
  data: any;
}

const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm]">
      {/* Header */}
      <header className="border-b-4 border-blue-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo?.linkedIn && (
            <div className="flex items-center space-x-2">
              <Linkedin className="w-4 h-4" />
              <span>{personalInfo.linkedIn}</span>
            </div>
          )}
          {personalInfo?.portfolio && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{personalInfo.portfolio}</span>
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
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
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
                    <h3 className="text-xl font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600">{exp.location}</p>}
                  </div>
                  <div className="text-right text-gray-600">
                    <p className="font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {exp.description}
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
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
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
                  {project.description}
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
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.school}</p>
                    {edu.location && <p className="text-gray-600">{edu.location}</p>}
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-gray-600">
                    <p className="font-medium">{edu.graduationDate}</p>
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
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;
