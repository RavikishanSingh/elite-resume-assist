
import jsPDF from 'jspdf';

// Template-specific styling configurations with consistent color properties
const templateConfigs = {
  modern: {
    colors: {
      primary: [37, 99, 235],
      secondary: [75, 85, 99],
      text: [17, 24, 39],
      accent: [59, 130, 246],
      light: [243, 244, 246],
      border: [209, 213, 219],
      background: [255, 255, 255]
    },
    fonts: {
      header: { size: 32, weight: 'bold' },
      subheader: { size: 18, weight: 'bold' },
      body: { size: 10, weight: 'normal' },
      small: { size: 9, weight: 'normal' }
    },
    spacing: {
      section: 12,
      item: 8,
      line: 4
    }
  },
  classic: {
    colors: {
      primary: [31, 41, 55],
      secondary: [75, 85, 99],
      text: [17, 24, 39],
      accent: [107, 114, 128],
      light: [243, 244, 246],
      border: [209, 213, 219],
      background: [255, 255, 255]
    },
    fonts: {
      header: { size: 28, weight: 'bold' },
      subheader: { size: 16, weight: 'bold' },
      body: { size: 10, weight: 'normal' },
      small: { size: 9, weight: 'normal' }
    },
    spacing: {
      section: 10,
      item: 6,
      line: 4
    }
  },
  creative: {
    colors: {
      primary: [147, 51, 234],
      secondary: [236, 72, 153],
      text: [31, 41, 55],
      accent: [168, 85, 247],
      light: [243, 232, 255],
      border: [209, 213, 219],
      background: [255, 255, 255]
    },
    fonts: {
      header: { size: 28, weight: 'bold' },
      subheader: { size: 14, weight: 'bold' },
      body: { size: 9, weight: 'normal' },
      small: { size: 8, weight: 'normal' }
    },
    spacing: {
      section: 8,
      item: 6,
      line: 3
    }
  },
  minimal: {
    colors: {
      primary: [55, 65, 81],
      secondary: [107, 114, 128],
      text: [31, 41, 55],
      accent: [107, 114, 128],
      light: [249, 250, 251],
      border: [209, 213, 219],
      background: [255, 255, 255]
    },
    fonts: {
      header: { size: 36, weight: 'normal' },
      subheader: { size: 16, weight: 'normal' },
      body: { size: 10, weight: 'normal' },
      small: { size: 9, weight: 'normal' }
    },
    spacing: {
      section: 15,
      item: 10,
      line: 5
    }
  },
  executive: {
    colors: {
      primary: [17, 24, 39],
      secondary: [55, 65, 81],
      text: [31, 41, 55],
      accent: [75, 85, 99],
      light: [243, 244, 246],
      border: [0, 0, 0],
      background: [255, 255, 255]
    },
    fonts: {
      header: { size: 32, weight: 'bold' },
      subheader: { size: 16, weight: 'bold' },
      body: { size: 10, weight: 'normal' },
      small: { size: 9, weight: 'normal' }
    },
    spacing: {
      section: 12,
      item: 8,
      line: 4
    }
  },
  tech: {
    colors: {
      primary: [34, 197, 94],
      secondary: [16, 185, 129],
      text: [255, 255, 255],
      accent: [52, 211, 153],
      light: [243, 244, 246],
      border: [209, 213, 219],
      background: [31, 41, 55]
    },
    fonts: {
      header: { size: 28, weight: 'bold' },
      subheader: { size: 14, weight: 'bold' },
      body: { size: 9, weight: 'normal' },
      small: { size: 8, weight: 'normal' }
    },
    spacing: {
      section: 8,
      item: 6,
      line: 3
    }
  }
};

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Perfect Template-Matched PDF Generation ===');
  console.log('Template:', templateName);

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
    const config = templateConfigs[templateName as keyof typeof templateConfigs] || templateConfigs.modern;
    
    let currentY = 20;
    const margins = { left: 20, right: 20, top: 20, bottom: 20 };

    // Helper functions
    const checkPageBreak = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - margins.bottom) {
        pdf.addPage();
        currentY = margins.top;
        return true;
      }
      return false;
    };

    const setColor = (colorArray: number[]) => {
      pdf.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
    };

    const setFillColor = (colorArray: number[]) => {
      pdf.setFillColor(colorArray[0], colorArray[1], colorArray[2]);
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: number[], width: number = 0.5) => {
      pdf.setDrawColor(color[0], color[1], color[2]);
      pdf.setLineWidth(width);
      pdf.line(x1, y1, x2, y2);
    };

    // Tech template background setup
    if (templateName === 'tech') {
      setFillColor(config.colors.background);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    // Template-specific header rendering
    switch (templateName) {
      case 'modern':
        // Modern template with blue theme and timeline design
        pdf.setFontSize(config.fonts.header.size);
        pdf.setFont('helvetica', config.fonts.header.weight);
        setColor(config.colors.text);
        pdf.text(data.personalInfo?.fullName || '', margins.left, currentY);
        currentY += 8;

        // Blue underline
        drawLine(margins.left, currentY, pageWidth - margins.right, currentY, config.colors.primary, 2);
        currentY += 10;

        // Contact info in horizontal layout
        if (data.personalInfo) {
          pdf.setFontSize(config.fonts.small.size);
          setColor(config.colors.secondary);
          
          const contacts = [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedIn,
            data.personalInfo.portfolio
          ].filter(Boolean);

          let contactX = margins.left;
          contacts.forEach((contact, index) => {
            if (contactX + pdf.getTextWidth(contact) > pageWidth - margins.right) {
              currentY += config.spacing.line;
              contactX = margins.left;
            }
            pdf.text(contact, contactX, currentY);
            contactX += pdf.getTextWidth(contact) + 15;
          });
          currentY += config.spacing.section;
        }
        break;

      case 'classic':
        // Classic centered header with border
        pdf.setFontSize(config.fonts.header.size);
        pdf.setFont('helvetica', config.fonts.header.weight);
        setColor(config.colors.text);
        
        const nameWidth = pdf.getTextWidth(data.personalInfo?.fullName || '');
        pdf.text(data.personalInfo?.fullName || '', (pageWidth - nameWidth) / 2, currentY);
        currentY += 8;

        // Classic border line
        drawLine(margins.left, currentY, pageWidth - margins.right, currentY, config.colors.border, 2);
        currentY += 8;

        // Contact info centered
        if (data.personalInfo) {
          pdf.setFontSize(config.fonts.small.size);
          setColor(config.colors.secondary);
          
          const contacts = [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedIn,
            data.personalInfo.portfolio
          ].filter(Boolean);

          contacts.forEach(contact => {
            const contactWidth = pdf.getTextWidth(contact);
            pdf.text(contact, (pageWidth - contactWidth) / 2, currentY);
            currentY += config.spacing.line;
          });
          currentY += config.spacing.section;
        }
        break;

      case 'creative':
        // Creative template with purple gradient header
        setFillColor(config.colors.primary);
        pdf.rect(margins.left - 5, currentY - 8, pageWidth - margins.left - margins.right + 10, 25, 'F');
        
        pdf.setFontSize(config.fonts.header.size);
        pdf.setFont('helvetica', config.fonts.header.weight);
        pdf.setTextColor(255, 255, 255);
        pdf.text(data.personalInfo?.fullName || '', margins.left, currentY + 8);
        currentY += 25;

        // Contact info in creative layout
        if (data.personalInfo) {
          pdf.setFontSize(config.fonts.small.size);
          setColor(config.colors.text);
          
          const contacts = [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedIn,
            data.personalInfo.portfolio
          ].filter(Boolean);

          const itemsPerRow = 3;
          let itemCount = 0;
          let rowY = currentY;
          
          contacts.forEach(contact => {
            const colWidth = (pageWidth - margins.left - margins.right) / itemsPerRow;
            const x = margins.left + (itemCount % itemsPerRow) * colWidth;
            
            pdf.text(contact, x, rowY);
            itemCount++;
            
            if (itemCount % itemsPerRow === 0) {
              rowY += config.spacing.line;
            }
          });
          
          currentY = rowY + config.spacing.section;
        }
        break;

      case 'minimal':
        // Minimal centered design
        pdf.setFontSize(config.fonts.header.size);
        pdf.setFont('helvetica', config.fonts.header.weight);
        setColor(config.colors.text);
        
        const minimalNameWidth = pdf.getTextWidth(data.personalInfo?.fullName || '');
        pdf.text(data.personalInfo?.fullName || '', (pageWidth - minimalNameWidth) / 2, currentY);
        currentY += 15;

        // Contact info centered and spaced
        if (data.personalInfo) {
          pdf.setFontSize(config.fonts.small.size);
          setColor(config.colors.secondary);
          
          const contacts = [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedIn,
            data.personalInfo.portfolio
          ].filter(Boolean);

          const contactsText = contacts.join(' • ');
          const contactsWidth = pdf.getTextWidth(contactsText);
          pdf.text(contactsText, (pageWidth - contactsWidth) / 2, currentY);
          currentY += config.spacing.section;
        }
        break;

      case 'executive':
        // Executive bold header
        pdf.setFontSize(config.fonts.header.size);
        pdf.setFont('helvetica', config.fonts.header.weight);
        setColor(config.colors.primary);
        pdf.text(data.personalInfo?.fullName || '', margins.left, currentY);
        currentY += 8;

        // Thick executive line
        drawLine(margins.left, currentY, pageWidth - margins.right, currentY, config.colors.border, 4);
        currentY += 12;

        // Contact layout for executive
        if (data.personalInfo) {
          pdf.setFontSize(config.fonts.small.size);
          setColor(config.colors.secondary);
          
          // Left side contacts
          let leftY = currentY;
          if (data.personalInfo.email) {
            pdf.text(data.personalInfo.email, margins.left, leftY);
            leftY += config.spacing.line;
          }
          if (data.personalInfo.phone) {
            pdf.text(data.personalInfo.phone, margins.left, leftY);
            leftY += config.spacing.line;
          }

          // Right side contacts
          let rightY = currentY;
          if (data.personalInfo.location) {
            const locWidth = pdf.getTextWidth(data.personalInfo.location);
            pdf.text(data.personalInfo.location, pageWidth - margins.right - locWidth, rightY);
            rightY += config.spacing.line;
          }
          if (data.personalInfo.linkedIn) {
            const linkedInWidth = pdf.getTextWidth(data.personalInfo.linkedIn);
            pdf.text(data.personalInfo.linkedIn, pageWidth - margins.right - linkedInWidth, rightY);
            rightY += config.spacing.line;
          }

          currentY = Math.max(leftY, rightY) + config.spacing.section;
        }
        break;

      case 'tech':
        // Green header bar
        setFillColor(config.colors.primary);
        pdf.rect(margins.left - 5, currentY - 8, pageWidth - margins.left - margins.right + 10, 25, 'F');
        
        pdf.setFontSize(config.fonts.header.size);
        pdf.setFont('helvetica', config.fonts.header.weight);
        pdf.setTextColor(255, 255, 255);
        pdf.text(data.personalInfo?.fullName || '', margins.left, currentY + 8);
        currentY += 25;

        // Tech contact grid
        if (data.personalInfo) {
          pdf.setFontSize(config.fonts.small.size);
          setColor(config.colors.text);
          
          const contacts = [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedIn,
            data.personalInfo.portfolio
          ].filter(Boolean);

          const itemsPerRow = 3;
          let itemCount = 0;
          let rowY = currentY;
          
          contacts.forEach(contact => {
            const colWidth = (pageWidth - margins.left - margins.right) / itemsPerRow;
            const x = margins.left + (itemCount % itemsPerRow) * colWidth;
            
            pdf.text(contact, x, rowY);
            itemCount++;
            
            if (itemCount % itemsPerRow === 0) {
              rowY += config.spacing.line;
            }
          });
          
          currentY = rowY + config.spacing.section;
        }
        break;
    }

    // Render sections with template-specific styling
    const renderSection = (title: string, content: () => void) => {
      checkPageBreak(15);
      
      pdf.setFontSize(config.fonts.subheader.size);
      pdf.setFont('helvetica', config.fonts.subheader.weight);
      
      switch (templateName) {
        case 'modern':
          setColor(config.colors.primary);
          pdf.text(title, margins.left, currentY);
          currentY += 6;
          drawLine(margins.left, currentY, margins.left + 40, currentY, config.colors.primary, 2);
          currentY += 8;
          break;
        case 'creative':
          setColor(config.colors.primary);
          pdf.text(title, margins.left, currentY);
          currentY += 4;
          drawLine(margins.left, currentY, margins.left + 30, currentY, config.colors.secondary, 2);
          currentY += 6;
          break;
        case 'tech':
          setColor(config.colors.primary);
          pdf.text(title, margins.left, currentY);
          currentY += 4;
          drawLine(margins.left, currentY, margins.left + 30, currentY, config.colors.primary, 1);
          currentY += 6;
          break;
        default:
          setColor(config.colors.primary);
          pdf.text(title.toUpperCase(), margins.left, currentY);
          currentY += 4;
          drawLine(margins.left, currentY, pageWidth - margins.right, currentY, config.colors.primary, 1);
          currentY += 8;
      }
      
      content();
      currentY += config.spacing.section;
    };

    // Professional Summary
    if (data.personalInfo?.summary) {
      renderSection('PROFESSIONAL SUMMARY', () => {
        pdf.setFontSize(config.fonts.body.size);
        pdf.setFont('helvetica', config.fonts.body.weight);
        setColor(config.colors.text);
        
        const summaryLines = pdf.splitTextToSize(data.personalInfo.summary, pageWidth - margins.left - margins.right);
        summaryLines.forEach((line: string, index: number) => {
          checkPageBreak(4);
          pdf.text(line, margins.left, currentY + (index * config.spacing.line));
        });
        currentY += summaryLines.length * config.spacing.line;
      });
    }

    // Experience Section
    if (data.experience?.length > 0) {
      renderSection('EXPERIENCE', () => {
        data.experience.forEach((exp: any, expIndex: number) => {
          if (exp.jobTitle && exp.company) {
            checkPageBreak(20);
            
            // Modern template timeline design
            if (templateName === 'modern') {
              // Timeline dot
              setFillColor(config.colors.primary);
              pdf.circle(margins.left + 2, currentY, 1.5, 'F');
              
              // Timeline line (if not last item)
              if (expIndex < data.experience.length - 1) {
                drawLine(margins.left + 2, currentY + 2, margins.left + 2, currentY + 25, config.colors.light, 1);
              }
            }
            
            const contentX = templateName === 'modern' ? margins.left + 8 : margins.left;
            
            // Job title
            pdf.setFontSize(config.fonts.body.size + 2);
            pdf.setFont('helvetica', 'bold');
            setColor(config.colors.text);
            pdf.text(exp.jobTitle, contentX, currentY);
            currentY += 5;

            // Company and dates
            pdf.setFontSize(config.fonts.body.size);
            pdf.setFont('helvetica', 'normal');
            
            if (templateName === 'modern') {
              setColor(config.colors.primary);
            } else {
              setColor(config.colors.secondary);
            }
            
            pdf.text(exp.company, contentX, currentY);
            
            const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            if (dateText.trim() !== ' - ') {
              const dateWidth = pdf.getTextWidth(dateText);
              pdf.text(dateText, pageWidth - margins.right - dateWidth, currentY);
            }
            currentY += 5;

            // Description
            if (exp.description) {
              pdf.setFontSize(config.fonts.body.size);
              setColor(config.colors.text);
              const descLines = pdf.splitTextToSize(exp.description, pageWidth - margins.left - margins.right - (templateName === 'modern' ? 8 : 0));
              
              descLines.forEach((line: string, index: number) => {
                checkPageBreak(4);
                pdf.text(line, contentX, currentY + (index * config.spacing.line));
              });
              currentY += descLines.length * config.spacing.line + config.spacing.item;
            }
          }
        });
      });
    }

    // Projects Section
    if (data.projects?.length > 0) {
      renderSection('PROJECTS', () => {
        data.projects.forEach((project: any, projIndex: number) => {
          if (project.name) {
            checkPageBreak(15);
            
            // Modern template timeline design for projects
            if (templateName === 'modern') {
              setFillColor(config.colors.primary);
              pdf.circle(margins.left + 2, currentY, 1.5, 'F');
              
              if (projIndex < data.projects.length - 1) {
                drawLine(margins.left + 2, currentY + 2, margins.left + 2, currentY + 20, config.colors.light, 1);
              }
            }
            
            const contentX = templateName === 'modern' ? margins.left + 8 : margins.left;
            
            pdf.setFontSize(config.fonts.body.size + 1);
            pdf.setFont('helvetica', 'bold');
            setColor(config.colors.text);
            pdf.text(project.name, contentX, currentY);
            currentY += 5;

            if (project.description) {
              pdf.setFontSize(config.fonts.body.size);
              pdf.setFont('helvetica', 'normal');
              setColor(config.colors.text);
              const projLines = pdf.splitTextToSize(project.description, pageWidth - margins.left - margins.right - (templateName === 'modern' ? 8 : 0));
              
              projLines.forEach((line: string, index: number) => {
                checkPageBreak(4);
                pdf.text(line, contentX, currentY + (index * config.spacing.line));
              });
              currentY += projLines.length * config.spacing.line + 3;
            }

            if (project.technologies) {
              pdf.setFontSize(config.fonts.small.size);
              setColor(config.colors.secondary);
              pdf.text(`Technologies: ${project.technologies}`, contentX, currentY);
              currentY += config.spacing.item;
            }
          }
        });
      });
    }

    // Education Section
    if (data.education?.length > 0) {
      renderSection('EDUCATION', () => {
        data.education.forEach((edu: any, eduIndex: number) => {
          if (edu.degree && edu.school) {
            checkPageBreak(12);
            
            // Modern template timeline design for education
            if (templateName === 'modern') {
              setFillColor(config.colors.primary);
              pdf.circle(margins.left + 2, currentY, 1.5, 'F');
              
              if (eduIndex < data.education.length - 1) {
                drawLine(margins.left + 2, currentY + 2, margins.left + 2, currentY + 15, config.colors.light, 1);
              }
            }
            
            const contentX = templateName === 'modern' ? margins.left + 8 : margins.left;
            
            pdf.setFontSize(config.fonts.body.size + 1);
            pdf.setFont('helvetica', 'bold');
            setColor(config.colors.text);
            pdf.text(edu.degree, contentX, currentY);
            currentY += 4;

            pdf.setFont('helvetica', 'normal');
            if (templateName === 'modern') {
              setColor(config.colors.primary);
            } else {
              setColor(config.colors.secondary);
            }
            
            pdf.text(edu.school, contentX, currentY);
            
            if (edu.graduationDate) {
              const gradWidth = pdf.getTextWidth(edu.graduationDate);
              pdf.text(edu.graduationDate, pageWidth - margins.right - gradWidth, currentY);
            }
            currentY += config.spacing.item;
          }
        });
      });
    }

    // Skills Section
    if (data.skills?.length > 0) {
      renderSection('SKILLS', () => {
        const validSkills = data.skills.filter((skill: string) => skill && skill.trim());
        
        if (templateName === 'creative' || templateName === 'tech') {
          // Skills as badges for creative and tech templates
          pdf.setFontSize(config.fonts.small.size);
          pdf.setFont('helvetica', 'normal');
          
          let skillX = margins.left;
          let skillY = currentY;
          
          validSkills.forEach((skill: string) => {
            const skillWidth = pdf.getTextWidth(skill) + 6;
            
            if (skillX + skillWidth > pageWidth - margins.right) {
              skillX = margins.left;
              skillY += 8;
              checkPageBreak(8);
            }
            
            // Draw skill background
            if (templateName === 'tech') {
              setFillColor(config.colors.background);
            } else {
              setFillColor(config.colors.light);
            }
            pdf.rect(skillX, skillY - 3, skillWidth, 6, 'F');
            
            // Draw skill border
            pdf.setDrawColor(config.colors.primary[0], config.colors.primary[1], config.colors.primary[2]);
            pdf.setLineWidth(0.2);
            pdf.rect(skillX, skillY - 3, skillWidth, 6, 'S');
            
            // Draw skill text
            setColor(config.colors.text);
            pdf.text(skill, skillX + 3, skillY + 1);
            
            skillX += skillWidth + 4;
          });
          
          currentY = skillY + 6;
        } else {
          // Skills as bullet points for other templates
          const skillsText = validSkills.join(' • ');
          
          pdf.setFontSize(config.fonts.body.size);
          pdf.setFont('helvetica', 'normal');
          setColor(config.colors.text);
          
          const skillLines = pdf.splitTextToSize(skillsText, pageWidth - margins.left - margins.right);
          skillLines.forEach((line: string, index: number) => {
            checkPageBreak(4);
            pdf.text(line, margins.left, currentY + (index * config.spacing.line));
          });
          currentY += skillLines.length * config.spacing.line;
        }
      });
    }

    console.log('Perfect template-matched PDF generation completed');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate perfect PDF: ' + (error as Error).message);
  }
};
