
import EditableText from "../EditableText";

interface MinimalTemplateProps {
  data: any;
  onUpdate?: (section: string, field: string, value: string, index?: number) => void;
  isEditing?: boolean;
}

const MinimalTemplate = ({ data, onUpdate, isEditing = false }: MinimalTemplateProps) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg min-h-[297mm] font-light">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-thin text-gray-900 mb-4 tracking-wide">
          <EditableText
            value={personalInfo?.fullName || ''}
            onSave={(value) => onUpdate?.('personalInfo', 'fullName', value)}
            placeholder="Your Name"
            isEditing={isEditing}
            className="inline-block w-full text-center"
          />
        </h1>
        <div className="flex justify-center space-x-4 text-gray-600 text-sm flex-wrap">
          {personalInfo?.email && (
            <EditableText
              value={personalInfo.email}
              onSave={(value) => onUpdate?.('personalInfo', 'email', value)}
              isEditing={isEditing}
              className="inline-block"
              placeholder="email@example.com"
            />
          )}
          {personalInfo?.phone && personalInfo?.email && <span>•</span>}
          {personalInfo?.phone && (
            <EditableText
              value={personalInfo.phone}
              onSave={(value) => onUpdate?.('personalInfo', 'phone', value)}
              isEditing={isEditing}
              className="inline-block"
              placeholder="Phone number"
            />
          )}
          {personalInfo?.location && (personalInfo?.phone || personalInfo?.email) && <span>•</span>}
          {personalInfo?.location && (
            <EditableText
              value={personalInfo.location}
              onSave={(value) => onUpdate?.('personalInfo', 'location', value)}
              isEditing={isEditing}
              className="inline-block"
              placeholder="City, State"
            />
          )}
        </div>
        {(personalInfo?.linkedIn || personalInfo?.portfolio) && (
          <div className="flex justify-center space-x-4 text-gray-600 text-sm mt-2 flex-wrap">
            {personalInfo?.linkedIn && (
              <EditableText
                value={personalInfo.linkedIn}
                onSave={(value) => onUpdate?.('personalInfo', 'linkedIn', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="LinkedIn URL"
              />
            )}
            {personalInfo?.portfolio && personalInfo?.linkedIn && <span>•</span>}
            {personalInfo?.portfolio && (
              <EditableText
                value={personalInfo.portfolio}
                onSave={(value) => onUpdate?.('personalInfo', 'portfolio', value)}
                isEditing={isEditing}
                className="inline-block"
                placeholder="Portfolio URL"
              />
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <div className="text-gray-700 leading-relaxed text-center italic">
            <EditableText
              value={personalInfo.summary}
              onSave={(value) => onUpdate?.('personalInfo', 'summary', value)}
              multiline
              isEditing={isEditing}
              className="inline-block w-full text-center"
              placeholder="Professional summary"
            />
          </div>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
            EXPERIENCE
          </h2>
          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div key={index} className="text-center mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  <EditableText
                    value={exp.jobTitle || ''}
                    onSave={(value) => onUpdate?.('experience', 'jobTitle', value, index)}
                    isEditing={isEditing}
                    className="inline-block w-full text-center"
                    placeholder="Job Title"
                  />
                </h3>
                <p className="text-gray-700 font-light mb-2">
                  <EditableText
                    value={exp.company || ''}
                    onSave={(value) => onUpdate?.('experience', 'company', value, index)}
                    isEditing={isEditing}
                    className="inline-block w-full text-center"
                    placeholder="Company Name"
                  />
                </p>
                <p className="text-gray-600 text-sm mb-3">
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
                </p>
                <div className="text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                  <EditableText
                    value={exp.description || ''}
                    onSave={(value) => onUpdate?.('experience', 'description', value, index)}
                    multiline
                    isEditing={isEditing}
                    className="inline-block w-full text-center"
                    placeholder="Job description and achievements"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
            PROJECTS
          </h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  <EditableText
                    value={project.name || ''}
                    onSave={(value) => onUpdate?.('projects', 'name', value, index)}
                    isEditing={isEditing}
                    className="inline-block"
                    placeholder="Project Name"
                  />
                </h3>
                <div className="text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line mb-2">
                  <EditableText
                    value={project.description || ''}
                    onSave={(value) => onUpdate?.('projects', 'description', value, index)}
                    multiline
                    isEditing={isEditing}
                    className="inline-block w-full"
                    placeholder="Project description"
                  />
                </div>
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
        {skills?.length > 0 && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
              SKILLS
            </h2>
            <div className="text-center">
              <p className="text-gray-700">
                {skills.filter(skill => skill && skill.trim()).map((skill, index) => (
                  <span key={index} className="inline-block">
                    <EditableText
                      value={skill || ''}
                      onSave={(value) => {
                        const updatedSkills = [...skills];
                        updatedSkills[skills.indexOf(skill)] = value;
                        onUpdate?.('skills', '', updatedSkills.join(','));
                      }}
                      isEditing={isEditing}
                      className="inline-block"
                      placeholder="Skill"
                    />
                    {index < skills.filter(s => s && s.trim()).length - 1 && ' • '}
                  </span>
                ))}
              </p>
            </div>
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h2 className="text-2xl font-thin text-gray-900 mb-6 text-center">
              EDUCATION
            </h2>
            <div className="space-y-3 text-center">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900">
                    <EditableText
                      value={edu.degree || ''}
                      onSave={(value) => onUpdate?.('education', 'degree', value, index)}
                      isEditing={isEditing}
                      className="inline-block"
                      placeholder="Degree"
                    />
                  </h3>
                  <p className="text-gray-700 font-light">
                    <EditableText
                      value={edu.school || ''}
                      onSave={(value) => onUpdate?.('education', 'school', value, index)}
                      isEditing={isEditing}
                      className="inline-block"
                      placeholder="School Name"
                    />
                  </p>
                  <p className="text-gray-600 text-sm">
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
  );
};

export default MinimalTemplate;
