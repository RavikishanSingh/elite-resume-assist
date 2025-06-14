
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
    
    // Store original styles
    const originalStyles = {
      display: resumeElement.style.display,
      transform: resumeElement.style.transform,
      scale: resumeElement.style.scale,
      overflow: resumeElement.style.overflow,
      position: resumeElement.style.position,
      zIndex: resumeElement.style.zIndex,
      visibility: resumeElement.style.visibility
    };
    
    // Ensure the element is properly visible for capture
    resumeElement.style.display = 'block';
    resumeElement.style.transform = 'none';
    resumeElement.style.scale = '1';
    resumeElement.style.overflow = 'visible';
    resumeElement.style.position = 'relative';
    resumeElement.style.zIndex = '1';
    resumeElement.style.visibility = 'visible';
    
    // Force layout recalculation
    resumeElement.offsetHeight;
    resumeElement.offsetWidth;
    
    // Wait for styles to apply and fonts to load
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Capturing element with html2canvas...');
    
    // Get actual dimensions
    const rect = resumeElement.getBoundingClientRect();
    const elementWidth = resumeElement.scrollWidth || rect.width;
    const elementHeight = resumeElement.scrollHeight || rect.height;
    
    console.log('Element dimensions:', elementWidth, 'x', elementHeight);
    
    // Use html2canvas with improved settings
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: elementWidth,
      height: elementHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      onclone: (clonedDoc) => {
        // Ensure all styles are properly applied in the cloned document
        const clonedElement = clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.scale = '1';
          clonedElement.style.display = 'block';
          clonedElement.style.visibility = 'visible';
        }
      }
    });
    
    console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);
    
    // Restore original styles
    Object.keys(originalStyles).forEach(key => {
      resumeElement.style[key] = originalStyles[key];
    });
    
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas has zero dimensions, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    
    // Calculate dimensions to fit the page with margins
    const availableWidth = pageWidth - (2 * margin);
    const availableHeight = pageHeight - (2 * margin);
    
    // Calculate image dimensions maintaining aspect ratio
    const aspectRatio = canvas.width / canvas.height;
    let imgWidth = availableWidth;
    let imgHeight = imgWidth / aspectRatio;
    
    // If image is too tall, scale it down
    if (imgHeight > availableHeight) {
      imgHeight = availableHeight;
      imgWidth = imgHeight * aspectRatio;
    }
    
    console.log('PDF image dimensions:', imgWidth, 'x', imgHeight);
    
    // Center the image on the page
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = margin;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    
    console.log('PDF generation completed successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating PDF with template:', error);
    // Always fall back to text PDF if visual capture fails
    return generateTextPDF(data);
  }
};

const generateTextPDF = async (data: any) => {
  console.log('Generating fallback text PDF...');
  
  try {
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 50;
    const lineHeight = 16;
    let yPos = margin;

    // Helper function to add text with page breaks
    const addText = (text: string, x: number, fontSize: number = 11, fontWeight: string = 'normal') => {
      if (!text) return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontWeight);
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      // Check if we need a new page
      if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.text(lines, x, yPos);
      yPos += lines.length * lineHeight + 10;
    };

    const addSection = (title: string) => {
      yPos += 20;
      if (yPos + 40 > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      // Add section separator line
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;
      
      addText(title, margin, 14, 'bold');
    };

    // Header
    if (data.personalInfo?.fullName) {
      addText(data.personalInfo.fullName, margin, 20, 'bold');
      yPos += 10;
    }

    // Contact info
    const contactInfo = [];
    if (data.personalInfo?.email) contactInfo.push(`Email: ${data.personalInfo.email}`);
    if (data.personalInfo?.phone) contactInfo.push(`Phone: ${data.personalInfo.phone}`);
    if (data.personalInfo?.location) contactInfo.push(`Location: ${data.personalInfo.location}`);
    
    contactInfo.forEach(info => addText(info, margin, 10));

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
          addText(dateRange, margin, 10, 'italic');
        }
        
        if (exp.description) {
          addText(exp.description, margin, 10);
        }
        
        yPos += 10;
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
        
        yPos += 10;
      });
    }

    // Skills
    if (data.skills?.length > 0) {
      addSection('SKILLS');
      const skillsText = data.skills.join(' • ');
      addText(skillsText, margin, 10);
    }

    console.log('Text PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
