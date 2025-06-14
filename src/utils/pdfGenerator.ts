
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Generating Template-Accurate PDF ===');
  console.log('Template:', templateName);
  console.log('Data:', data);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;

    // Helper functions
    const setTextColor = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      pdf.setTextColor(r, g, b);
    };

    const setFillColor = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      pdf.setFillColor(r, g, b);
    };

    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (!text || text.trim() === '') return y;
      
      pdf.setFontSize(options.fontSize || 10);
      pdf.setFont('helvetica', options.fontStyle || 'normal');
      
      if (options.color) {
        setTextColor(options.color);
      } else {
        pdf.setTextColor(0, 0, 0);
      }
      
      const maxWidth = options.maxWidth || (pageWidth - 2 * margin);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      if (y + (lines.length * 6) > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      
      if (options.align === 'center') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - textWidth) / 2, y + (index * 6));
        });
      } else if (options.align === 'right') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, pageWidth - margin - textWidth, y + (index * 6));
        });
      } else {
        pdf.text(lines, x, y);
      }
      
      return y + (lines.length * 6) + 3;
    };

    // Template-specific rendering
    switch (templateName) {
      case 'modern':
        // Modern Template - Clean blue theme
        currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
          fontSize: 24,
          fontStyle: 'bold',
          color: '#1f2937'
        });
        
        // Blue line
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(2);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        // Contact info in one line
        const modernContact = [];
        if (data.personalInfo?.email) modernContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) modernContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) modernContact.push(data.personalInfo.location);
        
        if (modernContact.length > 0) {
          currentY = addText(modernContact.join(' • '), margin, currentY, {
            fontSize: 9,
            color: '#6b7280'
          });
        }

        // Summary section
        if (data.personalInfo?.summary) {
          currentY += 6;
          currentY = addText('PROFESSIONAL SUMMARY', margin, currentY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: '#2563eb'
          });
          pdf.setDrawColor(37, 99, 235);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 4;
          currentY = addText(data.personalInfo.summary, margin, currentY, {
            fontSize: 10,
            color: '#374151'
          });
        }

        // Experience
        if (data.experience?.length > 0) {
          currentY += 6;
          currentY = addText('PROFESSIONAL EXPERIENCE', margin, currentY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: '#2563eb'
          });
          pdf.setDrawColor(37, 99, 235);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 4;
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, margin, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: '#1f2937'
              });
              
              const expDate = `${exp.company} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
              currentY = addText(expDate, margin, currentY, {
                fontSize: 10,
                color: '#2563eb'
              });
              
              if (exp.description) {
                currentY = addText(exp.description, margin + 5, currentY, {
                  fontSize: 9,
                  color: '#4b5563'
                });
              }
              currentY += 4;
            }
          });
        }
        break;

      case 'creative':
        // Creative Template - Purple gradient header
        setFillColor('#9333ea');
        pdf.rect(0, 0, pageWidth, 35, 'F');
        
        currentY = addText(data.personalInfo?.fullName || '', margin, 20, {
          fontSize: 22,
          fontStyle: 'bold',
          color: '#ffffff'
        });
        
        const creativeContact = [];
        if (data.personalInfo?.email) creativeContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) creativeContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) creativeContact.push(data.personalInfo.location);
        
        if (creativeContact.length > 0) {
          addText(creativeContact.join(' • '), margin, 28, {
            fontSize: 8,
            color: '#ffffff'
          });
        }
        
        currentY = 45;

        // Two-column layout simulation
        const leftColumnWidth = (pageWidth - 3 * margin) * 0.35;
        const rightColumnX = margin + leftColumnWidth + 10;
        
        // Left column - About Me
        let leftY = currentY;
        if (data.personalInfo?.summary) {
          leftY = addText('ABOUT ME', margin, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: '#9333ea'
          });
          leftY = addText(data.personalInfo.summary, margin, leftY, {
            fontSize: 9,
            maxWidth: leftColumnWidth,
            color: '#374151'
          });
        }
        
        // Left column - Skills
        if (data.skills?.length > 0) {
          leftY += 8;
          leftY = addText('SKILLS', margin, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: '#9333ea'
          });
          data.skills.forEach((skill: string) => {
            if (skill && skill.trim()) {
              leftY = addText(`• ${skill}`, margin, leftY, {
                fontSize: 9,
                maxWidth: leftColumnWidth,
                color: '#7c3aed'
              });
            }
          });
        }
        
        // Right column - Experience
        let rightY = currentY;
        if (data.experience?.length > 0) {
          rightY = addText('EXPERIENCE', rightColumnX, rightY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: '#9333ea'
          });
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              rightY = addText(exp.jobTitle, rightColumnX, rightY, {
                fontSize: 11,
                fontStyle: 'bold',
                maxWidth: pageWidth - rightColumnX - margin,
                color: '#1f2937'
              });
              
              rightY = addText(exp.company, rightColumnX, rightY, {
                fontSize: 10,
                maxWidth: pageWidth - rightColumnX - margin,
                color: '#9333ea'
              });
              
              if (exp.description) {
                rightY = addText(exp.description, rightColumnX, rightY, {
                  fontSize: 9,
                  maxWidth: pageWidth - rightColumnX - margin,
                  color: '#4b5563'
                });
              }
              rightY += 4;
            }
          });
        }
        break;

      case 'classic':
        // Classic Template - Centered header
        currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
          fontSize: 22,
          fontStyle: 'bold',
          color: '#1f2937',
          align: 'center'
        });
        
        const classicContact = [];
        if (data.personalInfo?.email) classicContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) classicContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) classicContact.push(data.personalInfo.location);
        
        if (classicContact.length > 0) {
          currentY = addText(classicContact.join(' • '), pageWidth / 2, currentY, {
            fontSize: 10,
            color: '#6b7280',
            align: 'center'
          });
        }
        
        // Traditional line
        pdf.setDrawColor(209, 213, 219);
        pdf.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
        currentY += 10;

        if (data.personalInfo?.summary) {
          currentY = addText('PROFESSIONAL SUMMARY', margin, currentY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: '#1f2937'
          });
          pdf.setDrawColor(75, 85, 99);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 4;
          currentY = addText(data.personalInfo.summary, margin, currentY, {
            fontSize: 10,
            color: '#374151'
          });
        }
        break;

      case 'minimal':
        // Minimal Template - Centered, clean
        currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
          fontSize: 28,
          fontStyle: 'normal',
          color: '#1f2937',
          align: 'center'
        });
        
        currentY += 4;
        
        const minimalContact = [];
        if (data.personalInfo?.email) minimalContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) minimalContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) minimalContact.push(data.personalInfo.location);
        
        if (minimalContact.length > 0) {
          currentY = addText(minimalContact.join(' • '), pageWidth / 2, currentY, {
            fontSize: 9,
            color: '#6b7280',
            align: 'center'
          });
        }
        
        currentY += 8;

        if (data.personalInfo?.summary) {
          currentY = addText(data.personalInfo.summary, pageWidth / 2, currentY, {
            fontSize: 10,
            color: '#374151',
            align: 'center'
          });
          currentY += 8;
        }

        if (data.experience?.length > 0) {
          currentY = addText('EXPERIENCE', pageWidth / 2, currentY, {
            fontSize: 16,
            fontStyle: 'bold',
            color: '#1f2937',
            align: 'center'
          });
          currentY += 6;
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, pageWidth / 2, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: '#1f2937',
                align: 'center'
              });
              
              currentY = addText(exp.company, pageWidth / 2, currentY, {
                fontSize: 10,
                color: '#6b7280',
                align: 'center'
              });
              
              const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
              currentY = addText(dateText, pageWidth / 2, currentY, {
                fontSize: 9,
                color: '#9ca3af',
                align: 'center'
              });
              
              if (exp.description) {
                currentY = addText(exp.description, margin, currentY, {
                  fontSize: 9,
                  color: '#4b5563'
                });
              }
              currentY += 8;
            }
          });
        }
        break;

      case 'executive':
        // Executive Template - Bold and professional
        currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
          fontSize: 26,
          fontStyle: 'bold',
          color: '#1f2937'
        });
        
        // Heavy underline
        pdf.setDrawColor(31, 41, 55);
        pdf.setLineWidth(3);
        pdf.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
        currentY += 10;

        // Contact split left/right
        if (data.personalInfo?.email) {
          addText(`Email: ${data.personalInfo.email}`, margin, currentY, {
            fontSize: 10,
            color: '#4b5563'
          });
        }
        
        if (data.personalInfo?.phone) {
          addText(`Phone: ${data.personalInfo.phone}`, pageWidth - margin, currentY, {
            fontSize: 10,
            color: '#4b5563',
            align: 'right'
          });
        }
        
        currentY += 8;

        if (data.personalInfo?.summary) {
          currentY = addText('EXECUTIVE SUMMARY', margin, currentY, {
            fontSize: 16,
            fontStyle: 'bold',
            color: '#1f2937'
          });
          pdf.setDrawColor(31, 41, 55);
          pdf.setLineWidth(1);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 4;
          currentY = addText(data.personalInfo.summary, margin, currentY, {
            fontSize: 11,
            color: '#374151'
          });
        }
        break;

      case 'tech':
        // Tech Template - Green accents, structured
        currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
          fontSize: 24,
          fontStyle: 'bold',
          color: '#1f2937'
        });
        
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(2);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;

        if (data.personalInfo?.email) {
          currentY = addText(`> ${data.personalInfo.email}`, margin, currentY, {
            fontSize: 9,
            color: '#059669'
          });
        }
        
        if (data.personalInfo?.phone) {
          currentY = addText(`> ${data.personalInfo.phone}`, margin, currentY, {
            fontSize: 9,
            color: '#059669'
          });
        }
        
        currentY += 4;
        break;

      default:
        // Fallback to modern
        currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
          fontSize: 24,
          fontStyle: 'bold'
        });
    }

    // Common sections for all templates except creative and minimal
    if (!['creative', 'minimal'].includes(templateName)) {
      // Skills
      if (data.skills?.length > 0 && data.skills.some((skill: string) => skill && skill.trim())) {
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        currentY += 6;
        const skillsColor = templateName === 'tech' ? '#10b981' : '#2563eb';
        currentY = addText('SKILLS', margin, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: skillsColor
        });
        pdf.setDrawColor(templateName === 'tech' ? 16 : 37, templateName === 'tech' ? 185 : 99, templateName === 'tech' ? 129 : 235);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 4;
        const skillsText = validSkills.join(' • ');
        currentY = addText(skillsText, margin, currentY, {
          fontSize: 10,
          color: '#374151'
        });
      }

      // Education
      if (data.education?.length > 0) {
        currentY += 6;
        const eduColor = templateName === 'tech' ? '#10b981' : '#2563eb';
        currentY = addText('EDUCATION', margin, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: eduColor
        });
        pdf.setDrawColor(templateName === 'tech' ? 16 : 37, templateName === 'tech' ? 185 : 99, templateName === 'tech' ? 129 : 235);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 4;
        
        data.education.forEach((edu: any) => {
          if (edu.degree && edu.school) {
            currentY = addText(`${edu.degree} - ${edu.school}`, margin, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: '#1f2937'
            });
            
            if (edu.graduationDate) {
              currentY = addText(edu.graduationDate, margin, currentY, {
                fontSize: 9,
                color: '#6b7280'
              });
            }
            currentY += 3;
          }
        });
      }

      // Projects
      if (data.projects?.length > 0) {
        currentY += 6;
        const projectColor = templateName === 'tech' ? '#10b981' : '#2563eb';
        currentY = addText('PROJECTS', margin, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: projectColor
        });
        pdf.setDrawColor(templateName === 'tech' ? 16 : 37, templateName === 'tech' ? 185 : 99, templateName === 'tech' ? 129 : 235);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 4;
        
        data.projects.forEach((project: any) => {
          if (project.name) {
            currentY = addText(project.name, margin, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: '#1f2937'
            });
            
            if (project.description) {
              currentY = addText(project.description, margin, currentY, {
                fontSize: 10,
                color: '#4b5563'
              });
            }
            
            if (project.technologies) {
              currentY = addText(`Technologies: ${project.technologies}`, margin, currentY, {
                fontSize: 9,
                color: '#6b7280'
              });
            }
            currentY += 4;
          }
        });
      }
    }

    console.log(`Template-accurate PDF generated for ${templateName}!`);
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
