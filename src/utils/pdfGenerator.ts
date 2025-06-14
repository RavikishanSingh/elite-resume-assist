
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
    let currentY = 15;

    // Set default font
    pdf.setFont('helvetica');

    // Modern template colors - exact match
    const colors = {
      blue600: [37, 99, 235],     // #2563eb - main blue
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
      if (currentY + requiredSpace > pageHeight - 20) {
        pdf.addPage();
        currentY = 15;
        return true;
      }
      return false;
    };

    // Helper function to draw simple icons
    const drawIcon = (type: string, x: number, y: number) => {
      pdf.setDrawColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
      pdf.setLineWidth(0.2);
      
      switch (type) {
        case 'email':
          pdf.rect(x, y - 1, 3, 2, 'S');
          pdf.line(x, y, x + 1.5, y + 0.5);
          pdf.line(x + 1.5, y + 0.5, x + 3, y);
          break;
        case 'phone':
          pdf.roundedRect(x, y - 1.5, 1.5, 3, 0.3, 0.3, 'S');
          break;
        case 'location':
          pdf.circle(x + 1, y, 1, 'S');
          pdf.line(x + 1, y - 1, x + 1, y + 1);
          break;
        case 'linkedin':
          pdf.rect(x, y - 1, 2.5, 2, 'S');
          pdf.setFontSize(4);
          pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);
          pdf.text('in', x + 0.5, y + 0.3);
          break;
        case 'website':
          pdf.circle(x + 1.5, y, 1.5, 'S');
          pdf.line(x, y, x + 3, y);
          pdf.line(x + 1.5, y - 1.5, x + 1.5, y + 1.5);
          break;
      }
    };

    // MODERN TEMPLATE - Perfect Header Match
    if (templateName === 'modern') {
      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // HEADER SECTION - Exact match to template
      // Name - large, bold, dark gray (exactly like template)
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
      pdf.text(data.personalInfo?.fullName || '', 20, currentY);
      currentY += 8;

      // Blue horizontal line under name (thick line matching template exactly)
      pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
      pdf.setLineWidth(3.0);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 8;

      // Contact information - horizontal layout EXACTLY like template
      const contactStartY = currentY;
      let contactX = 20;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.gray600[0], colors.gray600[1], colors.gray600[2]);

      // First row of contact info
      if (data.personalInfo?.email) {
        drawIcon('email', contactX, contactStartY);
        pdf.text(data.personalInfo.email, contactX + 5, contactStartY);
        contactX += pdf.getTextWidth(data.personalInfo.email) + 15;
      }

      if (data.personalInfo?.phone) {
        drawIcon('phone', contactX, contactStartY);
        pdf.text(data.personalInfo.phone, contactX + 5, contactStartY);
        contactX += pdf.getTextWidth(data.personalInfo.phone) + 15;
      }

      if (data.personalInfo?.location) {
        drawIcon('location', contactX, contactStartY);
        pdf.text(data.personalInfo.location, contactX + 5, contactStartY);
        contactX += pdf.getTextWidth(data.personalInfo.location) + 15;
      }

      // Second row if needed
      let secondRowY = contactStartY;
      if (contactX > pageWidth - 40) {
        secondRowY += 5;
        contactX = 20;
      }

      if (data.personalInfo?.linkedIn) {
        drawIcon('linkedin', contactX, secondRowY);
        pdf.text(data.personalInfo.linkedIn, contactX + 5, secondRowY);
        contactX += pdf.getTextWidth(data.personalInfo.linkedIn) + 15;
      }

      if (data.personalInfo?.portfolio) {
        drawIcon('website', contactX, secondRowY);
        pdf.text(data.personalInfo.portfolio, contactX + 5, secondRowY);
      }

      currentY = Math.max(contactStartY, secondRowY) + 12;

      // Professional Summary section
      if (data.personalInfo?.summary) {
        checkPageBreak(20);
        
        // Section header with blue color and left border (EXACTLY like template)
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Summary', 25, currentY);
        
        // Blue left border (thick line EXACTLY matching template)
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(3.0);
        pdf.line(20, currentY - 4, 20, currentY + 1);
        
        currentY += 6;

        // Summary text with proper formatting
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
        const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - 40);
        
        summaryLines.forEach((line: string, index: number) => {
          checkPageBreak(5);
          pdf.text(line, 20, currentY + (index * 4));
        });
        currentY += (summaryLines.length * 4) + 10;
      }

      // Professional Experience section with perfect timeline
      if (data.experience?.length > 0) {
        checkPageBreak(25);
        
        // Section header EXACTLY like template
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Professional Experience', 25, currentY);
        
        // Blue left border EXACTLY matching template
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(3.0);
        pdf.line(20, currentY - 4, 20, currentY + 1);
        
        currentY += 10;

        // Timeline setup - EXACTLY like template
        const timelineX = 15;
        let timelineStartY = currentY;

        data.experience.forEach((exp: any, index: number) => {
          if (exp.jobTitle && exp.company) {
            checkPageBreak(25);
            
            // Timeline dot (blue circle) - EXACTLY like template
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(timelineX, currentY + 2, 2, 'F');

            // Job title - bold, larger font EXACTLY like template
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(exp.jobTitle, 25, currentY);
            currentY += 4;

            // Company name and date layout EXACTLY like template
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.text(exp.company, 25, currentY);

            // Date range - right aligned EXACTLY like template
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

            // Job description with proper spacing and page breaks
            if (exp.description) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
              const descLines = pdf.splitTextToSize(exp.description, pageWidth - 50);
              
              descLines.forEach((line: string, lineIndex: number) => {
                checkPageBreak(4);
                pdf.text(line, 25, currentY + (lineIndex * 4));
              });
              currentY += (descLines.length * 4) + 6;
            } else {
              currentY += 4;
            }

            // Draw timeline line segment if not the last item - EXACTLY like template
            if (index < data.experience.length - 1) {
              const nextItemY = currentY + 6;
              pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
              pdf.setLineWidth(1.0);
              pdf.line(timelineX, currentY - 2, timelineX, nextItemY);
            }

            currentY += 8;
          }
        });
      }

      // Projects section with timeline - EXACTLY like template
      if (data.projects?.length > 0) {
        checkPageBreak(25);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Projects', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(3.0);
        pdf.line(20, currentY - 4, 20, currentY + 1);
        
        currentY += 10;

        const timelineX = 15;

        data.projects.forEach((project: any, index: number) => {
          if (project.name) {
            checkPageBreak(20);
            
            // Timeline dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(timelineX, currentY + 2, 2, 'F');

            // Project name
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
            pdf.text(project.name, 25, currentY);
            currentY += 4;

            // Project description
            if (project.description) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(colors.gray700[0], colors.gray700[1], colors.gray700[2]);
              const descLines = pdf.splitTextToSize(project.description, pageWidth - 50);
              
              descLines.forEach((line: string, lineIndex: number) => {
                checkPageBreak(4);
                pdf.text(line, 25, currentY + (lineIndex * 4));
              });
              currentY += (descLines.length * 4) + 4;
            }

            // Technologies with blue tags - EXACTLY like template
            if (project.technologies) {
              const techs = project.technologies.split(',').map((t: string) => t.trim());
              let xPos = 25;
              
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
                  
                  checkPageBreak(6);
                  
                  // Draw rounded blue background - EXACTLY like template
                  pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
                  pdf.roundedRect(xPos, currentY - 2, tagWidth, 4, 1, 1, 'F');
                  
                  // Add tech text
                  pdf.setFont('helvetica', 'normal');
                  pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
                  pdf.text(tech, xPos + 2, currentY);
                  
                  xPos += tagWidth + 3;
                }
              });
              currentY += 8;
            }

            // Draw timeline line segment if not the last item
            if (index < data.projects.length - 1) {
              const nextItemY = currentY + 4;
              pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
              pdf.setLineWidth(1.0);
              pdf.line(timelineX, currentY - 2, timelineX, nextItemY);
            }

            currentY += 6;
          }
        });
      }

      // Education section - EXACTLY like template
      if (data.education?.length > 0) {
        checkPageBreak(20);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Education', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(3.0);
        pdf.line(20, currentY - 4, 20, currentY + 1);
        
        currentY += 10;

        data.education.forEach((edu: any) => {
          if (edu.degree && edu.school) {
            checkPageBreak(12);
            
            // Education dot
            pdf.setFillColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
            pdf.circle(15, currentY + 2, 2, 'F');

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

            currentY += 8;
          }
        });
      }

      // Skills section with rounded blue tags - EXACTLY like template
      if (data.skills?.length > 0) {
        checkPageBreak(15);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.text('Skills', 25, currentY);
        
        pdf.setDrawColor(colors.blue600[0], colors.blue600[1], colors.blue600[2]);
        pdf.setLineWidth(3.0);
        pdf.line(20, currentY - 4, 20, currentY + 1);
        
        currentY += 8;

        // Create skill tags with blue background and rounded edges - EXACTLY like template
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        let xPos = 20;

        validSkills.forEach((skill: string) => {
          const skillText = skill.trim();
          pdf.setFontSize(9);
          const textWidth = pdf.getTextWidth(skillText);
          const tagWidth = textWidth + 6;
          const tagHeight = 5;

          // Check if tag fits on current line
          if (xPos + tagWidth > pageWidth - 20) {
            xPos = 20;
            currentY += tagHeight + 3;
            checkPageBreak(tagHeight + 3);
          }

          // Draw rounded blue background - EXACTLY like template
          pdf.setFillColor(colors.blue100[0], colors.blue100[1], colors.blue100[2]);
          pdf.roundedRect(xPos, currentY - 2, tagWidth, tagHeight, 2, 2, 'F');

          // Add skill text
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.blue800[0], colors.blue800[1], colors.blue800[2]);
          pdf.text(skillText, xPos + 3, currentY + 1);

          xPos += tagWidth + 4;
        });

        currentY += 10;
      }
    }

    // Handle other templates with basic styling
    else {
      // Basic template for non-modern templates
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(colors.gray900[0], colors.gray900[1], colors.gray900[2]);
      pdf.text(data.personalInfo?.fullName || '', 20, currentY);
      currentY += 15;

      if (data.personalInfo?.summary) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SUMMARY', 20, currentY);
        currentY += 8;
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - 40);
        summaryLines.forEach((line: string, index: number) => {
          pdf.text(line, 20, currentY + (index * 5));
        });
        currentY += (summaryLines.length * 5) + 10;
      }

      if (data.experience?.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EXPERIENCE', 20, currentY);
        currentY += 8;

        data.experience.forEach((exp: any) => {
          if (exp.jobTitle && exp.company) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${exp.jobTitle} - ${exp.company}`, 20, currentY);
            currentY += 6;

            if (exp.description) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              const descLines = pdf.splitTextToSize(exp.description, pageWidth - 40);
              descLines.forEach((line: string, index: number) => {
                pdf.text(line, 20, currentY + (index * 4));
              });
              currentY += (descLines.length * 4) + 8;
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
