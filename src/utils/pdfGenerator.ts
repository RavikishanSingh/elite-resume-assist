
import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  try {
    const { default: jsPDF } = await import('jspdf');
    
    // Try to capture the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (resumeElement) {
      console.log('Found resume element, generating PDF...');
      
      // Ensure the element is visible and properly styled
      const originalDisplay = resumeElement.style.display;
      const originalTransform = resumeElement.style.transform;
      const originalScale = resumeElement.style.scale;
      const originalOverflow = resumeElement.style.overflow;
      
      // Temporarily reset any transformations for better capture
      resumeElement.style.display = 'block';
      resumeElement.style.transform = 'none';
      resumeElement.style.scale = '1';
      resumeElement.style.overflow = 'visible';
      
      // Force a reflow to ensure styles are applied
      resumeElement.offsetHeight;
      
      // Wait for any pending renders and fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use html2canvas with optimized settings
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: false,
        foreignObjectRendering: true,
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0
      });
      
      console.log('Canvas created with dimensions:', canvas.width, 'x', canvas.height);
      
      // Restore original styles
      resumeElement.style.display = originalDisplay;
      resumeElement.style.transform = originalTransform;
      resumeElement.style.scale = originalScale;
      resumeElement.style.overflow = originalOverflow;
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const pageWidth = 595.28; // A4 width in points
      const pageHeight = 841.89; // A4 height in points
      const margin = 20;
      
      // Calculate dimensions to fit the page with margins
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);
      
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      console.log('PDF dimensions:', imgWidth, 'x', imgHeight);
      
      // If content fits on one page
      if (imgHeight <= availableHeight) {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      } else {
        // Handle multi-page content
        let yOffset = 0;
        let pageNumber = 0;
        const pixelsPerPage = (canvas.height * availableHeight) / imgHeight;
        
        while (yOffset < canvas.height && pageNumber < 10) {
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
              0, yOffset,
              canvas.width, sectionHeight,
              0, 0,
              canvas.width, sectionHeight
            );
            
            // Convert page canvas to image and add to PDF
            const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
            const scaledHeight = (sectionHeight * imgWidth) / canvas.width;
            
            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, scaledHeight);
            
            console.log(`Added page ${pageNumber + 1} with height ${scaledHeight}`);
          }
          
          yOffset += pixelsPerPage;
          pageNumber++;
        }
      }
      
      console.log('PDF generation completed successfully');
      return pdf;
    } else {
      console.error('Resume preview element not found, falling back to text PDF');
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
