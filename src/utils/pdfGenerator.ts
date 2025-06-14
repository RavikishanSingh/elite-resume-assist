
import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  try {
    const { default: jsPDF } = await import('jspdf');
    
    // Try to capture the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (resumeElement) {
      // Ensure the element is visible and properly styled
      const originalDisplay = resumeElement.style.display;
      const originalTransform = resumeElement.style.transform;
      const originalScale = resumeElement.style.scale;
      
      // Temporarily reset any transformations for better capture
      resumeElement.style.display = 'block';
      resumeElement.style.transform = 'none';
      resumeElement.style.scale = '1';
      
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use html2canvas with optimized settings
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // High quality but manageable
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: true,
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0
      });
      
      // Restore original styles
      resumeElement.style.display = originalDisplay;
      resumeElement.style.transform = originalTransform;
      resumeElement.style.scale = originalScale;
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const pageWidth = 595.28; // A4 width in points
      const pageHeight = 841.89; // A4 height in points
      const margin = 0; // No margin for full page
      
      // Calculate dimensions to fit the page perfectly
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content fits on one page
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        // Handle multi-page content by splitting the canvas
        let yOffset = 0;
        let pageNumber = 0;
        const pixelsPerPage = (canvas.height * pageHeight) / imgHeight;
        
        while (yOffset < canvas.height) {
          if (pageNumber > 0) {
            pdf.addPage();
          }
          
          // Create a temporary canvas for this page section
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');
          
          if (pageCtx) {
            const remainingHeight = canvas.height - yOffset;
            const sectionHeight = Math.min(pixelsPerPage, remainingHeight);
            
            pageCanvas.width = canvas.width;
            pageCanvas.height = sectionHeight;
            
            // Draw the section of the original canvas onto the page canvas
            pageCtx.drawImage(
              canvas,
              0, yOffset, // source x, y
              canvas.width, sectionHeight, // source width, height
              0, 0, // destination x, y
              canvas.width, sectionHeight // destination width, height
            );
            
            // Convert page canvas to image and add to PDF
            const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
            const scaledHeight = (sectionHeight * imgWidth) / canvas.width;
            
            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, scaledHeight, undefined, 'FAST');
          }
          
          yOffset += pixelsPerPage;
          pageNumber++;
          
          // Safety break to prevent infinite loops
          if (pageNumber > 5) break;
        }
      }
      
      return pdf;
    } else {
      console.error('Resume preview element not found');
      return generateTextPDF(data);
    }
  } catch (error) {
    console.error('Error generating PDF with template:', error);
    return generateTextPDF(data);
  }
};

const generateTextPDF = async (data: any) => {
  const { default: jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const lineHeight = 16;
  let yPos = margin;

  // Helper to add text with automatic page breaks
  const addText = (text: string, x: number, fontSize: number = 11, fontWeight: string = 'normal', maxWidth?: number) => {
    if (!text) return yPos;
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontWeight);
    
    const effectiveMaxWidth = maxWidth || (pageWidth - 2 * margin);
    const lines = pdf.splitTextToSize(text, effectiveMaxWidth);
    
    // Check if we need a new page
    if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.text(lines, x, yPos);
    yPos += lines.length * lineHeight + 8;
    
    return yPos;
  };

  const addSection = (title: string) => {
    yPos += 15;
    if (yPos + 30 > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    
    // Section line
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 20;
    
    addText(title, margin, 14, 'bold');
    yPos += 5;
  };

  // Header with name
  if (data.personalInfo?.fullName) {
    addText(data.personalInfo.fullName, margin, 22, 'bold');
    yPos += 5;
  }

  // Contact information in a clean format
  const contactInfo = [];
  if (data.personalInfo?.email) contactInfo.push(`Email: ${data.personalInfo.email}`);
  if (data.personalInfo?.phone) contactInfo.push(`Phone: ${data.personalInfo.phone}`);
  if (data.personalInfo?.location) contactInfo.push(`Location: ${data.personalInfo.location}`);
  
  contactInfo.forEach(info => {
    addText(info, margin, 10);
  });

  // Professional links
  if (data.personalInfo?.linkedIn) {
    addText(`LinkedIn: ${data.personalInfo.linkedIn}`, margin, 10);
  }
  if (data.personalInfo?.portfolio) {
    addText(`Portfolio: ${data.personalInfo.portfolio}`, margin, 10);
  }

  // Professional Summary
  if (data.personalInfo?.summary) {
    addSection('PROFESSIONAL SUMMARY');
    addText(data.personalInfo.summary, margin, 11, 'normal', pageWidth - 2 * margin);
  }

  // Experience Section
  if (data.experience?.length > 0) {
    addSection('PROFESSIONAL EXPERIENCE');
    
    data.experience.forEach((exp: any) => {
      if (exp.jobTitle || exp.company) {
        // Job title and company
        const jobLine = `${exp.jobTitle || ''} ${exp.jobTitle && exp.company ? '|' : ''} ${exp.company || ''}`;
        addText(jobLine, margin, 12, 'bold');
        
        // Duration and location
        const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
        if (exp.location) {
          addText(`${dateRange} | ${exp.location}`, margin, 10, 'italic');
        } else if (dateRange.trim() !== ' - ') {
          addText(dateRange, margin, 10, 'italic');
        }
        
        // Description
        if (exp.description) {
          addText(exp.description, margin, 10, 'normal', pageWidth - 2 * margin);
        }
        
        yPos += 10;
      }
    });
  }

  // Projects Section
  if (data.projects?.length > 0) {
    addSection('KEY PROJECTS');
    
    data.projects.forEach((project: any) => {
      if (project.name) {
        addText(project.name, margin, 12, 'bold');
        
        if (project.description) {
          addText(project.description, margin, 10, 'normal', pageWidth - 2 * margin);
        }
        
        if (project.technologies) {
          addText(`Technologies: ${project.technologies}`, margin, 9, 'italic');
        }
        
        if (project.url || project.github) {
          const links = [];
          if (project.url) links.push(`Demo: ${project.url}`);
          if (project.github) links.push(`Code: ${project.github}`);
          addText(links.join(' | '), margin, 9);
        }
        
        yPos += 10;
      }
    });
  }

  // Education Section
  if (data.education?.length > 0) {
    addSection('EDUCATION');
    
    data.education.forEach((edu: any) => {
      if (edu.degree || edu.school) {
        const eduLine = `${edu.degree || ''} ${edu.degree && edu.school ? '|' : ''} ${edu.school || ''}`;
        addText(eduLine, margin, 11, 'bold');
        
        if (edu.graduationDate) {
          addText(edu.current ? 'Expected Graduation' : edu.graduationDate, margin, 10);
        }
        
        yPos += 8;
      }
    });
  }

  // Skills Section
  if (data.skills?.length > 0) {
    const skillsText = data.skills.filter((skill: string) => skill.trim()).join(' • ');
    if (skillsText) {
      addSection('TECHNICAL SKILLS');
      addText(skillsText, margin, 10, 'normal', pageWidth - 2 * margin);
    }
  }

  return pdf;
};
