
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ExecutiveTemplateProps {
  data: any;
}

const ExecutiveTemplate = ({ data }: ExecutiveTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm]">
      {/* Header with Executive Style */}
      <header className="border-b-4 border-gray-800 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {personalInfo?.fullName || 'Your Name'}
            </h1>
            <div className="space-y-1 text-gray-600">
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
            </div>
          </div>
          <div className="text-right text-gray-600">
            {personalInfo?.location && (
              <div className="flex items-center space-x-2 justify-end">
                <MapPin className="w-4 h-4" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.linkedIn && (
              <div className="flex items-center space-x-2 justify-end mt-1">
                <Linkedin className="w-4 h-4" />
                <span>{personalInfo.linkedIn}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Core Competencies */}
      {skills?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {skills.map((skill: string, index: number) => (
              <div key={index} className="text-gray-700 font-medium">
                • {skill}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-gray-600 font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-3">{exp.company}</p>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-gray-300">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Key Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project: any, index: number) => (
              <div key={index} className="border-l-4 border-gray-800 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
                {project.technologies && (
                  <p className="text-gray-600 mt-2 font-medium">
                    Technologies: {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 font-medium">{edu.school}</p>
                </div>
                <span className="text-gray-600 font-medium">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
