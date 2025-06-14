
import jsPDF from 'jspdf';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== PDF Generation Started ===');
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

    // Color palette
    const colors = {
      primary: [37, 99, 235],      // Blue
      secondary: [75, 85, 99],     // Gray
      text: [17, 24, 39],          // Dark gray
      light: [229, 231, 235],      // Light gray
      white: [255, 255, 255],
      purple: [147, 51, 234],      // Purple for creative
      green: [34, 197, 94],        // Green for tech
      pink: [236, 72, 153]         // Pink for creative
    };

    // Helper function for page breaks
    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
        return true;
      }
      return false;
    };

    // Template-specific styling
    switch (templateName) {
      case 'modern':
        // Modern template with blue theme
        pdf.setFontSize(32);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        pdf.text(data.personalInfo?.fullName || '', 20, currentY);
        currentY += 8;

        // Blue line under name
        pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setLineWidth(2);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;
        break;

      case 'creative':
        // Creative template with purple/pink gradient effect
        pdf.setFillColor(colors.purple[0], colors.purple[1], colors.purple[2]);
        pdf.rect(15, 15, pageWidth - 30, 25, 'F');
        
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        pdf.text(data.personalInfo?.fullName || '', 20, currentY + 15);
        currentY += 35;
        break;

      case 'tech':
        // Tech template with dark theme
        pdf.setFillColor(31, 41, 55); // Dark gray background
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Green gradient header
        pdf.setFillColor(colors.green[0], colors.green[1], colors.green[2]);
        pdf.rect(15, 15, pageWidth - 30, 25, 'F');
        
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
        pdf.text(data.personalInfo?.fullName || '', 20, currentY + 15);
        currentY += 35;
        break;

      case 'executive':
        // Executive template with bold black lines
        pdf.setFontSize(32);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        pdf.text(data.personalInfo?.fullName || '', 20, currentY);
        currentY += 8;

        // Thick black line
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(3);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 12;
        break;

      case 'minimal':
        // Minimal template with centered layout
        pdf.setFontSize(36);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const nameWidth = pdf.getTextWidth(data.personalInfo?.fullName || '');
        pdf.text(data.personalInfo?.fullName || '', (pageWidth - nameWidth) / 2, currentY);
        currentY += 15;
        break;

      default:
        // Classic template
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const classicNameWidth = pdf.getTextWidth(data.personalInfo?.fullName || '');
        pdf.text(data.personalInfo?.fullName || '', (pageWidth - classicNameWidth) / 2, currentY);
        currentY += 8;

        // Simple line
        pdf.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
        pdf.setLineWidth(1);
        pdf.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;
        break;
    }

    // Contact information
    if (data.personalInfo) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      
      let contactY = currentY;
      let contactX = 20;
      
      const contacts = [
        data.personalInfo.email,
        data.personalInfo.phone,
        data.personalInfo.location,
        data.personalInfo.linkedIn,
        data.personalInfo.portfolio
      ].filter(Boolean);

      contacts.forEach((contact, index) => {
        if (templateName === 'minimal') {
          // Center contacts for minimal template
          const contactWidth = pdf.getTextWidth(contact);
          pdf.text(contact, (pageWidth - contactWidth) / 2, contactY);
          contactY += 4;
        } else {
          pdf.text(contact, contactX, contactY);
          contactX += pdf.getTextWidth(contact) + 15;
          
          if (contactX > pageWidth - 50) {
            contactX = 20;
            contactY += 5;
          }
        }
      });
      
      currentY = contactY + 10;
    }

    // Professional Summary
    if (data.personalInfo?.summary) {
      checkPageBreak(20);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      if (templateName === 'creative') {
        pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
      } else if (templateName === 'tech') {
        pdf.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      } else {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      }
      
      pdf.text('PROFESSIONAL SUMMARY', 20, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      
      const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - 40);
      summaryLines.forEach((line: string, index: number) => {
        checkPageBreak(5);
        pdf.text(line, 20, currentY + (index * 4));
      });
      currentY += (summaryLines.length * 4) + 10;
    }

    // Experience Section
    if (data.experience?.length > 0) {
      checkPageBreak(25);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      if (templateName === 'creative') {
        pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
      } else if (templateName === 'tech') {
        pdf.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      } else {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      }
      
      pdf.text('EXPERIENCE', 20, currentY);
      currentY += 10;

      data.experience.forEach((exp: any) => {
        if (exp.jobTitle && exp.company) {
          checkPageBreak(20);
          
          // Job title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          pdf.text(exp.jobTitle, 20, currentY);
          currentY += 5;

          // Company and dates
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          pdf.text(exp.company, 20, currentY);
          
          const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
          if (dateText.trim() !== ' - ') {
            const dateWidth = pdf.getTextWidth(dateText);
            pdf.text(dateText, pageWidth - 20 - dateWidth, currentY);
          }
          currentY += 5;

          // Description
          if (exp.description) {
            pdf.setFontSize(10);
            pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            const descLines = pdf.splitTextToSize(exp.description, pageWidth - 40);
            
            descLines.forEach((line: string, index: number) => {
              checkPageBreak(4);
              pdf.text(line, 20, currentY + (index * 4));
            });
            currentY += (descLines.length * 4) + 6;
          }
        }
      });
    }

    // Projects Section
    if (data.projects?.length > 0) {
      checkPageBreak(25);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      if (templateName === 'creative') {
        pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
      } else if (templateName === 'tech') {
        pdf.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      } else {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      }
      
      pdf.text('PROJECTS', 20, currentY);
      currentY += 10;

      data.projects.forEach((project: any) => {
        if (project.name) {
          checkPageBreak(15);
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          pdf.text(project.name, 20, currentY);
          currentY += 5;

          if (project.description) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const projLines = pdf.splitTextToSize(project.description, pageWidth - 40);
            
            projLines.forEach((line: string, index: number) => {
              checkPageBreak(4);
              pdf.text(line, 20, currentY + (index * 4));
            });
            currentY += (projLines.length * 4) + 3;
          }

          if (project.technologies) {
            pdf.setFontSize(9);
            pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            pdf.text(`Technologies: ${project.technologies}`, 20, currentY);
            currentY += 6;
          }
        }
      });
    }

    // Education Section
    if (data.education?.length > 0) {
      checkPageBreak(20);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      if (templateName === 'creative') {
        pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
      } else if (templateName === 'tech') {
        pdf.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      } else {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      }
      
      pdf.text('EDUCATION', 20, currentY);
      currentY += 10;

      data.education.forEach((edu: any) => {
        if (edu.degree && edu.school) {
          checkPageBreak(10);
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          pdf.text(edu.degree, 20, currentY);
          currentY += 4;

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          pdf.text(edu.school, 20, currentY);
          
          if (edu.graduationDate) {
            const gradWidth = pdf.getTextWidth(edu.graduationDate);
            pdf.text(edu.graduationDate, pageWidth - 20 - gradWidth, currentY);
          }
          currentY += 8;
        }
      });
    }

    // Skills Section
    if (data.skills?.length > 0) {
      checkPageBreak(15);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      
      if (templateName === 'creative') {
        pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
      } else if (templateName === 'tech') {
        pdf.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
      } else {
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      }
      
      pdf.text('SKILLS', 20, currentY);
      currentY += 8;

      const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
      const skillsText = validSkills.join(' • ');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      
      const skillLines = pdf.splitTextToSize(skillsText, pageWidth - 40);
      skillLines.forEach((line: string, index: number) => {
        checkPageBreak(4);
        pdf.text(line, 20, currentY + (index * 4));
      });
    }

    console.log('PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
