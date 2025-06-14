
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
    
    // Ensure the element is visible and properly displayed
    resumeElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    
    // Wait for scroll and rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store original styles
    const originalStyles = {
      transform: resumeElement.style.transform,
      scale: resumeElement.style.scale,
      visibility: resumeElement.style.visibility,
      position: resumeElement.style.position,
      zIndex: resumeElement.style.zIndex,
      width: resumeElement.style.width,
      height: resumeElement.style.height,
      overflow: resumeElement.style.overflow,
      backgroundColor: resumeElement.style.backgroundColor
    };
    
    // Set optimal styles for capture
    resumeElement.style.transform = 'none';
    resumeElement.style.scale = '1';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.position = 'relative';
    resumeElement.style.zIndex = '1000';
    resumeElement.style.width = '794px'; // A4 width at 96 DPI
    resumeElement.style.height = 'auto'; // Let height be determined by content
    resumeElement.style.overflow = 'visible';
    resumeElement.style.backgroundColor = '#ffffff';
    
    // Force layout recalculation
    resumeElement.offsetHeight;
    
    // Wait for styles to apply and content to render
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Capturing element with html2canvas...');
    
    // Get the actual dimensions of the element
    const rect = resumeElement.getBoundingClientRect();
    console.log('Element dimensions:', rect.width, 'x', rect.height);
    
    // Capture with html2canvas with better settings
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      width: rect.width,
      height: rect.height,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      imageTimeout: 0,
      removeContainer: false,
      onclone: (clonedDoc) => {
        // Ensure all styles are preserved in the cloned document
        const clonedElement = clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          clonedElement.style.visibility = 'visible';
          clonedElement.style.opacity = '1';
          clonedElement.style.transform = 'none';
          clonedElement.style.backgroundColor = '#ffffff';
        }
      }
    });
    
    console.log('Canvas created:', canvas.width, 'x', canvas.height);
    
    // Restore original styles
    Object.keys(originalStyles).forEach(key => {
      const value = originalStyles[key as keyof typeof originalStyles];
      if (value !== null && value !== undefined) {
        (resumeElement.style as any)[key] = value;
      } else {
        resumeElement.style.removeProperty(key);
      }
    });
    
    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Invalid canvas created, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    // Convert to high-quality image
    const imgData = canvas.toDataURL('image/png', 1.0);
    if (!imgData || imgData === 'data:,' || imgData.length < 100) {
      console.error('Failed to convert canvas to image, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    console.log('Image data length:', imgData.length);
    
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
    
    // Calculate aspect ratio to fit content properly
    const canvasAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;
    
    let imgWidth = pageWidth;
    let imgHeight = pageHeight;
    let xOffset = 0;
    let yOffset = 0;
    
    if (canvasAspectRatio > pageAspectRatio) {
      // Canvas is wider, fit to width
      imgHeight = pageWidth / canvasAspectRatio;
      yOffset = (pageHeight - imgHeight) / 2;
    } else {
      // Canvas is taller, fit to height
      imgWidth = pageHeight * canvasAspectRatio;
      xOffset = (pageWidth - imgWidth) / 2;
    }
    
    console.log('Adding image to PDF with dimensions:', imgWidth, 'x', imgHeight);
    
    // Add image to PDF with proper positioning
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, '', 'FAST');
    
    console.log('PDF generation completed successfully');
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
