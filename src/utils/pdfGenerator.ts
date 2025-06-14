
export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Starting Template-Based PDF Generation ===');
  console.log('Data received:', data);
  console.log('Template:', templateName);

  try {
    // Dynamic import of jsPDF
    const { default: jsPDF } = await import('jspdf');
    console.log('jsPDF imported successfully');

    // Basic validation
    if (!data || !data.personalInfo?.fullName) {
      console.log('Insufficient data for PDF generation');
      throw new Error('Please fill in at least your name before downloading');
    }

    console.log('Creating PDF document with template-based rendering...');

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
      
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35) + 2;
    };

    const addLine = (x1: number, y1: number, x2: number, y2: number, color: string = '#000000') => {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(0.5);
      pdf.line(x1, y1, x2, y2);
    };

    const addSection = (title: string, y: number, color: string = '#2563eb') => {
      y += 8;
      y = addText(title, margin, y, { fontSize: 14, fontStyle: 'bold', color });
      addLine(margin, y + 1, pageWidth - margin, y + 1, color);
      return y + 6;
    };

    // Template-specific rendering
    if (templateName === 'modern') {
      // Modern Template Styling
      
      // Header with blue accent
      currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
        fontSize: 24,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      // Add blue line under name
      addLine(margin, currentY, pageWidth - margin, currentY, '#2563eb');
      currentY += 6;

      // Contact information in a row
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(`✉ ${data.personalInfo.email}`);
      if (data.personalInfo?.phone) contactInfo.push(`📞 ${data.personalInfo.phone}`);
      if (data.personalInfo?.location) contactInfo.push(`📍 ${data.personalInfo.location}`);
      
      if (contactInfo.length > 0) {
        currentY = addText(contactInfo.join(' | '), margin, currentY, {
          fontSize: 9,
          color: '#6b7280'
        });
        currentY += 4;
      }

      // Professional Summary with blue accent
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
        
        data.experience.forEach((exp: any, index: number) => {
          if (exp.jobTitle && exp.company) {
            // Job title
            currentY = addText(exp.jobTitle, margin, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: '#1f2937'
            });
            
            // Company and dates on same line
            const companyDateText = `${exp.company} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            currentY = addText(companyDateText, margin, currentY, {
              fontSize: 10,
              color: '#2563eb'
            });
            
            // Description
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
      // Creative Template with Purple Gradient Effect
      
      // Simulate gradient header with purple background
      pdf.setFillColor(147, 51, 234); // Purple
      pdf.rect(margin, currentY - 5, pageWidth - 2 * margin, 25, 'F');
      
      // White text on purple background
      currentY = addText(data.personalInfo?.fullName || '', margin + 5, currentY + 10, {
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
        currentY = addText(contactInfo.join(' | '), margin + 5, currentY, {
          fontSize: 8,
          color: '#ffffff'
        });
      }
      
      currentY += 15;

      // Two-column layout simulation
      const leftColumnWidth = (pageWidth - 3 * margin) * 0.35;
      const rightColumnX = margin + leftColumnWidth + 10;
      
      // Left column - Skills and Summary
      let leftY = currentY;
      if (data.personalInfo?.summary) {
        leftY = addSection('ABOUT ME', leftY, '#9333ea');
        leftY = addText(data.personalInfo.summary, margin, leftY, {
          fontSize: 9,
          maxWidth: leftColumnWidth,
          color: '#374151'
        });
      }
      
      if (data.skills?.length > 0) {
        leftY += 5;
        leftY = addSection('SKILLS', leftY, '#9333ea');
        data.skills.forEach((skill: string) => {
          leftY = addText(`• ${skill}`, margin, leftY, {
            fontSize: 9,
            maxWidth: leftColumnWidth,
            color: '#7c3aed'
          });
        });
      }
      
      // Right column - Experience
      let rightY = currentY;
      if (data.experience?.length > 0) {
        rightY = addSection('EXPERIENCE', rightY, '#9333ea');
        
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
      // Executive Template - Clean and Professional
      
      // Name with underline
      currentY = addText(data.personalInfo?.fullName || '', margin, currentY, {
        fontSize: 26,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      // Heavy underline
      pdf.setLineWidth(2);
      addLine(margin, currentY, pageWidth - margin, currentY, '#1f2937');
      currentY += 8;

      // Contact information
      if (data.personalInfo?.email || data.personalInfo?.phone) {
        const leftContact = data.personalInfo?.email ? `Email: ${data.personalInfo.email}` : '';
        const rightContact = data.personalInfo?.phone ? `Phone: ${data.personalInfo.phone}` : '';
        
        if (leftContact) {
          currentY = addText(leftContact, margin, currentY, {
            fontSize: 10,
            color: '#4b5563'
          });
        }
        
        if (rightContact) {
          pdf.text(rightContact, pageWidth - margin - pdf.getTextWidth(rightContact), currentY - 4);
        }
        
        currentY += 4;
      }

      // Executive Summary
      if (data.personalInfo?.summary) {
        currentY = addSection('EXECUTIVE SUMMARY', currentY, '#1f2937');
        currentY = addText(data.personalInfo.summary, margin, currentY, {
          fontSize: 11,
          color: '#374151'
        });
      }

    } else {
      // Default/Classic Template
      
      // Centered header
      const nameWidth = pdf.getTextWidth(data.personalInfo?.fullName || '');
      currentY = addText(data.personalInfo?.fullName || '', (pageWidth - nameWidth) / 2, currentY, {
        fontSize: 22,
        fontStyle: 'bold',
        color: '#1f2937'
      });
      
      // Centered contact
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
      if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
      if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
      
      if (contactInfo.length > 0) {
        const contactText = contactInfo.join(' | ');
        const contactWidth = pdf.getTextWidth(contactText);
        currentY = addText(contactText, (pageWidth - contactWidth) / 2, currentY, {
          fontSize: 10,
          color: '#6b7280'
        });
      }
      
      addLine(margin, currentY + 2, pageWidth - margin, currentY + 2, '#d1d5db');
      currentY += 8;
    }

    // Common sections for all templates (if not already added)
    if (templateName !== 'creative') {
      // Skills
      if (data.skills?.length > 0) {
        currentY = addSection('SKILLS', currentY);
        const skillsText = Array.isArray(data.skills) ? data.skills.join(' • ') : data.skills;
        currentY = addText(skillsText, margin, currentY, {
          fontSize: 10,
          color: '#374151'
        });
      }

      // Education
      if (data.education?.length > 0) {
        currentY = addSection('EDUCATION', currentY);
        
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
        currentY = addSection('PROJECTS', currentY);
        
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

    console.log('Template-based PDF generated successfully!');
    return pdf;

  } catch (error) {
    console.error('Error in template-based PDF generation:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  }
};
