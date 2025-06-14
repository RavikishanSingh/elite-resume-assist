import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Starting PDF Generation ===');
  console.log('Data received:', data);
  console.log('Template:', templateName);

  try {
    // Dynamic import of jsPDF
    const { default: jsPDF } = await import('jspdf');

    // First, try to find the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    
    if (!resumeElement) {
      console.error('Resume preview element not found, using fallback');
      return await generateFallbackPDF(data);
    }

    console.log('Resume element found, preparing for capture...');
    
    // Wait for any pending renders
    await new Promise(resolve => setTimeout(resolve, 500));

    // Make sure the element is visible and has content
    const rect = resumeElement.getBoundingClientRect();
    console.log('Element dimensions:', rect.width, 'x', rect.height);
    
    if (rect.width === 0 || rect.height === 0) {
      console.error('Element has no dimensions, using fallback');
      return await generateFallbackPDF(data);
    }

    // Ensure element is fully visible with proper styling
    resumeElement.style.display = 'block';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.opacity = '1';
    resumeElement.style.position = 'relative';
    resumeElement.style.zIndex = '1';
    resumeElement.style.transform = 'scale(1)'; // Remove any scaling
    resumeElement.style.transformOrigin = 'top left';

    // Force a reflow
    resumeElement.offsetHeight;
    
    // Wait a bit more for styles to apply
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing element with html2canvas...');
    
    // Capture with html2canvas with proper settings for resume
    const canvas = await html2canvas(resumeElement, {
      scale: 3, // Higher scale for crisp text
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: true,
      width: 794, // A4 width at 96 DPI
      height: 1123, // A4 height at 96 DPI
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123,
      removeContainer: true,
      ignoreElements: (element) => {
        return element.classList.contains('ignore-pdf') || false;
      }
    });

    console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas is invalid, using fallback');
      return await generateFallbackPDF(data);
    }

    // Get image data with high quality
    const imageData = canvas.toDataURL('image/jpeg', 0.98);
    
    if (!imageData || imageData === 'data:,' || imageData.length < 100) {
      console.error('Invalid image data, using fallback');
      return await generateFallbackPDF(data);
    }

    console.log('Image data generated, creating PDF...');

    // Create PDF with proper A4 dimensions (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Standard A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    
    console.log(`Adding image to PDF with A4 dimensions: ${pageWidth}mm x ${pageHeight}mm`);
    
    // Add image to fill the entire A4 page
    pdf.addImage(imageData, 'JPEG', 0, 0, pageWidth, pageHeight, '', 'FAST');
    
    console.log('PDF generated successfully with proper A4 sizing!');
    return pdf;

  } catch (error) {
    console.error('Error in PDF generation:', error);
    return await generateFallbackPDF(data);
  }
};

const generateFallbackPDF = async (data: any) => {
  console.log('=== Generating Fallback Text PDF ===');
  
  try {
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    let currentY = margin;

    const addText = (text: string, fontSize: number = 11, fontStyle: string = 'normal') => {
      if (!text) return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      // Check if we need a new page
      if (currentY + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      pdf.text(lines, margin, currentY);
      currentY += lines.length * lineHeight;
    };

    const addSection = (title: string) => {
      currentY += 8;
      addText(title, 14, 'bold');
      currentY += 4;
      // Add underline
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
      currentY += 4;
    };

    // Header
    if (data.personalInfo?.fullName) {
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(data.personalInfo.fullName, margin, currentY);
      currentY += 10;
    }

    // Contact Information
    if (data.personalInfo) {
      const contactInfo = [];
      if (data.personalInfo.email) contactInfo.push(`Email: ${data.personalInfo.email}`);
      if (data.personalInfo.phone) contactInfo.push(`Phone: ${data.personalInfo.phone}`);
      if (data.personalInfo.location) contactInfo.push(`Location: ${data.personalInfo.location}`);
      
      if (contactInfo.length > 0) {
        addText(contactInfo.join(' | '), 10);
        currentY += 4;
      }
    }

    // Professional Summary
    if (data.personalInfo?.summary) {
      addSection('PROFESSIONAL SUMMARY');
      addText(data.personalInfo.summary, 11);
    }

    // Experience
    if (data.experience?.length > 0) {
      addSection('EXPERIENCE');
      
      data.experience.forEach((exp: any) => {
        if (exp.jobTitle && exp.company) {
          addText(`${exp.jobTitle} at ${exp.company}`, 12, 'bold');
          
          if (exp.startDate || exp.endDate) {
            const period = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            addText(period, 10, 'italic');
          }
          
          if (exp.description) {
            addText(exp.description, 10);
          }
          
          currentY += 6;
        }
      });
    }

    // Education
    if (data.education?.length > 0) {
      addSection('EDUCATION');
      
      data.education.forEach((edu: any) => {
        if (edu.degree && edu.school) {
          addText(`${edu.degree} - ${edu.school}`, 11, 'bold');
          if (edu.graduationDate) {
            addText(edu.graduationDate, 10);
          }
          currentY += 4;
        }
      });
    }

    // Skills
    if (data.skills?.length > 0) {
      addSection('SKILLS');
      addText(data.skills.join(', '), 10);
    }

    // Projects
    if (data.projects?.length > 0) {
      addSection('PROJECTS');
      
      data.projects.forEach((project: any) => {
        if (project.name) {
          addText(project.name, 11, 'bold');
          if (project.description) {
            addText(project.description, 10);
          }
          if (project.technologies) {
            addText(`Technologies: ${project.technologies}`, 10, 'italic');
          }
          currentY += 4;
        }
      });
    }

    console.log('Fallback PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating fallback PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
