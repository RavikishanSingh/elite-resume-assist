
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Generating Perfect Modern Template PDF ===');
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

    // Modern template colors - exact match
    const colors = {
      blue600: [37, 99, 235],     // #2563eb - main blue
      blue500: [59, 130, 246],    // #3b82f6 - lighter blue
      gray900: [17, 24, 39],      // #111827 - dark text
      gray700: [55, 65, 81],      // #374151 - medium text
      gray600: [75, 85, 99],      // #4b5563 - light text
      blue100: [219, 234, 254],   // #dbeafe - blue background
      blue800: [30, 64, 175],     // #1e40af - blue text on blue bg
      white: [255, 255, 255],
      lightGray: [229, 231, 235]  // #e5e7eb - light gray for lines
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

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number, style: string = 'S') => {
      pdf.roundedRect(x, y, width, height, radius, radius, style);
    };

    // MODERN TEMPLATE - Perfect Match
    if (templateName === 'modern') {
      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // HEADER SECTION - Exact match to template
      // Name - large, bold, dark gray
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
      pdf.text(data.personalInfo?.fullName || '', 20, currentY);
      currentY += 8;

      // Blue horizontal line under name (matching template thickness)
      pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
      pdf.setLineWidth(1.0);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 8;

      // Contact information - horizontal layout with proper spacing
      const contactItems = [];
      if (data.personalInfo?.email) contactItems.push(data.personalInfo.email);
      if (data.personalInfo?.phone) contactItems.push(data.personalInfo.phone);
      if (data.personalInfo?.location) contactItems.push(data.personalInfo.location);
      if (data.personalInfo?.linkedIn) contactItems.push(data.personalInfo.linkedIn);
      if (data.personalInfo?.portfolio) contactItems.push(data.personalInfo.portfolio);

      if (contactItems.length > 0) {
        // Create proper contact layout with dots as separators
        const contactText = contactItems.join(' • ');
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
        
        // Split into multiple lines if too long
        const contactLines = pdf.splitTextToSize(contactText, pageWidth - 40);
        contactLines.forEach((line: string, index: number) => {
          pdf.text(line, 20, currentY + (index * 4));
        });
        currentY += (contactLines.length * 4) + 8;
      }

      // Professional Summary section
      if (data.personalInfo?.summary) {
        // Section header with blue color and left border
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Summary', 25, currentY);
        
        // Blue left border (thick line)
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 10;

        // Summary text with proper spacing and formatting
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
        const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - 40);
        summaryLines.forEach((line: string, index: number) => {
          pdf.text(line, 20, currentY + (index * 4.5));
        });
        currentY += (summaryLines.length * 4.5) + 12;
      }

      // Professional Experience section with timeline
      if (data.experience?.length > 0) {
        // Section header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Experience', 25, currentY);
        
        // Blue left border
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 12;

        // Calculate total timeline height for the continuous line
        let timelineStartY = currentY;
        let timelineEndY = currentY;
        
        // Pre-calculate timeline end position
        data.experience.forEach((exp: any) => {
          if (exp.jobTitle && exp.company) {
            timelineEndY += 25; // Approximate height per experience item
            if (exp.description) {
              const descLines = pdf.splitTextToSize(exp.description, pageWidth - 50);
              timelineEndY += descLines.length * 4;
            }
          }
        });

        // Draw continuous vertical timeline line (light gray)
        pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
        pdf.setLineWidth(0.8);
        pdf.line(15, timelineStartY, 15, timelineEndY - 10);

        data.experience.forEach((exp: any, index: number) => {
          if (exp.jobTitle && exp.company) {
            // Timeline dot (blue circle)
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(15, currentY, 2, 'F');

            // Job title - bold, larger font
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(exp.jobTitle, 25, currentY);
            currentY += 5;

            // Company name and date on same line
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.text(exp.company, 25, currentY);

            // Date range - right aligned
            const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            if (dateText.trim() !== ' - ') {
              pdf.setFontSize(10);
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              const dateWidth = pdf.getTextWidth(dateText);
              pdf.text(dateText, pageWidth - 20 - dateWidth, currentY);
            }
            currentY += 4;

            // Location if available
            if (exp.location) {
              pdf.setFontSize(9);
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              pdf.text(exp.location, 25, currentY);
              currentY += 4;
            }

            // Job description with proper spacing
            if (exp.description) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
              const descLines = pdf.splitTextToSize(exp.description, pageWidth - 50);
              descLines.forEach((line: string, lineIndex: number) => {
                pdf.text(line, 25, currentY + (lineIndex * 4));
              });
              currentY += (descLines.length * 4) + 8;
            } else {
              currentY += 6;
            }
          }
        });

        currentY += 6;
      }

      // Projects section with timeline
      if (data.projects?.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Projects', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 12;

        // Calculate timeline for projects
        let projectTimelineStart = currentY;
        let projectTimelineEnd = currentY;
        
        data.projects.forEach((project: any) => {
          if (project.name) {
            projectTimelineEnd += 20;
            if (project.description) {
              const descLines = pdf.splitTextToSize(project.description, pageWidth - 50);
              projectTimelineEnd += descLines.length * 4;
            }
          }
        });

        // Draw continuous vertical timeline line
        pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
        pdf.setLineWidth(0.8);
        pdf.line(15, projectTimelineStart, 15, projectTimelineEnd - 10);

        data.projects.forEach((project: any) => {
          if (project.name) {
            // Timeline dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(15, currentY, 2, 'F');

            // Project name
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(project.name, 25, currentY);
            currentY += 5;

            // Project description
            if (project.description) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
              const descLines = pdf.splitTextToSize(project.description, pageWidth - 50);
              descLines.forEach((line: string, lineIndex: number) => {
                pdf.text(line, 25, currentY + (lineIndex * 4));
              });
              currentY += (descLines.length * 4) + 4;
            }

            // Technologies with blue tags
            if (project.technologies) {
              const techs = project.technologies.split(',').map((t: string) => t.trim());
              let xPos = 25;
              const tagY = currentY;
              
              techs.forEach((tech: string) => {
                if (tech) {
                  pdf.setFontSize(8);
                  const textWidth = pdf.getTextWidth(tech);
                  const tagWidth = textWidth + 4;
                  
                  // Check if tag fits on current line
                  if (xPos + tagWidth > pageWidth - 20) {
                    xPos = 25;
                    currentY += 6;
                  }
                  
                  // Draw rounded blue background
                  pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
                  drawRoundedRect(xPos, currentY - 3, tagWidth, 5, 1, 'F');
                  
                  // Add tech text
                  pdf.setFont('helvetica', 'normal');
                  pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
                  pdf.text(tech, xPos + 2, currentY);
                  
                  xPos += tagWidth + 3;
                }
              });
              currentY += 8;
            }
            
            currentY += 4;
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
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 12;

        data.education.forEach((edu: any) => {
          if (edu.degree && edu.school) {
            // Education dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(15, currentY, 2, 'F');

            // Degree
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(edu.degree, 25, currentY);
            currentY += 4;

            // School and graduation date
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.text(edu.school, 25, currentY);

            if (edu.graduationDate) {
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              const gradWidth = pdf.getTextWidth(edu.graduationDate);
              pdf.text(edu.graduationDate, pageWidth - 20 - gradWidth, currentY);
            }

            currentY += 10;
          }
        });
      }

      // Skills section with rounded blue tags
      if (data.skills?.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Skills', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(1.5);
        pdf.line(20, currentY - 4, 20, currentY + 2);
        
        currentY += 10;

        // Create skill tags with blue background and rounded edges
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        let xPos = 20;
        let yPos = currentY;

        validSkills.forEach((skill: string) => {
          const skillText = skill.trim();
          pdf.setFontSize(9);
          const textWidth = pdf.getTextWidth(skillText);
          const tagWidth = textWidth + 6;
          const tagHeight = 6;

          // Check if tag fits on current line
          if (xPos + tagWidth > pageWidth - 20) {
            xPos = 20;
            yPos += tagHeight + 3;
          }

          // Draw rounded blue background
          pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
          drawRoundedRect(xPos, yPos - 4, tagWidth, tagHeight, 2, 'F');

          // Add skill text
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
          pdf.text(skillText, xPos + 3, yPos);

          xPos += tagWidth + 4;
        });

        currentY = yPos + 10;
      }
    }

    // Handle other templates with basic styling
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

    console.log('Perfect Modern template PDF generated with exact layout matching!');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
