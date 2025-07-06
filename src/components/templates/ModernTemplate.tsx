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

  // Helper function to check if data exists and is not empty
  const hasData = (value: any) => {
    if (Array.isArray(value)) return value && value.length > 0;
    return value && value.toString().trim() !== '';
  };

  return (
    <div className={`resume-wrapper ${isPDFMode ? 'pdf-mode' : ''}`}>
      {/* Header Section */}
      <section className="no-break mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg">
        <h1 className="text-4xl font-bold mb-2">
          {hasData(personalInfo?.fullName) ? personalInfo.fullName : 'Your Name'}
        </h1>
        <p className="text-xl mb-4 opacity-90">
          {hasData(personalInfo?.jobTitle) ? personalInfo.jobTitle : 'Professional Title'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {hasData(personalInfo?.email) && (
            <span>📧 {personalInfo.email}</span>
          )}
          {hasData(personalInfo?.phone) && (
            <span>📱 {personalInfo.phone}</span>
          )}
          {hasData(personalInfo?.location) && (
            <span>📍 {personalInfo.location}</span>
          )}
          {hasData(personalInfo?.linkedIn) && (
            <span>🔗 LinkedIn</span>
          )}
          {hasData(personalInfo?.portfolio) && (
            <span>🌐 Portfolio</span>
          )}
        </div>
      </section>

      {/* Summary */}
      {hasData(personalInfo?.summary) && (
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
      {hasData(experience) && (
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
                      {hasData(exp.jobTitle) ? exp.jobTitle : 'Job Title'}
                    </h3>
                    <p className="text-lg font-semibold text-blue-600">
                      {hasData(exp.company) ? exp.company : 'Company Name'}
                    </p>
                  </div>
                  <span className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded">
                    {hasData(exp.startDate) ? exp.startDate : 'Start'} - {exp.current ? 'Present' : (hasData(exp.endDate) ? exp.endDate : 'End')}
                  </span>
                </div>
                {hasData(exp.description) && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line ml-4 border-l-4 border-blue-200 pl-4">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Skills */}
        {hasData(skills) && (
          <section className="no-break">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.filter(skill => hasData(skill)).map((skill: string, index: number) => (
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
        {hasData(education) && (
          <section className="no-break">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-gray-900">
                    {hasData(edu.degree) ? edu.degree : 'Degree'}
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    {hasData(edu.school) ? edu.school : 'School Name'}
                  </p>
                  {hasData(edu.graduationDate) && (
                    <p className="text-gray-600">
                      {edu.graduationDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {hasData(projects) && (
        <section className="no-break">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
            Key Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="no-break border-l-4 border-blue-200 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {hasData(project.name) ? project.name : 'Project Name'}
                </h3>
                {hasData(project.description) && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-2">
                    {project.description}
                  </p>
                )}
                {hasData(project.technologies) && (
                  <p className="text-blue-600 font-medium text-sm">
                    Technologies: {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State Message */}
      {!hasData(personalInfo?.fullName) && !hasData(experience) && !hasData(education) && !hasData(skills) && !hasData(projects) && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Complete the previous steps to see your resume preview here.</p>
          <p className="text-sm mt-2">Your information will appear as you fill out each section.</p>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;