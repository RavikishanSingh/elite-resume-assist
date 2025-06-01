
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface MinimalTemplateProps {
  data: any;
}

const MinimalTemplate = ({ data }: MinimalTemplateProps) => {
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
            {personalInfo?.fullName || 'Your Name'}
          </h1>
          <div className="flex justify-center space-x-4 text-gray-600 text-sm">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>•</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>•</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
          {(personalInfo?.linkedIn || personalInfo?.portfolio) && (
            <div className="flex justify-center space-x-4 text-gray-600 text-sm mt-2">
              {personalInfo?.linkedIn && <span>{personalInfo.linkedIn}</span>}
              {personalInfo?.portfolio && personalInfo?.linkedIn && <span>•</span>}
              {personalInfo?.portfolio && <span>{personalInfo.portfolio}</span>}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed text-center italic">
            {personalInfo.summary}
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
                <h3 className="text-lg font-medium text-gray-900">{exp.jobTitle}</h3>
                <p className="text-gray-700 font-light">{exp.company}</p>
                <p className="text-gray-600 text-sm mb-3">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                  {exp.description}
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
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line mb-2">
                  {project.description}
                </p>
                {project.technologies && (
                  <p className="text-gray-600 text-sm">
                    Technologies: {project.technologies}
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
                {skills.filter(skill => skill.trim()).join(' • ')}
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
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700 font-light">{edu.school}</p>
                  <p className="text-gray-600 text-sm">
                    {edu.current ? 'Currently Pursuing' : edu.graduationDate}
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
