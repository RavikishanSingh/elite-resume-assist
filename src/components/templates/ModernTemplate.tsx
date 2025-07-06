import React from 'react';

interface ModernTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
  isPDFMode?: boolean;
  sectionOrder?: string[];
}

const ModernTemplate = ({ data, onUpdate, isEditing = false, isPDFMode = false }: ModernTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data || {};

  return (
    <div className={`resume-wrapper ${isPDFMode ? 'pdf-mode' : ''}`}>
      {/* Header Section */}
      <section className="no-break mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
        <h1 className="text-4xl font-bold mb-2">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <p className="text-xl mb-4 opacity-90">
          {personalInfo?.jobTitle || 'Professional Title'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {personalInfo?.email && (
            <span>📧 {personalInfo.email}</span>
          )}
          {personalInfo?.phone && (
            <span>📱 {personalInfo.phone}</span>
          )}
          {personalInfo?.location && (
            <span>📍 {personalInfo.location}</span>
          )}
        </div>
      </section>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="no-break mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="no-break mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="no-break">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {exp.jobTitle || 'Job Title'}
                    </h3>
                    <p className="text-lg font-semibold text-blue-600">
                      {exp.company || 'Company Name'}
                    </p>
                  </div>
                  <span className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line ml-4 border-l-4 border-blue-200 pl-4">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Skills */}
        {skills?.length > 0 && (
          <section className="no-break">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section className="no-break">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-gray-900">
                    {edu.degree || 'Degree'}
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    {edu.school || 'School Name'}
                  </p>
                  <p className="text-gray-600">
                    {edu.graduationDate || 'Graduation Date'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="no-break">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
            Key Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="no-break border-l-4 border-blue-200 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {project.name || 'Project Name'}
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-2">
                  {project.description}
                </p>
                {project.technologies && (
                  <p className="text-blue-600 font-medium text-sm">
                    Technologies: {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate;