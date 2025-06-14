
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Generating Perfect Template Match PDF ===');
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

    // Add custom fonts for better rendering
    pdf.setFont('helvetica');

    // Helper functions for consistent styling
    const addSection = (title: string, color: number[], fontSize: number = 14) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.text(title, 20, currentY);
      currentY += 8;
      
      // Add underline
      pdf.setDrawColor(color[0], color[1], color[2]);
      pdf.setLineWidth(0.5);
      pdf.line(20, currentY - 5, pageWidth - 20, currentY - 5);
      currentY += 5;
    };

    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (!text || text.trim() === '') return y;
      
      pdf.setFontSize(options.fontSize || 10);
      pdf.setFont('helvetica', options.fontStyle || 'normal');
      pdf.setTextColor(options.color?.[0] || 0, options.color?.[1] || 0, options.color?.[2] || 0);
      
      const maxWidth = options.maxWidth || (pageWidth - 40);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      if (y + (lines.length * 5) > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }
      
      if (options.align === 'center') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - textWidth) / 2, y + (index * 5));
        });
      } else {
        pdf.text(lines, x, y);
      }
      
      return y + (lines.length * 5) + (options.marginBottom || 3);
    };

    // Template-specific rendering
    switch (templateName) {
      case 'modern':
        // Modern Template - Blue theme with clean lines
        currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
          fontSize: 24,
          fontStyle: 'bold',
          color: [31, 41, 55],
          marginBottom: 8
        });
        
        // Blue accent line
        pdf.setDrawColor(37, 99, 235);
        pdf.setLineWidth(2);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;

        // Contact info
        const contact = [];
        if (data.personalInfo?.email) contact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) contact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) contact.push(data.personalInfo.location);
        
        if (contact.length > 0) {
          currentY = addText(contact.join(' • '), 20, currentY, {
            fontSize: 10,
            color: [107, 114, 128],
            marginBottom: 12
          });
        }

        if (data.personalInfo?.summary) {
          addSection('PROFESSIONAL SUMMARY', [37, 99, 235]);
          currentY = addText(data.personalInfo.summary, 20, currentY, {
            fontSize: 10,
            color: [55, 65, 81],
            marginBottom: 15
          });
        }

        if (data.experience?.length > 0) {
          addSection('PROFESSIONAL EXPERIENCE', [37, 99, 235]);
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, 20, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: [31, 41, 55],
                marginBottom: 3
              });
              
              currentY = addText(`${exp.company} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`, 20, currentY, {
                fontSize: 10,
                color: [37, 99, 235],
                marginBottom: 5
              });
              
              if (exp.description) {
                currentY = addText(exp.description, 20, currentY, {
                  fontSize: 9,
                  color: [75, 85, 99],
                  marginBottom: 10
                });
              }
            }
          });
        }
        break;

      case 'creative':
        // Creative Template - Purple gradient header
        pdf.setFillColor(147, 51, 234);
        pdf.rect(0, 0, pageWidth, 50, 'F');
        
        currentY = addText(data.personalInfo?.fullName || '', 20, 25, {
          fontSize: 22,
          fontStyle: 'bold',
          color: [255, 255, 255],
          marginBottom: 5
        });
        
        const creativeContact = [];
        if (data.personalInfo?.email) creativeContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) creativeContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) creativeContact.push(data.personalInfo.location);
        
        if (creativeContact.length > 0) {
          addText(creativeContact.join(' • '), 20, 35, {
            fontSize: 9,
            color: [255, 255, 255]
          });
        }
        
        currentY = 60;

        // Two-column layout
        let leftY = currentY;
        if (data.personalInfo?.summary) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(147, 51, 234);
          pdf.text('ABOUT ME', 20, leftY);
          leftY += 8;
          
          leftY = addText(data.personalInfo.summary, 20, leftY, {
            fontSize: 9,
            maxWidth: 60,
            color: [55, 65, 81],
            marginBottom: 10
          });
        }
        
        if (data.skills?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(147, 51, 234);
          pdf.text('SKILLS', 20, leftY);
          leftY += 8;
          
          data.skills.forEach((skill: string) => {
            if (skill && skill.trim()) {
              leftY = addText(`• ${skill}`, 20, leftY, {
                fontSize: 9,
                maxWidth: 60,
                color: [124, 58, 237],
                marginBottom: 3
              });
            }
          });
        }
        
        // Right column - Experience
        let rightY = currentY;
        if (data.experience?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(147, 51, 234);
          pdf.text('EXPERIENCE', 90, rightY);
          rightY += 8;
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              rightY = addText(exp.jobTitle, 90, rightY, {
                fontSize: 11,
                fontStyle: 'bold',
                maxWidth: pageWidth - 110,
                color: [31, 41, 55],
                marginBottom: 3
              });
              
              rightY = addText(exp.company, 90, rightY, {
                fontSize: 10,
                maxWidth: pageWidth - 110,
                color: [147, 51, 234],
                marginBottom: 3
              });
              
              if (exp.description) {
                rightY = addText(exp.description, 90, rightY, {
                  fontSize: 9,
                  maxWidth: pageWidth - 110,
                  color: [75, 85, 99],
                  marginBottom: 8
                });
              }
            }
          });
        }
        break;

      case 'classic':
        // Classic Template - Centered traditional layout
        currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
          fontSize: 22,
          fontStyle: 'bold',
          color: [31, 41, 55],
          align: 'center',
          marginBottom: 8
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
            marginBottom: 10
          });
        }
        
        // Traditional line
        pdf.setDrawColor(209, 213, 219);
        pdf.setLineWidth(1);
        pdf.line(40, currentY, pageWidth - 40, currentY);
        currentY += 15;

        if (data.personalInfo?.summary) {
          addSection('PROFESSIONAL SUMMARY', [31, 41, 55]);
          currentY = addText(data.personalInfo.summary, 20, currentY, {
            fontSize: 10,
            color: [55, 65, 81],
            marginBottom: 15
          });
        }

        if (data.experience?.length > 0) {
          addSection('PROFESSIONAL EXPERIENCE', [31, 41, 55]);
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, 20, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: [31, 41, 55],
                marginBottom: 3
              });
              
              currentY = addText(`${exp.company} - ${exp.startDate || ''} to ${exp.current ? 'Present' : exp.endDate || ''}`, 20, currentY, {
                fontSize: 10,
                color: [75, 85, 99],
                marginBottom: 5
              });
              
              if (exp.description) {
                currentY = addText(exp.description, 20, currentY, {
                  fontSize: 9,
                  color: [75, 85, 99],
                  marginBottom: 10
                });
              }
            }
          });
        }
        break;

      case 'minimal':
        // Minimal Template - Centered, clean design
        currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
          fontSize: 28,
          fontStyle: 'normal',
          color: [31, 41, 55],
          align: 'center',
          marginBottom: 12
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
            marginBottom: 15
          });
        }

        if (data.personalInfo?.summary) {
          currentY = addText(data.personalInfo.summary, pageWidth / 2, currentY, {
            fontSize: 10,
            color: [55, 65, 81],
            align: 'center',
            marginBottom: 20,
            fontStyle: 'italic'
          });
        }

        if (data.experience?.length > 0) {
          currentY = addText('EXPERIENCE', pageWidth / 2, currentY, {
            fontSize: 16,
            fontStyle: 'normal',
            color: [31, 41, 55],
            align: 'center',
            marginBottom: 10
          });
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, pageWidth / 2, currentY, {
                fontSize: 12,
                fontStyle: 'bold',
                color: [31, 41, 55],
                align: 'center',
                marginBottom: 3
              });
              
              currentY = addText(exp.company, pageWidth / 2, currentY, {
                fontSize: 10,
                color: [107, 114, 128],
                align: 'center',
                marginBottom: 3
              });
              
              currentY = addText(`${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`, pageWidth / 2, currentY, {
                fontSize: 9,
                color: [156, 163, 175],
                align: 'center',
                marginBottom: 5
              });
              
              if (exp.description) {
                currentY = addText(exp.description, 20, currentY, {
                  fontSize: 9,
                  color: [75, 85, 99],
                  marginBottom: 12
                });
              }
            }
          });
        }
        break;

      case 'executive':
        // Executive Template - Bold and professional
        currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
          fontSize: 26,
          fontStyle: 'bold',
          color: [31, 41, 55],
          marginBottom: 8
        });
        
        // Heavy underline
        pdf.setDrawColor(31, 41, 55);
        pdf.setLineWidth(3);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 15;

        // Contact split layout
        if (data.personalInfo?.email) {
          addText(`Email: ${data.personalInfo.email}`, 20, currentY, {
            fontSize: 10,
            color: [75, 85, 99]
          });
        }
        
        if (data.personalInfo?.phone) {
          const phoneWidth = pdf.getTextWidth(`Phone: ${data.personalInfo.phone}`);
          addText(`Phone: ${data.personalInfo.phone}`, pageWidth - 20 - phoneWidth, currentY, {
            fontSize: 10,
            color: [75, 85, 99]
          });
        }
        
        currentY += 15;

        if (data.personalInfo?.summary) {
          addSection('EXECUTIVE SUMMARY', [31, 41, 55], 16);
          currentY = addText(data.personalInfo.summary, 20, currentY, {
            fontSize: 11,
            color: [55, 65, 81],
            marginBottom: 15
          });
        }

        if (data.experience?.length > 0) {
          addSection('PROFESSIONAL EXPERIENCE', [31, 41, 55], 16);
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              currentY = addText(exp.jobTitle, 20, currentY, {
                fontSize: 13,
                fontStyle: 'bold',
                color: [31, 41, 55],
                marginBottom: 3
              });
              
              currentY = addText(exp.company, 20, currentY, {
                fontSize: 11,
                fontStyle: 'bold',
                color: [55, 65, 81],
                marginBottom: 5
              });
              
              if (exp.description) {
                currentY = addText(exp.description, 25, currentY, {
                  fontSize: 10,
                  color: [75, 85, 99],
                  marginBottom: 12
                });
              }
            }
          });
        }
        break;

      case 'tech':
        // Tech Template - Dark theme with green accents
        pdf.setFillColor(17, 24, 39);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Green header
        pdf.setFillColor(34, 197, 94);
        pdf.rect(0, 0, pageWidth, 50, 'F');
        
        currentY = addText(data.personalInfo?.fullName || '', 20, 25, {
          fontSize: 22,
          fontStyle: 'bold',
          color: [255, 255, 255],
          marginBottom: 5
        });
        
        const techContact = [];
        if (data.personalInfo?.email) techContact.push(data.personalInfo.email);
        if (data.personalInfo?.phone) techContact.push(data.personalInfo.phone);
        if (data.personalInfo?.location) techContact.push(data.personalInfo.location);
        
        if (techContact.length > 0) {
          addText(techContact.join(' • '), 20, 35, {
            fontSize: 9,
            color: [255, 255, 255]
          });
        }
        
        currentY = 60;

        // Two-column layout
        let techLeftY = currentY;
        if (data.skills?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(34, 197, 94);
          pdf.text('TECH STACK', 20, techLeftY);
          techLeftY += 8;
          
          data.skills.forEach((skill: string) => {
            if (skill && skill.trim()) {
              techLeftY = addText(`> ${skill}`, 20, techLeftY, {
                fontSize: 9,
                maxWidth: 60,
                color: [34, 197, 94],
                marginBottom: 3
              });
            }
          });
        }
        
        // Right column - Experience
        let techRightY = currentY;
        if (data.experience?.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(34, 197, 94);
          pdf.text('EXPERIENCE', 90, techRightY);
          techRightY += 8;
          
          data.experience.forEach((exp: any) => {
            if (exp.jobTitle && exp.company) {
              techRightY = addText(exp.jobTitle, 90, techRightY, {
                fontSize: 11,
                fontStyle: 'bold',
                maxWidth: pageWidth - 110,
                color: [255, 255, 255],
                marginBottom: 3
              });
              
              techRightY = addText(exp.company, 90, techRightY, {
                fontSize: 10,
                maxWidth: pageWidth - 110,
                color: [34, 197, 94],
                marginBottom: 3
              });
              
              if (exp.description) {
                techRightY = addText(exp.description, 90, techRightY, {
                  fontSize: 9,
                  maxWidth: pageWidth - 110,
                  color: [209, 213, 219],
                  marginBottom: 8
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

    // Add skills and education for templates that support them
    if (!['creative', 'minimal', 'tech'].includes(templateName)) {
      if (data.skills?.length > 0) {
        const skillsColor = templateName === 'executive' ? [31, 41, 55] : [37, 99, 235];
        addSection('SKILLS', skillsColor);
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        currentY = addText(validSkills.join(' • '), 20, currentY, {
          fontSize: 10,
          color: [55, 65, 81],
          marginBottom: 15
        });
      }

      if (data.education?.length > 0) {
        const eduColor = templateName === 'executive' ? [31, 41, 55] : [37, 99, 235];
        addSection('EDUCATION', eduColor);
        
        data.education.forEach((edu: any) => {
          if (edu.degree && edu.school) {
            currentY = addText(`${edu.degree} - ${edu.school}`, 20, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: [31, 41, 55],
              marginBottom: 3
            });
            
            if (edu.graduationDate) {
              currentY = addText(edu.graduationDate, 20, currentY, {
                fontSize: 9,
                color: [107, 114, 128],
                marginBottom: 8
              });
            }
          }
        });
      }
    }

    console.log(`Perfect template-matching PDF generated for ${templateName}!`);
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
