
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink, Github } from "lucide-react";

interface ClassicTemplateProps {
  data: any;
}

const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm]">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-300 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo?.linkedIn && (
            <div className="flex items-center space-x-1">
              <Linkedin className="w-4 h-4" />
              <span>{personalInfo.linkedIn}</span>
            </div>
          )}
          {personalInfo?.portfolio && (
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>{personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-300 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-gray-600 italic">{exp.location}</p>}
                  </div>
                  <div className="text-right text-gray-600">
                    <p className="font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mt-2">
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-300 pb-2">
            Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex space-x-4 mt-1">
                      {project.url && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-sm">Live Demo</span>
                        </div>
                      )}
                      {project.github && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Github className="w-3 h-3" />
                          <span className="text-sm">GitHub</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div className="text-right text-gray-600">
                      <p className="font-medium">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mt-2">
                  {project.description}
                </div>
                {project.technologies && (
                  <div className="mt-2">
                    <span className="text-gray-600 font-medium">Technologies: </span>
                    <span className="text-gray-700">{project.technologies}</span>
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-300 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.school}</p>
                    {edu.location && <p className="text-gray-600 italic">{edu.location}</p>}
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-300 pb-2">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.map((skill: string, index: number) => (
              <div key={index} className="text-gray-700">
                • {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
