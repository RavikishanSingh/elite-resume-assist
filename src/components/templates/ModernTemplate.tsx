import React from 'react';

interface ModernTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
  isPDFMode?: boolean;
  sectionOrder?: string[];
}

const ModernTemplate = ({ data, onUpdate, isEditing = false }: ModernTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data || {};

  return (
    <div id="resume-content" className="resume-wrapper">
      <section className="no-break">
        <h2>{personalInfo?.fullName || 'John Doe'}</h2>
        <p>{personalInfo?.email || 'Frontend Developer'}</p>
      </section>

      <section className="no-break">
        <h3>Experience</h3>
        <ul>
          {experience?.length > 0 ? (
            experience.map((exp: any, index: number) => (
              <li key={index}>{exp.company} – {exp.jobTitle}</li>
            ))
          ) : (
            <li>Company XYZ – React Developer</li>
          )}
        </ul>
      </section>

      <section className="no-break">
        <h3>Education</h3>
        {education?.length > 0 ? (
          education.map((edu: any, index: number) => (
            <p key={index}>{edu.degree} – {edu.school}</p>
          ))
        ) : (
          <p>B.Tech – Computer Engineering</p>
        )}
      </section>
    </div>
  );
};

export default ModernTemplate;