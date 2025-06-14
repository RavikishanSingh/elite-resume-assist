
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Generating Perfect Template PDF ===');
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
    let currentY = 25;

    // Set default font
    pdf.setFont('helvetica');

    // Color definitions matching the Modern template exactly
    const colors = {
      blue600: [37, 99, 235],     // #2563eb - main blue
      blue500: [59, 130, 246],    // #3b82f6 - lighter blue
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
      
      pdf.setFontSize(options.fontSize || 11);
      pdf.setFont('helvetica', options.fontStyle || 'normal');
      pdf.setTextColor(options.color?.[0] || 0, options.color?.[1] || 0, options.color?.[2] || 0);
      
      const maxWidth = options.maxWidth || (pageWidth - 40);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      if (y + (lines.length * (options.lineHeight || 6)) > pageHeight - 25) {
        pdf.addPage();
        y = 25;
      }
      
      pdf.text(lines, x, y);
      return y + (lines.length * (options.lineHeight || 6)) + (options.marginBottom || 0);
    };

    // MODERN TEMPLATE - Exact Visual Match
    if (templateName === 'modern') {
      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header section
      // Name - large, bold, dark gray (matching first image)
      currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
        fontSize: 32,
        fontStyle: 'bold',
        color: colors.gray900,
        marginBottom: 3
      });

      // Blue horizontal line under name (4px thick like in template)
      pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
      pdf.setLineWidth(1.2);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 8;

      // Contact information - horizontal layout like in template
      const contactInfo = [];
      if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
      if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
      if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
      if (data.personalInfo?.linkedIn) contactInfo.push(data.personalInfo.linkedIn);
      if (data.personalInfo?.portfolio) contactInfo.push(data.personalInfo.portfolio);

      if (contactInfo.length > 0) {
        const contactText = contactInfo.join(' • ');
        currentY = addText(contactText, 20, currentY, {
          fontSize: 10,
          color: colors.gray600,
          marginBottom: 12
        });
      }

      // Professional Summary section
      if (data.personalInfo?.summary) {
        // Section header with blue color and left border (matching first image)
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Summary', 25, currentY);
        
        // Blue left border (thick line like in template)
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.2);
        pdf.line(20, currentY - 3, 20, currentY + 3);
        
        currentY += 8;

        // Summary text with proper spacing
        currentY = addText(data.personalInfo.summary, 20, currentY, {
          fontSize: 10,
          color: colors.gray700,
          marginBottom: 12,
          lineHeight: 5
        });
      }

      // Professional Experience section
      if (data.experience?.length > 0) {
        // Section header matching template style
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Experience', 25, currentY);
        
        // Blue left border
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.2);
        pdf.line(20, currentY - 3, 20, currentY + 3);
        
        currentY += 12;

        data.experience.forEach((exp: any, index: number) => {
          if (exp.jobTitle && exp.company) {
            // Timeline dot (blue circle like in template)
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(16, currentY - 1, 1.5, 'F');
            
            // Vertical timeline line
            if (index < data.experience.length - 1) {
              pdf.setDrawColor(200, 200, 200);
              pdf.setLineWidth(0.5);
              pdf.line(16, currentY + 3, 16, currentY + 22);
            }

            // Job title - bold, larger font
            currentY = addText(exp.jobTitle, 22, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 2
            });

            // Company name - blue color like in template
            currentY = addText(exp.company, 22, currentY, {
              fontSize: 11,
              fontStyle: 'normal',
              color: colors.blue600,
              marginBottom: 1
            });

            // Date range - right aligned
            const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            if (dateText.trim() !== ' - ') {
              const dateWidth = pdf.getTextWidth(dateText);
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              pdf.text(dateText, pageWidth - 20 - dateWidth, currentY - 12);
            }

            // Location if available
            if (exp.location) {
              currentY = addText(exp.location, 22, currentY, {
                fontSize: 9,
                color: colors.gray600,
                marginBottom: 2
              });
            }

            // Job description with proper spacing
            if (exp.description) {
              currentY = addText(exp.description, 22, currentY + 1, {
                fontSize: 10,
                color: colors.gray700,
                marginBottom: 10,
                lineHeight: 4.5,
                maxWidth: pageWidth - 45
              });
            }

            currentY += 4;
          }
        });
      }

      // Projects section
      if (data.projects?.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Projects', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.2);
        pdf.line(20, currentY - 3, 20, currentY + 3);
        
        currentY += 12;

        data.projects.forEach((project: any, index: number) => {
          if (project.name) {
            // Timeline dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(16, currentY - 1, 1.5, 'F');
            
            if (index < data.projects.length - 1) {
              pdf.setDrawColor(200, 200, 200);
              pdf.setLineWidth(0.5);
              pdf.line(16, currentY + 3, 16, currentY + 18);
            }

            currentY = addText(project.name, 22, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 2
            });

            if (project.description) {
              currentY = addText(project.description, 22, currentY, {
                fontSize: 10,
                color: colors.gray700,
                marginBottom: 4,
                lineHeight: 4.5
              });
            }

            if (project.technologies) {
              const techs = project.technologies.split(',').map((t: string) => t.trim());
              const techText = techs.join(' • ');
              currentY = addText(techText, 22, currentY, {
                fontSize: 9,
                color: colors.blue800,
                marginBottom: 8
              });
            }

            currentY += 3;
          }
        });
      }

      // Education section
      if (data.education?.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Education', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.2);
        pdf.line(20, currentY - 3, 20, currentY + 3);
        
        currentY += 12;

        data.education.forEach((edu: any, index: number) => {
          if (edu.degree && edu.school) {
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(16, currentY - 1, 1.5, 'F');

            currentY = addText(edu.degree, 22, currentY, {
              fontSize: 11,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 1
            });

            currentY = addText(edu.school, 22, currentY, {
              fontSize: 10,
              color: colors.blue600,
              marginBottom: 1
            });

            if (edu.graduationDate) {
              const gradWidth = pdf.getTextWidth(edu.graduationDate);
              pdf.setFontSize(9);
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              pdf.text(edu.graduationDate, pageWidth - 20 - gradWidth, currentY - 8);
            }

            currentY += 8;
          }
        });
      }

      // Skills section with blue tags like in template
      if (data.skills?.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Skills', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.2);
        pdf.line(20, currentY - 3, 20, currentY + 3);
        
        currentY += 10;

        // Create skill tags with blue background like in template
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        let xPos = 20;
        let yPos = currentY;
        const tagHeight = 5;
        const tagPadding = 2;

        validSkills.forEach((skill: string) => {
          const skillText = skill.trim();
          pdf.setFontSize(8);
          const textWidth = pdf.getTextWidth(skillText);
          const tagWidth = textWidth + (tagPadding * 2);

          // Check if tag fits on current line
          if (xPos + tagWidth > pageWidth - 20) {
            xPos = 20;
            yPos += tagHeight + 3;
          }

          // Draw blue background rectangle (rounded corners simulation)
          pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
          pdf.roundedRect(xPos, yPos - 3, tagWidth, tagHeight, 0.5, 0.5, 'F');

          // Add skill text in blue
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
          pdf.text(skillText, xPos + tagPadding, yPos);

          xPos += tagWidth + 3;
        });

        currentY = yPos + 8;
      }
    }

    // Handle other templates with basic styling for now
    else {
      // Basic template for non-modern templates
      currentY = addText(data.personalInfo?.fullName || '', 20, currentY, {
        fontSize: 24,
        fontStyle: 'bold',
        color: colors.gray900,
        marginBottom: 10
      });

      if (data.personalInfo?.summary) {
        currentY = addText('SUMMARY', 20, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: colors.gray900,
          marginBottom: 5
        });
        
        currentY = addText(data.personalInfo.summary, 20, currentY, {
          fontSize: 11,
          color: colors.gray700,
          marginBottom: 15
        });
      }

      // Add other sections with basic formatting
      if (data.experience?.length > 0) {
        currentY = addText('EXPERIENCE', 20, currentY, {
          fontSize: 14,
          fontStyle: 'bold',
          color: colors.gray900,
          marginBottom: 5
        });

        data.experience.forEach((exp: any) => {
          if (exp.jobTitle && exp.company) {
            currentY = addText(`${exp.jobTitle} - ${exp.company}`, 20, currentY, {
              fontSize: 12,
              fontStyle: 'bold',
              color: colors.gray900,
              marginBottom: 2
            });

            if (exp.description) {
              currentY = addText(exp.description, 20, currentY, {
                fontSize: 10,
                color: colors.gray700,
                marginBottom: 8
              });
            }
          }
        });
      }
    }

    console.log('Perfect Modern template PDF generated!');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
