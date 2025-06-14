
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
    let currentY = 20;

    // Helper functions
    const setTextColor = (r: number, g: number, b: number) => {
      pdf.setTextColor(r, g, b);
    };

    const setFillColor = (r: number, g: number, b: number) => {
      pdf.setFillColor(r, g, b);
    };

    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (!text || text.trim() === '') return y;
      
      pdf.setFontSize(options.fontSize || 10);
      pdf.setFont('helvetica', options.fontStyle || 'normal');
      
      if (options.color) {
        const [r, g, b] = options.color;
        setTextColor(r, g, b);
      } else {
        setTextColor(0, 0, 0);
      }
      
      const maxWidth = options.maxWidth || (pageWidth - 40);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      if (y + (lines.length * (options.lineHeight || 6)) > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }
      
      if (options.align === 'center') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - textWidth) / 2, y + (index * (options.lineHeight || 6)));
        });
      } else if (options.align === 'right') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, pageWidth - 20 - textWidth, y + (index * (options.lineHeight || 6)));
        });
      } else {
        pdf.text(lines, x, y);
      }
      
      return y + (lines.length * (options.lineHeight || 6)) + (options.marginBottom || 3);
    };

    // Template-specific rendering to match exact designs
    switch (templateName) {
      case 'modern':
        // Modern Template - Clean blue theme with exact styling
        currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
          fontSize: 28,
          fontStyle: 'bold',
          color: [31, 41, 55], // text-gray-900
          marginBottom: 5
        });
        
        // Blue line exactly like template
        pdf.setDrawColor(37, 99, 235); // blue-600
        pdf.setLineWidth(2);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;

        // Contact info in one line like template
        const modernContact = [];
        if (data.personalInfo?.email) modernContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) modernContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) modernContact.push(data.personalInfo.location);
        
        if (modernContact.length > 0) {
          currentY = addText(modernContact.join(' • '), 20, currentY, {
            fontSize: 10,
            color: [107, 114, 128], // text-gray-500
            marginBottom: 8
          });
        }

        // Professional Summary section
        if (data.personalInfo?.summary) {
          currentY = addText('PROFESSIONAL SUMMARY', 20, currentY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: [37, 99, 235], // text-blue-600
            marginBottom: 3
          });
          pdf.setDrawColor(37, 99, 235);
          pdf.setLineWidth(1);
          pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
          currentY += 2;
          currentY = addText(data.personalInfo.summary, 20, currentY, {
            fontSize: 10,
            color: [55, 65, 81], // text-gray-700
            lineHeight: 5,
            marginBottom: 10
          });
        }

        // Experience section
        if (data.experience?.length > 0) {
          currentY = addText('PROFESSIONAL EXPERIENCE', 20, currentY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: [37, 99, 235],
            marginBottom: 3
          });
          pdf.setDrawColor(37, 99, 235);
          pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
          currentY += 5;
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, 20, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: [31, 41, 55],
                marginBottom: 2
              });
              
              const expDate = `${exp.company} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
              currentY = addText(expDate, 20, currentY, {
                fontSize: 10,
                color: [37, 99, 235],
                marginBottom: 3
              });
              
              if (exp.description) {
                currentY = addText(exp.description, 25, currentY, {
                  fontSize: 9,
                  color: [75, 85, 99],
                  lineHeight: 4,
                  marginBottom: 6
                });
              }
            }
          });
        }
        break;

      case 'creative':
        // Creative Template - Purple gradient header matching exact design
        // Purple gradient header background
        setFillColor(147, 51, 234); // purple-600
        pdf.rect(0, 0, pageWidth, 40, 'F');
        
        // White text on purple background
        currentY = addText(data.personalInfo?.fullName || '', 20, 20, {
          fontSize: 24,
          fontStyle: 'bold',
          color: [255, 255, 255],
          marginBottom: 3
        });
        
        // Contact info in header
        const creativeContact = [];
        if (data.personalInfo?.email) creativeContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) creativeContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) creativeContact.push(data.personalInfo.location);
        
        if (creativeContact.length > 0) {
          addText(creativeContact.join(' • '), 20, 30, {
            fontSize: 9,
            color: [255, 255, 255]
          });
        }
        
        currentY = 50;

        // Two-column layout like the template
        const leftColumnWidth = 60;
        const rightColumnX = 80;
        
        // Left column - About Me
        let leftY = currentY;
        if (data.personalInfo?.summary) {
          leftY = addText('ABOUT ME', 20, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: [147, 51, 234], // purple-600
            marginBottom: 4
          });
          leftY = addText(data.personalInfo.summary, 20, leftY, {
            fontSize: 9,
            maxWidth: leftColumnWidth,
            color: [55, 65, 81],
            lineHeight: 4,
            marginBottom: 8
          });
        }
        
        // Left column - Skills with purple styling
        if (data.skills?.length > 0) {
          leftY = addText('SKILLS', 20, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: [147, 51, 234],
            marginBottom: 4
          });
          data.skills.forEach((skill: string) => {
            if (skill && skill.trim()) {
              leftY = addText(`• ${skill}`, 20, leftY, {
                fontSize: 9,
                maxWidth: leftColumnWidth,
                color: [124, 58, 237],
                marginBottom: 2
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
            color: [147, 51, 234],
            marginBottom: 4
          });
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              rightY = addText(exp.jobTitle, rightColumnX, rightY, {
                fontSize: 11,
                fontStyle: 'bold',
                maxWidth: pageWidth - rightColumnX - 20,
                color: [31, 41, 55],
                marginBottom: 2
              });
              
              rightY = addText(exp.company, rightColumnX, rightY, {
                fontSize: 10,
                maxWidth: pageWidth - rightColumnX - 20,
                color: [147, 51, 234],
                marginBottom: 2
              });
              
              if (exp.description) {
                rightY = addText(exp.description, rightColumnX, rightY, {
                  fontSize: 9,
                  maxWidth: pageWidth - rightColumnX - 20,
                  color: [75, 85, 99],
                  lineHeight: 4,
                  marginBottom: 6
                });
              }
            }
          });
        }
        break;

      case 'classic':
        // Classic Template - Centered header with traditional styling
        currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
          fontSize: 24,
          fontStyle: 'bold',
          color: [31, 41, 55],
          align: 'center',
          marginBottom: 5
        });
        
        const classicContact = [];
        if (data.personalInfo?.email) classicContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) classicContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) classicContact.push(data.personalInfo.location);
        
        if (classicContact.length > 0) {
          currentY = addText(classicContact.join(' • '), pageWidth / 2, currentY, {
            fontSize: 10,
            color: [107, 114, 128],
            align: 'center',
            marginBottom: 8
          });
        }
        
        // Traditional line
        pdf.setDrawColor(209, 213, 219);
        pdf.setLineWidth(1);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;

        if (data.personalInfo?.summary) {
          currentY = addText('PROFESSIONAL SUMMARY', 20, currentY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: [31, 41, 55],
            marginBottom: 3
          });
          pdf.setDrawColor(75, 85, 99);
          pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
          currentY += 3;
          currentY = addText(data.personalInfo.summary, 20, currentY, {
            fontSize: 10,
            color: [55, 65, 81],
            lineHeight: 5,
            marginBottom: 10
          });
        }
        break;

      case 'minimal':
        // Minimal Template - Centered, clean design exactly as shown
        currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
          fontSize: 32,
          fontStyle: 'normal', // thin font
          color: [31, 41, 55],
          align: 'center',
          marginBottom: 8
        });
        
        const minimalContact = [];
        if (data.personalInfo?.email) minimalContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) minimalContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) minimalContact.push(data.personalInfo.location);
        
        if (minimalContact.length > 0) {
          currentY = addText(minimalContact.join(' • '), pageWidth / 2, currentY, {
            fontSize: 9,
            color: [107, 114, 128],
            align: 'center',
            marginBottom: 10
          });
        }

        if (data.personalInfo?.summary) {
          currentY = addText(data.personalInfo.summary, pageWidth / 2, currentY, {
            fontSize: 10,
            color: [55, 65, 81],
            align: 'center',
            marginBottom: 12,
            fontStyle: 'italic'
          });
        }

        if (data.experience?.length > 0) {
          currentY = addText('EXPERIENCE', pageWidth / 2, currentY, {
            fontSize: 16,
            fontStyle: 'normal', // thin
            color: [31, 41, 55],
            align: 'center',
            marginBottom: 8
          });
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, pageWidth / 2, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: [31, 41, 55],
                align: 'center',
                marginBottom: 2
              });
              
              currentY = addText(exp.company, pageWidth / 2, currentY, {
                fontSize: 10,
                color: [107, 114, 128],
                align: 'center',
                marginBottom: 2
              });
              
              const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
              currentY = addText(dateText, pageWidth / 2, currentY, {
                fontSize: 9,
                color: [156, 163, 175],
                align: 'center',
                marginBottom: 3
              });
              
              if (exp.description) {
                currentY = addText(exp.description, 20, currentY, {
                  fontSize: 9,
                  color: [75, 85, 99],
                  lineHeight: 4,
                  marginBottom: 10
                });
              }
            }
          });
        }
        break;

      case 'executive':
        // Executive Template - Bold and professional with heavy lines
        currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
          fontSize: 28,
          fontStyle: 'bold',
          color: [31, 41, 55],
          marginBottom: 5
        });
        
        // Heavy underline like executive template
        pdf.setDrawColor(31, 41, 55);
        pdf.setLineWidth(4);
        pdf.line(20, currentY + 2, pageWidth - 20, currentY + 2);
        currentY += 15;

        // Contact split left/right like template
        if (data.personalInfo?.email) {
          addText(`Email: ${data.personalInfo.email}`, 20, currentY, {
            fontSize: 10,
            color: [75, 85, 99]
          });
        }
        
        if (data.personalInfo?.phone) {
          addText(`Phone: ${data.personalInfo.phone}`, pageWidth - 20, currentY, {
            fontSize: 10,
            color: [75, 85, 99],
            align: 'right'
          });
        }
        
        currentY += 12;

        if (data.personalInfo?.summary) {
          currentY = addText('EXECUTIVE SUMMARY', 20, currentY, {
            fontSize: 16,
            fontStyle: 'bold',
            color: [31, 41, 55],
            marginBottom: 3
          });
          pdf.setDrawColor(31, 41, 55);
          pdf.setLineWidth(1);
          pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
          currentY += 4;
          currentY = addText(data.personalInfo.summary, 20, currentY, {
            fontSize: 11,
            color: [55, 65, 81],
            lineHeight: 6,
            marginBottom: 10
          });
        }
        break;

      case 'tech':
        // Tech Template - Dark theme with green accents
        // Set dark background
        setFillColor(17, 24, 39); // gray-900
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Green gradient header
        setFillColor(34, 197, 94); // green-500
        pdf.rect(0, 0, pageWidth, 40, 'F');
        
        currentY = addText(data.personalInfo?.fullName || '', 20, 20, {
          fontSize: 24,
          fontStyle: 'bold',
          color: [255, 255, 255],
          marginBottom: 3
        });
        
        const techContact = [];
        if (data.personalInfo?.email) techContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) techContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) techContact.push(data.personalInfo.location);
        
        if (techContact.length > 0) {
          addText(techContact.join(' • '), 20, 30, {
            fontSize: 9,
            color: [255, 255, 255]
          });
        }
        
        currentY = 50;

        // Two-column layout like tech template
        let techLeftY = currentY;
        if (data.skills?.length > 0) {
          techLeftY = addText('TECH STACK', 20, techLeftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: [34, 197, 94], // green-500
            marginBottom: 4
          });
          data.skills.forEach((skill: string) => {
            if (skill && skill.trim()) {
              techLeftY = addText(`> ${skill}`, 20, techLeftY, {
                fontSize: 9,
                maxWidth: 60,
                color: [34, 197, 94],
                marginBottom: 2
              });
            }
          });
        }
        
        // Right column - Experience
        let techRightY = currentY;
        if (data.experience?.length > 0) {
          techRightY = addText('EXPERIENCE', 80, techRightY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: [34, 197, 94],
            marginBottom: 4
          });
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              techRightY = addText(exp.jobTitle, 80, techRightY, {
                fontSize: 11,
                fontStyle: 'bold',
                maxWidth: pageWidth - 100,
                color: [255, 255, 255],
                marginBottom: 2
              });
              
              techRightY = addText(exp.company, 80, techRightY, {
                fontSize: 10,
                maxWidth: pageWidth - 100,
                color: [34, 197, 94],
                marginBottom: 2
              });
              
              if (exp.description) {
                techRightY = addText(exp.description, 80, techRightY, {
                  fontSize: 9,
                  maxWidth: pageWidth - 100,
                  color: [209, 213, 219],
                  lineHeight: 4,
                  marginBottom: 6
                });
              }
            }
          });
        }
        break;

      default:
        // Fallback to modern
        currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
          fontSize: 24,
          fontStyle: 'bold'
        });
    }

    // Add common sections for templates that need them
    if (!['creative', 'minimal', 'tech'].includes(templateName)) {
      // Skills section
      if (data.skills?.length > 0 && data.skills.some((skill: string) => skill && skill.trim())) {
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        currentY += 10;
        const skillsColor = templateName === 'executive' ? [31, 41, 55] : [37, 99, 235];
        currentY = addText('SKILLS', 20, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: skillsColor,
          marginBottom: 3
        });
        pdf.setDrawColor(skillsColor[0], skillsColor[1], skillsColor[2]);
        pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
        currentY += 4;
        const skillsText = validSkills.join(' • ');
        currentY = addText(skillsText, 20, currentY, {
          fontSize: 10,
          color: [55, 65, 81],
          lineHeight: 5,
          marginBottom: 10
        });
      }

      // Education section
      if (data.education?.length > 0) {
        currentY += 10;
        const eduColor = templateName === 'executive' ? [31, 41, 55] : [37, 99, 235];
        currentY = addText('EDUCATION', 20, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: eduColor,
          marginBottom: 3
        });
        pdf.setDrawColor(eduColor[0], eduColor[1], eduColor[2]);
        pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
        currentY += 4;
        
        data.education.forEach((edu: any) => {
          if (edu.degree && edu.school) {
            currentY = addText(`${edu.degree} - ${edu.school}`, 20, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: [31, 41, 55],
              marginBottom: 2
            });
            
            if (edu.graduationDate) {
              currentY = addText(edu.graduationDate, 20, currentY, {
                fontSize: 9,
                color: [107, 114, 128],
                marginBottom: 5
              });
            }
          }
        });
      }

      // Projects section
      if (data.projects?.length > 0) {
        currentY += 10;
        const projectColor = templateName === 'executive' ? [31, 41, 55] : [37, 99, 235];
        currentY = addText('PROJECTS', 20, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: projectColor,
          marginBottom: 3
        });
        pdf.setDrawColor(projectColor[0], projectColor[1], projectColor[2]);
        pdf.line(20, currentY - 1, pageWidth - 20, currentY - 1);
        currentY += 4;
        
        data.projects.forEach((project: any) => {
          if (project.name) {
            currentY = addText(project.name, 20, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: [31, 41, 55],
              marginBottom: 2
            });
            
            if (project.description) {
              currentY = addText(project.description, 20, currentY, {
                fontSize: 10,
                color: [75, 85, 99],
                lineHeight: 4,
                marginBottom: 3
              });
            }
            
            if (project.technologies) {
              currentY = addText(`Technologies: ${project.technologies}`, 20, currentY, {
                fontSize: 9,
                color: [107, 114, 128],
                marginBottom: 6
              });
            }
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
