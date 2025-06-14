
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Starting Template-Accurate PDF Generation ===');
  console.log('Data received:', data);
  console.log('Template:', templateName);

  try {
    // Basic validation
    if (!data || !data.personalInfo?.fullName) {
      console.log('Insufficient data for PDF generation');
      throw new Error('Please fill in at least your name before downloading');
    }

    console.log('Creating PDF document with template-accurate rendering...');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;

    // Helper functions for consistent styling
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (!text || text.trim() === '') return y;
      
      const fontSize = options.fontSize || 10;
      const fontStyle = options.fontStyle || 'normal';
      const maxWidth = options.maxWidth || (pageWidth - 2 * margin);
      const color = options.color || '#000000';
      const align = options.align || 'left';
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      // Set text color
      if (color !== '#000000') {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        pdf.setTextColor(r, g, b);
      } else {
        pdf.setTextColor(0, 0, 0);
      }
      
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      // Check if we need a new page
      if (y + (lines.length * fontSize * 0.35) > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      
      // Handle text alignment
      if (align === 'center') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, (pageWidth - textWidth) / 2, y + (index * fontSize * 0.35));
        });
      } else if (align === 'right') {
        lines.forEach((line: string, index: number) => {
          const textWidth = pdf.getTextWidth(line);
          pdf.text(line, pageWidth - margin - textWidth, y + (index * fontSize * 0.35));
        });
      } else {
        pdf.text(lines, x, y);
      }
      
      return y + (lines.length * fontSize * 0.35) + 2;
    };

    const addLine = (x1: number, y1: number, x2: number, y2: number, color: string = '#000000', width: number = 0.5) => {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(width);
      pdf.line(x1, y1, x2, y2);
    };

    const addSection = (title: string, y: number, color: string = '#2563eb', options: any = {}) => {
      y += options.spacing || 8;
      y = addText(title, margin, y, { 
        fontSize: options.fontSize || 14, 
        fontStyle: 'bold', 
        color,
        align: options.align || 'left'
      });
      
      if (!options.noLine) {
        addLine(margin, y + 1, pageWidth - margin, y + 1, color);
      }
      
      return y + 6;
    };

    // Template-specific rendering
    if (templateName === 'modern') {
      console.log('Rendering Modern template...');
      
      // Modern Template - Blue accent, clean layout
      currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
        fontSize: 24,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      // Blue accent line
      addLine(margin, currentY, pageWidth - margin, currentY, '#2563eb', 2);
      currentY += 8;

      // Contact information in a clean row
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(`✉ ${data.personalInfo.email}`);
      if (data.personalInfo?.phone) contactInfo.push(`📞 ${data.personalInfo.phone}`);
      if (data.personalInfo?.location) contactInfo.push(`📍 ${data.personalInfo.location}`);
      
      if (contactInfo.length > 0) {
        currentY = addText(contactInfo.join(' • '), margin, currentY, {
          fontSize: 9,
          color: '#6b7280'
        });
        currentY += 6;
      }

      // Professional Summary
      if (data.personalInfo?.summary) {
        currentY = addSection('PROFESSIONAL SUMMARY', currentY, '#2563eb');
        currentY = addText(data.personalInfo.summary, margin, currentY, {
          fontSize: 10,
          color: '#374151'
        });
      }

      // Experience section
      if (data.experience?.length > 0) {
        currentY = addSection('PROFESSIONAL EXPERIENCE', currentY, '#2563eb');
        
        data.experience.forEach((exp: any) => {
          if (exp.jobTitle && exp.company) {
            currentY = addText(exp.jobTitle, margin, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: '#1f2937'
            });
            
            const companyDateText = `${exp.company} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            currentY = addText(companyDateText, margin, currentY, {
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

    } else if (templateName === 'creative') {
      console.log('Rendering Creative template...');
      
      // Creative Template - Purple gradient header effect
      pdf.setFillColor(147, 51, 234); // Purple
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      // White text on purple background
      currentY = addText(data.personalInfo?.fullName || '', margin, currentY + 15, {
        fontSize: 22,
        fontStyle: 'bold',
        color: '#ffffff'
      });
      
      // Contact in header
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
      if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
      if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
      
      if (contactInfo.length > 0) {
        currentY = addText(contactInfo.join(' • '), margin, currentY, {
          fontSize: 8,
          color: '#ffffff'
        });
      }
      
      currentY = 50; // Move below header

      // Two-column layout simulation for Creative
      const leftColumnWidth = (pageWidth - 3 * margin) * 0.35;
      const rightColumnX = margin + leftColumnWidth + 10;
      
      // Left column - About Me and Skills
      let leftY = currentY;
      if (data.personalInfo?.summary) {
        leftY = addSection('ABOUT ME', leftY, '#9333ea', { fontSize: 12 });
        leftY = addText(data.personalInfo.summary, margin, leftY, {
          fontSize: 9,
          maxWidth: leftColumnWidth,
          color: '#374151'
        });
      }
      
      if (data.skills?.length > 0) {
        leftY += 8;
        leftY = addSection('SKILLS', leftY, '#9333ea', { fontSize: 12 });
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
      
      // Right column - Experience and Projects
      let rightY = currentY;
      if (data.experience?.length > 0) {
        rightY = addSection('EXPERIENCE', rightY, '#9333ea', { fontSize: 12 });
        
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

    } else if (templateName === 'executive') {
      console.log('Rendering Executive template...');
      
      // Executive Template - Professional with bold lines
      currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
        fontSize: 26,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      // Heavy underline
      addLine(margin, currentY + 2, pageWidth - margin, currentY + 2, '#1f2937', 3);
      currentY += 10;

      // Contact information - split left/right
      if (data.personalInfo?.email || data.personalInfo?.phone) {
        if (data.personalInfo?.email) {
          addText(`Email: ${data.personalInfo.email}`, margin, currentY, {
            fontSize: 10,
            color: '#4b5563'
          });
        }
        
        if (data.personalInfo?.phone) {
          const phoneText = `Phone: ${data.personalInfo.phone}`;
          addText(phoneText, pageWidth - margin, currentY, {
            fontSize: 10,
            color: '#4b5563',
            align: 'right'
          });
        }
        
        currentY += 8;
      }

      // Executive Summary
      if (data.personalInfo?.summary) {
        currentY = addSection('EXECUTIVE SUMMARY', currentY, '#1f2937', { fontSize: 16 });
        currentY = addText(data.personalInfo.summary, margin, currentY, {
          fontSize: 11,
          color: '#374151'
        });
      }

      // Professional Experience
      if (data.experience?.length > 0) {
        currentY = addSection('PROFESSIONAL EXPERIENCE', currentY, '#1f2937', { fontSize: 16 });
        
        data.experience.forEach((exp: any) => {
          if (exp.jobTitle && exp.company) {
            // Job title and dates on same line
            addText(exp.jobTitle, margin, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: '#1f2937'
            });
            
            const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            addText(dateText, pageWidth - margin, currentY, {
              fontSize: 10,
              color: '#6b7280',
              align: 'right'
            });
            
            currentY += 6;
            
            currentY = addText(exp.company, margin, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: '#1f2937'
            });
            
            if (exp.description) {
              currentY = addText(exp.description, margin + 5, currentY, {
                fontSize: 10,
                color: '#4b5563'
              });
            }
            currentY += 6;
          }
        });
      }

    } else if (templateName === 'classic') {
      console.log('Rendering Classic template...');
      
      // Classic Template - Centered header with traditional styling
      const nameWidth = pdf.getTextWidth(data.personalInfo?.fullName || '');
      currentY = addText(data.personalInfo?.fullName || '', (pageWidth - nameWidth) / 2, currentY, {
        fontSize: 22,
        fontStyle: 'bold',
        color: '#1f2937',
        align: 'center'
      });
      
      // Contact info centered
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
      if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
      if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
      
      if (contactInfo.length > 0) {
        currentY = addText(contactInfo.join(' • '), pageWidth / 2, currentY, {
          fontSize: 10,
          color: '#6b7280',
          align: 'center'
        });
      }
      
      // Traditional line separator
      addLine(margin, currentY + 3, pageWidth - margin, currentY + 3, '#d1d5db');
      currentY += 10;

      // Professional Summary
      if (data.personalInfo?.summary) {
        currentY = addSection('PROFESSIONAL SUMMARY', currentY, '#1f2937', { fontSize: 14 });
        currentY = addText(data.personalInfo.summary, margin, currentY, {
          fontSize: 10,
          color: '#374151'
        });
      }

    } else if (templateName === 'minimal') {
      console.log('Rendering Minimal template...');
      
      // Minimal Template - Clean, centered, lots of whitespace
      currentY = addText(data.personalInfo?.fullName || '', pageWidth / 2, currentY, {
        fontSize: 28,
        fontStyle: 'normal',
        color: '#1f2937',
        align: 'center'
      });
      
      currentY += 4;
      
      // Contact info in minimal style
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
      if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
      if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
      
      if (contactInfo.length > 0) {
        currentY = addText(contactInfo.join(' • '), pageWidth / 2, currentY, {
          fontSize: 9,
          color: '#6b7280',
          align: 'center'
        });
      }
      
      currentY += 8;

      // Summary in italics, centered
      if (data.personalInfo?.summary) {
        currentY = addText(data.personalInfo.summary, pageWidth / 2, currentY, {
          fontSize: 10,
          color: '#374151',
          align: 'center'
        });
        currentY += 8;
      }

      // Experience section - minimal style
      if (data.experience?.length > 0) {
        currentY = addSection('EXPERIENCE', currentY, '#1f2937', { 
          fontSize: 16, 
          align: 'center',
          noLine: true 
        });
        
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

    } else {
      // Tech Template or fallback
      console.log('Rendering Tech template...');
      
      // Tech Template - Monospace feel, structured
      currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
        fontSize: 24,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      addLine(margin, currentY, pageWidth - margin, currentY, '#10b981', 2);
      currentY += 8;

      // Contact in tech style
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
    }

    // Common sections for templates that don't override them
    if (!['creative', 'minimal'].includes(templateName)) {
      // Skills section
      if (data.skills?.length > 0 && data.skills.some((skill: string) => skill && skill.trim())) {
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        currentY = addSection('SKILLS', currentY, templateName === 'tech' ? '#10b981' : '#2563eb');
        const skillsText = validSkills.join(' • ');
        currentY = addText(skillsText, margin, currentY, {
          fontSize: 10,
          color: '#374151'
        });
      }

      // Education
      if (data.education?.length > 0) {
        currentY = addSection('EDUCATION', currentY, templateName === 'tech' ? '#10b981' : '#2563eb');
        
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
        currentY = addSection('PROJECTS', currentY, templateName === 'tech' ? '#10b981' : '#2563eb');
        
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

    console.log(`Template-accurate PDF generated successfully for ${templateName} template!`);
    return pdf;

  } catch (error) {
    console.error('Error in template-accurate PDF generation:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
