
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
    let currentPage = 1;

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

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - 25) {
        pdf.addPage();
        currentY = 25;
        currentPage++;
        return true;
      }
      return false;
    };

    // Helper function to add text with proper wrapping and page breaks
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (!text || text.trim() === '') return y;
      
      pdf.setFontSize(options.fontSize || 11);
      pdf.setFont('helvetica', options.fontStyle || 'normal');
      pdf.setTextColor(options.color?.[0] || 0, options.color?.[1] || 0, options.color?.[2] || 0);
      
      const maxWidth = options.maxWidth || (pageWidth - 40);
      const lines = pdf.splitTextToSize(text, maxWidth);
      const lineHeight = options.lineHeight || 6;
      const totalHeight = lines.length * lineHeight;
      
      // Check if we need a new page
      if (y + totalHeight > pageHeight - 25) {
        pdf.addPage();
        y = 25;
        currentPage++;
      }
      
      pdf.text(lines, x, y);
      return y + totalHeight + (options.marginBottom || 0);
    };

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number, style: string = 'S') => {
      pdf.roundedRect(x, y, width, height, radius, radius, style);
    };

    // Simple icon drawing functions using basic shapes
    const drawEmailIcon = (x: number, y: number, size: number = 3) => {
      pdf.setDrawColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
      pdf.setLineWidth(0.3);
      pdf.rect(x, y - size/2, size, size/1.5, 'S');
      pdf.line(x, y - size/4, x + size/2, y + size/8);
      pdf.line(x + size/2, y + size/8, x + size, y - size/4);
    };

    const drawPhoneIcon = (x: number, y: number, size: number = 3) => {
      pdf.setDrawColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(x, y - size/2, size/2, size, 0.5, 0.5, 'S');
    };

    const drawLocationIcon = (x: number, y: number, size: number = 3) => {
      pdf.setDrawColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
      pdf.setLineWidth(0.3);
      pdf.circle(x + size/4, y - size/4, size/4, 'S');
      pdf.line(x + size/4, y - size/2, x + size/4, y + size/4);
    };

    const drawLinkedInIcon = (x: number, y: number, size: number = 3) => {
      pdf.setDrawColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
      pdf.setLineWidth(0.3);
      pdf.rect(x, y - size/2, size, size, 'S');
      pdf.setFontSize(6);
      pdf.text('in', x + size/4, y + size/8);
    };

    const drawGlobeIcon = (x: number, y: number, size: number = 3) => {
      pdf.setDrawColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
      pdf.setLineWidth(0.3);
      pdf.circle(x + size/2, y, size/2, 'S');
      pdf.line(x, y, x + size, y);
      pdf.line(x + size/2, y - size/2, x + size/2, y + size/2);
    };

    // MODERN TEMPLATE - Perfect Match
    if (templateName === 'modern') {
      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // HEADER SECTION - Exact match to template
      // Name - large, bold, dark gray
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
      pdf.text(data.personalInfo?.fullName || '', 20, currentY);
      currentY += 12;

      // Blue horizontal line under name (thick line matching template)
      pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
      pdf.setLineWidth(2.0);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 10;

      // Contact information - horizontal layout with icons (matching template exactly)
      const contactY = currentY;
      let contactX = 20;
      const contactSpacing = 45; // Space between contact items
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);

      // Email with icon
      if (data.personalInfo?.email) {
        drawEmailIcon(contactX, contactY, 3);
        pdf.text(data.personalInfo.email, contactX + 6, contactY);
        contactX += Math.max(pdf.getTextWidth(data.personalInfo.email) + 10, contactSpacing);
      }

      // Phone with icon
      if (data.personalInfo?.phone) {
        drawPhoneIcon(contactX, contactY, 3);
        pdf.text(data.personalInfo.phone, contactX + 6, contactY);
        contactX += Math.max(pdf.getTextWidth(data.personalInfo.phone) + 10, contactSpacing);
      }

      // Location with icon
      if (data.personalInfo?.location) {
        drawLocationIcon(contactX, contactY, 3);
        pdf.text(data.personalInfo.location, contactX + 6, contactY);
        contactX += Math.max(pdf.getTextWidth(data.personalInfo.location) + 10, contactSpacing);
      }

      // Move to next line if needed for remaining items
      if (contactX > pageWidth - 60) {
        currentY += 6;
        contactX = 20;
      }

      // LinkedIn with icon
      if (data.personalInfo?.linkedIn) {
        drawLinkedInIcon(contactX, currentY, 3);
        pdf.text(data.personalInfo.linkedIn, contactX + 6, currentY);
        contactX += Math.max(pdf.getTextWidth(data.personalInfo.linkedIn) + 10, contactSpacing);
      }

      // Portfolio with icon
      if (data.personalInfo?.portfolio) {
        drawGlobeIcon(contactX, currentY, 3);
        pdf.text(data.personalInfo.portfolio, contactX + 6, currentY);
      }

      currentY += 15;

      // Professional Summary section
      if (data.personalInfo?.summary) {
        checkPageBreak(25);
        
        // Section header with blue color and left border
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Summary', 25, currentY);
        
        // Blue left border (thick line)
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(2.0);
        pdf.line(20, currentY - 5, 20, currentY + 2);
        
        currentY += 8;

        // Summary text with proper spacing and formatting
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
        const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - 40);
        
        summaryLines.forEach((line: string, index: number) => {
          if (currentY > pageHeight - 25) {
            pdf.addPage();
            currentY = 25;
          }
          pdf.text(line, 20, currentY + (index * 5));
        });
        currentY += (summaryLines.length * 5) + 15;
      }

      // Professional Experience section with timeline
      if (data.experience?.length > 0) {
        checkPageBreak(30);
        
        // Section header
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Experience', 25, currentY);
        
        // Blue left border
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(2.0);
        pdf.line(20, currentY - 5, 20, currentY + 2);
        
        currentY += 15;

        // Timeline line start position
        const timelineX = 15;
        const timelineStartY = currentY;

        data.experience.forEach((exp: any, index: number) => {
          if (exp.jobTitle && exp.company) {
            checkPageBreak(35); // Check for enough space for experience item
            
            // Timeline dot (blue circle)
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(timelineX, currentY, 2.5, 'F');

            // Job title - bold, larger font
            pdf.setFontSize(13);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(exp.jobTitle, 25, currentY);
            currentY += 6;

            // Company name and date on same line
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.text(exp.company, 25, currentY);

            // Date range - right aligned
            const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            if (dateText.trim() !== ' - ') {
              pdf.setFontSize(11);
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              const dateWidth = pdf.getTextWidth(dateText);
              pdf.text(dateText, pageWidth - 20 - dateWidth, currentY);
            }
            currentY += 5;

            // Location if available
            if (exp.location) {
              pdf.setFontSize(10);
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              pdf.text(exp.location, 25, currentY);
              currentY += 5;
            }

            // Job description with proper spacing
            if (exp.description) {
              pdf.setFontSize(11);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
              const descLines = pdf.splitTextToSize(exp.description, pageWidth - 50);
              
              descLines.forEach((line: string, lineIndex: number) => {
                if (currentY > pageHeight - 25) {
                  pdf.addPage();
                  currentY = 25;
                }
                pdf.text(line, 25, currentY + (lineIndex * 5));
              });
              currentY += (descLines.length * 5) + 10;
            } else {
              currentY += 8;
            }

            // Draw timeline line segment if not the last item
            if (index < data.experience.length - 1) {
              const nextItemY = currentY + 10;
              pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
              pdf.setLineWidth(1.0);
              pdf.line(timelineX, currentY - 5, timelineX, nextItemY);
            }
          }
        });

        currentY += 10;
      }

      // Projects section with timeline
      if (data.projects?.length > 0) {
        checkPageBreak(30);
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Projects', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(2.0);
        pdf.line(20, currentY - 5, 20, currentY + 2);
        
        currentY += 15;

        const timelineX = 15;

        data.projects.forEach((project: any, index: number) => {
          if (project.name) {
            checkPageBreak(25);
            
            // Timeline dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(timelineX, currentY, 2.5, 'F');

            // Project name
            pdf.setFontSize(13);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(project.name, 25, currentY);
            currentY += 6;

            // Project description
            if (project.description) {
              pdf.setFontSize(11);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
              const descLines = pdf.splitTextToSize(project.description, pageWidth - 50);
              
              descLines.forEach((line: string, lineIndex: number) => {
                if (currentY > pageHeight - 25) {
                  pdf.addPage();
                  currentY = 25;
                }
                pdf.text(line, 25, currentY + (lineIndex * 5));
              });
              currentY += (descLines.length * 5) + 5;
            }

            // Technologies with blue tags
            if (project.technologies) {
              const techs = project.technologies.split(',').map((t: string) => t.trim());
              let xPos = 25;
              const tagY = currentY;
              
              techs.forEach((tech: string) => {
                if (tech) {
                  pdf.setFontSize(9);
                  const textWidth = pdf.getTextWidth(tech);
                  const tagWidth = textWidth + 4;
                  
                  // Check if tag fits on current line
                  if (xPos + tagWidth > pageWidth - 20) {
                    xPos = 25;
                    currentY += 7;
                  }
                  
                  // Check for page break
                  if (currentY > pageHeight - 25) {
                    pdf.addPage();
                    currentY = 25;
                    xPos = 25;
                  }
                  
                  // Draw rounded blue background
                  pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
                  drawRoundedRect(xPos, currentY - 3, tagWidth, 6, 2, 'F');
                  
                  // Add tech text
                  pdf.setFont('helvetica', 'normal');
                  pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
                  pdf.text(tech, xPos + 2, currentY + 1);
                  
                  xPos += tagWidth + 4;
                }
              });
              currentY += 10;
            }
            
            currentY += 5;

            // Draw timeline line segment if not the last item
            if (index < data.projects.length - 1) {
              const nextItemY = currentY + 5;
              pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
              pdf.setLineWidth(1.0);
              pdf.line(timelineX, currentY - 5, timelineX, nextItemY);
            }
          }
        });
      }

      // Education section
      if (data.education?.length > 0) {
        checkPageBreak(25);
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Education', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(2.0);
        pdf.line(20, currentY - 5, 20, currentY + 2);
        
        currentY += 15;

        data.education.forEach((edu: any) => {
          if (edu.degree && edu.school) {
            checkPageBreak(15);
            
            // Education dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(15, currentY, 2.5, 'F');

            // Degree
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(edu.degree, 25, currentY);
            currentY += 5;

            // School and graduation date
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.text(edu.school, 25, currentY);

            if (edu.graduationDate) {
              pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
              const gradWidth = pdf.getTextWidth(edu.graduationDate);
              pdf.text(edu.graduationDate, pageWidth - 20 - gradWidth, currentY);
            }

            currentY += 12;
          }
        });
      }

      // Skills section with rounded blue tags
      if (data.skills?.length > 0) {
        checkPageBreak(20);
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Skills', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(2.0);
        pdf.line(20, currentY - 5, 20, currentY + 2);
        
        currentY += 12;

        // Create skill tags with blue background and rounded edges
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        let xPos = 20;
        let yPos = currentY;

        validSkills.forEach((skill: string) => {
          const skillText = skill.trim();
          pdf.setFontSize(10);
          const textWidth = pdf.getTextWidth(skillText);
          const tagWidth = textWidth + 8;
          const tagHeight = 7;

          // Check if tag fits on current line
          if (xPos + tagWidth > pageWidth - 20) {
            xPos = 20;
            yPos += tagHeight + 4;
            
            // Check for page break
            if (yPos > pageHeight - 25) {
              pdf.addPage();
              yPos = 25;
              xPos = 20;
            }
          }

          // Draw rounded blue background
          pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
          drawRoundedRect(xPos, yPos - 4, tagWidth, tagHeight, 3, 'F');

          // Add skill text
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
          pdf.text(skillText, xPos + 4, yPos);

          xPos += tagWidth + 5;
        });

        currentY = yPos + 12;
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

    console.log('Perfect Modern template PDF generated with exact layout matching and proper pagination!');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
