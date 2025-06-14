import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  try {
    console.log('Starting PDF generation process...');
    const { default: jsPDF } = await import('jspdf');
    
    // Try to capture the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
      console.error('Resume preview element not found, falling back to text PDF');
      return generateTextPDF(data);
    }

    console.log('Found resume element, preparing for capture...');
    
    // Ensure the element is visible and scrolled into view
    resumeElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    
    // Wait for scroll to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Store original styles
    const originalStyles = {
      transform: resumeElement.style.transform,
      scale: resumeElement.style.scale,
      visibility: resumeElement.style.visibility,
      position: resumeElement.style.position,
      zIndex: resumeElement.style.zIndex,
      width: resumeElement.style.width,
      height: resumeElement.style.height
    };
    
    // Set exact A4 dimensions for the element (210mm x 297mm at 96 DPI)
    const A4_WIDTH_PX = 794;  // 210mm at 96 DPI
    const A4_HEIGHT_PX = 1123; // 297mm at 96 DPI
    
    // Temporarily set exact A4 dimensions and reset transforms
    resumeElement.style.transform = 'none';
    resumeElement.style.scale = '1';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.position = 'relative';
    resumeElement.style.zIndex = '1';
    resumeElement.style.width = `${A4_WIDTH_PX}px`;
    resumeElement.style.height = `${A4_HEIGHT_PX}px`;
    
    // Force layout recalculation
    resumeElement.offsetHeight;
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('Capturing element with html2canvas...');
    
    // Capture with html2canvas using exact A4 dimensions
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      foreignObjectRendering: true,
      removeContainer: true,
      ignoreElements: (element) => {
        return element.classList?.contains('no-print') || false;
      }
    });
    
    console.log('Canvas created:', canvas.width, 'x', canvas.height);
    
    // Restore original styles
    Object.keys(originalStyles).forEach(key => {
      const value = originalStyles[key as keyof typeof originalStyles];
      if (value) {
        resumeElement.style[key as any] = value;
      } else {
        resumeElement.style.removeProperty(key);
      }
    });
    
    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Invalid canvas, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    // Convert to high-quality image
    const imgData = canvas.toDataURL('image/png', 1.0);
    if (!imgData || imgData === 'data:,') {
      console.error('Failed to convert canvas to image, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    // Create PDF with exact A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Add image to fill entire A4 page with no margins
    console.log('Adding image to PDF with perfect A4 dimensions');
    
    // Add image to PDF filling the entire page
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
    
    console.log('PDF generation completed successfully with perfect A4 size');
    return pdf;
    
  } catch (error) {
    console.error('Error in PDF generation:', error);
    return generateTextPDF(data);
  }
};

const generateTextPDF = async (data: any) => {
  console.log('Generating fallback text PDF...');
  
  try {
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20; // Professional margin
    const lineHeight = 6;
    let yPos = margin;

    const addText = (text: string, x: number, fontSize: number = 11, fontWeight: string = 'normal') => {
      if (!text) return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontWeight);
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.text(lines, x, yPos);
      yPos += lines.length * lineHeight + 4;
    };

    const addSection = (title: string) => {
      yPos += 8;
      if (yPos + 20 > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      // Add section divider line
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;
      
      addText(title, margin, 14, 'bold');
    };

    // Header with name
    if (data.personalInfo?.fullName) {
      addText(data.personalInfo.fullName, margin, 20, 'bold');
      yPos += 4;
    }

    // Contact information in a professional layout
    const contactInfo = [];
    if (data.personalInfo?.email) contactInfo.push(`${data.personalInfo.email}`);
    if (data.personalInfo?.phone) contactInfo.push(`${data.personalInfo.phone}`);
    if (data.personalInfo?.location) contactInfo.push(`${data.personalInfo.location}`);
    
    if (contactInfo.length > 0) {
      const contactLine = contactInfo.join(' | ');
      addText(contactLine, margin, 10);
    }

    // Professional Summary
    if (data.personalInfo?.summary) {
      addSection('PROFESSIONAL SUMMARY');
      addText(data.personalInfo.summary, margin, 11);
    }

    // Experience
    if (data.experience?.length > 0) {
      addSection('PROFESSIONAL EXPERIENCE');
      
      data.experience.forEach((exp: any) => {
        const jobTitle = exp.jobTitle || 'Position';
        const company = exp.company || 'Company';
        addText(`${jobTitle} at ${company}`, margin, 12, 'bold');
        
        const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
        if (dateRange.trim() !== ' - ') {
          addText(dateRange, margin, 9, 'italic');
        }
        
        if (exp.description) {
          addText(exp.description, margin, 10);
        }
        
        yPos += 3;
      });
    }

    // Education
    if (data.education?.length > 0) {
      addSection('EDUCATION');
      
      data.education.forEach((edu: any) => {
        const degree = edu.degree || 'Degree';
        const school = edu.school || 'Institution';
        addText(`${degree} - ${school}`, margin, 11, 'bold');
        
        if (edu.graduationDate) {
          addText(edu.graduationDate, margin, 10);
        }
        
        yPos += 3;
      });
    }

    // Skills
    if (data.skills?.length > 0) {
      addSection('SKILLS');
      const skillsText = data.skills.join(' • ');
      addText(skillsText, margin, 10);
    }

    console.log('Professional A4 text PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
