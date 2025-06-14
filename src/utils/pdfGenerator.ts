
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Generating Pixel-Perfect Template PDF ===');
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

    // Set default font
    pdf.setFont('helvetica');

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [0, 0, 0];
    };

    // Color definitions matching the Modern template exactly
    const colors = {
      blue600: [37, 99, 235],     // #2563eb - main blue
      gray900: [17, 24, 39],      // #111827 - dark text
      gray700: [55, 65, 81],      // #374151 - medium text
      gray600: [75, 85, 99],      // #4b5563 - light text
      blue100: [219, 234, 254],   // #dbeafe - blue background
      blue800: [30, 64, 175],     // #1e40af - blue text on blue bg
      white: [255, 255, 255]
    };

    // Helper function to add text with proper wrapping
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (!text || text.trim() === '') return y;
      
      pdf.setFontSize(options.fontSize || 10);
      pdf.setFont('helvetica', options.fontStyle || 'normal');
      pdf.setTextColor(options.color?.[0] || 0, options.color?.[1] || 0, options.color?.[2] || 0);
      
      const maxWidth = options.maxWidth || (pageWidth - 40);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      if (y + (lines.length * (options.lineHeight || 5)) > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.text(lines, x, y);
      return y + (lines.length * (options.lineHeight || 5)) + (options.marginBottom || 0);
    };

    // MODERN TEMPLATE - Exact match
    if (templateName === 'modern') {
      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header section with blue bottom border (4px thick)
      const headerY = currentY;
      
      // Name - large, bold, dark gray
      currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
        fontSize: 28,
        fontStyle: 'bold',
        color: colors.gray900,
        marginBottom: 6
      });

      // Blue border line (4px thick like CSS border-bottom-4)
      pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
      pdf.setLineWidth(1.5); // 4px equivalent in mm
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 8;

      // Contact information - gray text with icons spacing
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(`✉ ${data.personalInfo.email}`);
      if (data.personalInfo?.phone) contactInfo.push(`📞 ${data.personalInfo.phone}`);
      if (data.personalInfo?.location) contactInfo.push(`📍 ${data.personalInfo.location}`);
      if (data.personalInfo?.linkedIn) contactInfo.push(`💼 ${data.personalInfo.linkedIn}`);
      if (data.personalInfo?.portfolio) contactInfo.push(`🌐 ${data.personalInfo.portfolio}`);

      if (contactInfo.length > 0) {
        // Split contact info into multiple lines if too long
        const contactText = contactInfo.join('  •  ');
        currentY = addText(contactText, 20, currentY, {
          fontSize: 10,
          color: colors.gray600,
          marginBottom: 15,
          maxWidth: pageWidth - 40
        });
      }

      // Professional Summary section
      if (data.personalInfo?.summary) {
        // Section header with blue color and left border
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('PROFESSIONAL SUMMARY', 25, currentY);
        
        // Blue left border (4px thick)
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 10;

        // Summary text
        currentY = addText(data.personalInfo.summary, 20, currentY, {
          fontSize: 11,
          color: colors.gray700,
          marginBottom: 15,
          lineHeight: 6
        });
      }

      // Professional Experience section
      if (data.experience?.length > 0) {
        // Section header
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('PROFESSIONAL EXPERIENCE', 25, currentY);
        
        // Blue left border
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 12;

        data.experience.forEach((exp: any, index: number) => {
          if (exp.jobTitle && exp.company) {
            // Timeline dot (blue circle)
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(18, currentY - 2, 1.5, 'F');
            
            // Vertical line for timeline
            if (index < data.experience.length - 1) {
              pdf.setDrawColor(200, 200, 200);
              pdf.setLineWidth(0.5);
              pdf.line(18, currentY + 2, 18, currentY + 25);
            }

            // Job title - large, bold, dark
            currentY = addText(exp.jobTitle, 25, currentY, {
              fontSize: 14,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 3
            });

            // Company name - blue, medium weight
            currentY = addText(exp.company, 25, currentY, {
              fontSize: 12,
              fontStyle: 'normal',
              color: colors.blue600,
              marginBottom: 2
            });

            // Location if available
            if (exp.location) {
              currentY = addText(exp.location, 25, currentY, {
                fontSize: 10,
                color: colors.gray600,
                marginBottom: 2
              });
            }

            // Date range - right aligned
            const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            const dateWidth = pdf.getTextWidth(dateText);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
            pdf.text(dateText, pageWidth - 20 - dateWidth, currentY - 15);

            // Job description
            if (exp.description) {
              currentY = addText(exp.description, 25, currentY + 2, {
                fontSize: 10,
                color: colors.gray700,
                marginBottom: 15,
                lineHeight: 5,
                maxWidth: pageWidth - 50
              });
            }

            currentY += 5;
          }
        });
      }

      // Projects section
      if (data.projects?.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('PROJECTS', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 12;

        data.projects.forEach((project: any, index: number) => {
          if (project.name) {
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(18, currentY - 2, 1.5, 'F');
            
            if (index < data.projects.length - 1) {
              pdf.setDrawColor(200, 200, 200);
              pdf.setLineWidth(0.5);
              pdf.line(18, currentY + 2, 18, currentY + 20);
            }

            currentY = addText(project.name, 25, currentY, {
              fontSize: 14,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 3
            });

            if (project.description) {
              currentY = addText(project.description, 25, currentY, {
                fontSize: 10,
                color: colors.gray700,
                marginBottom: 8,
                lineHeight: 5
              });
            }

            if (project.technologies) {
              const techs = project.technologies.split(',').map((t: string) => t.trim());
              const techText = techs.join(' • ');
              currentY = addText(techText, 25, currentY, {
                fontSize: 9,
                color: colors.blue800,
                marginBottom: 10
              });
            }

            currentY += 3;
          }
        });
      }

      // Education section
      if (data.education?.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('EDUCATION', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 12;

        data.education.forEach((edu: any, index: number) => {
          if (edu.degree && edu.school) {
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(18, currentY - 2, 1.5, 'F');

            currentY = addText(edu.degree, 25, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 2
            });

            currentY = addText(edu.school, 25, currentY, {
              fontSize: 11,
              color: colors.blue600,
              marginBottom: 2
            });

            if (edu.graduationDate) {
              const gradWidth = pdf.getTextWidth(edu.graduationDate);
              pdf.setFontSize(10);
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              pdf.text(edu.graduationDate, pageWidth - 20 - gradWidth, currentY - 10);
            }

            currentY += 8;
          }
        });
      }

      // Skills section
      if (data.skills?.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('SKILLS', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 10;

        // Create skill tags similar to the template
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        let xPos = 20;
        let yPos = currentY;
        const tagHeight = 6;
        const tagPadding = 3;

        validSkills.forEach((skill: string) => {
          const skillText = skill.trim();
          const textWidth = pdf.getTextWidth(skillText);
          const tagWidth = textWidth + (tagPadding * 2);

          // Check if tag fits on current line
          if (xPos + tagWidth > pageWidth - 20) {
            xPos = 20;
            yPos += tagHeight + 3;
          }

          // Draw blue background (rounded rectangle simulation)
          pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
          pdf.roundedRect(xPos, yPos - 4, tagWidth, tagHeight, 1, 1, 'F');

          // Add skill text
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
          pdf.text(skillText, xPos + tagPadding, yPos);

          xPos += tagWidth + 4;
        });

        currentY = yPos + 8;
      }
    }

    console.log('Pixel-perfect Modern template PDF generated!');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
