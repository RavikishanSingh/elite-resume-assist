
import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  try {
    console.log('Starting PDF generation process...');
    const { default: jsPDF } = await import('jspdf');
    
    // Find the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
      console.error('Resume preview element not found');
      return generateTextPDF(data);
    }

    console.log('Found resume element, preparing for capture...');
    console.log('Element dimensions:', resumeElement.offsetWidth, 'x', resumeElement.offsetHeight);
    console.log('Element visibility:', window.getComputedStyle(resumeElement).visibility);
    console.log('Element display:', window.getComputedStyle(resumeElement).display);
    
    // Ensure element is visible and properly sized
    resumeElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    
    // Store original styles
    const originalStyles = {
      position: resumeElement.style.position,
      visibility: resumeElement.style.visibility,
      opacity: resumeElement.style.opacity,
      transform: resumeElement.style.transform,
      zIndex: resumeElement.style.zIndex,
      backgroundColor: resumeElement.style.backgroundColor,
      width: resumeElement.style.width,
      height: resumeElement.style.height
    };
    
    // Set optimal styles for capture
    resumeElement.style.position = 'relative';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.opacity = '1';
    resumeElement.style.transform = 'none';
    resumeElement.style.zIndex = '9999';
    resumeElement.style.backgroundColor = '#ffffff';
    resumeElement.style.width = '794px';
    resumeElement.style.height = 'auto';
    
    // Force layout recalculation
    resumeElement.offsetHeight;
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Element after styling:', resumeElement.offsetWidth, 'x', resumeElement.offsetHeight);
    
    // Check if element has content
    const hasContent = resumeElement.innerHTML.trim().length > 0;
    console.log('Element has content:', hasContent);
    console.log('Element innerHTML length:', resumeElement.innerHTML.length);
    
    if (!hasContent) {
      console.error('Resume element is empty');
      return generateTextPDF(data);
    }
    
    // Capture with html2canvas
    console.log('Starting canvas capture...');
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      width: resumeElement.offsetWidth,
      height: resumeElement.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      removeContainer: false,
      ignoreElements: (element) => {
        // Skip elements that might cause issues
        return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
      }
    });
    
    console.log('Canvas created with dimensions:', canvas.width, 'x', canvas.height);
    
    // Restore original styles
    Object.keys(originalStyles).forEach(key => {
      const value = originalStyles[key as keyof typeof originalStyles];
      if (value) {
        (resumeElement.style as any)[key] = value;
      } else {
        resumeElement.style.removeProperty(key);
      }
    });
    
    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas is invalid:', canvas?.width, 'x', canvas?.height);
      return generateTextPDF(data);
    }
    
    // Test canvas content
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    const hasPixels = imageData?.data.some(pixel => pixel !== 0);
    
    console.log('Canvas has visible pixels:', hasPixels);
    
    if (!hasPixels) {
      console.error('Canvas appears to be empty');
      return generateTextPDF(data);
    }
    
    // Convert to image
    const imgData = canvas.toDataURL('image/png', 1.0);
    console.log('Image data created, length:', imgData.length);
    
    if (!imgData || imgData === 'data:,' || imgData.length < 1000) {
      console.error('Image data is invalid or too small');
      return generateTextPDF(data);
    }
    
    // Create PDF with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10; // 10mm margin
    const contentWidth = pageWidth - (2 * margin);
    const contentHeight = pageHeight - (2 * margin);
    
    // Calculate scaling to fit content within margins
    const canvasAspectRatio = canvas.width / canvas.height;
    const contentAspectRatio = contentWidth / contentHeight;
    
    let imgWidth, imgHeight, xOffset, yOffset;
    
    if (canvasAspectRatio > contentAspectRatio) {
      // Canvas is wider - fit to width
      imgWidth = contentWidth;
      imgHeight = contentWidth / canvasAspectRatio;
      xOffset = margin;
      yOffset = margin + (contentHeight - imgHeight) / 2;
    } else {
      // Canvas is taller - fit to height
      imgHeight = contentHeight;
      imgWidth = contentHeight * canvasAspectRatio;
      xOffset = margin + (contentWidth - imgWidth) / 2;
      yOffset = margin;
    }
    
    console.log('Adding image to PDF:', {
      width: imgWidth,
      height: imgHeight,
      x: xOffset,
      y: yOffset
    });
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    
    console.log('PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
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
      format: 'a4'
    });
    
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const lineHeight = 6;
    let yPos = margin;

    const addText = (text: string, fontSize: number = 11, fontWeight: string = 'normal') => {
      if (!text) return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontWeight);
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + 4;
    };

    // Header
    if (data.personalInfo?.fullName) {
      addText(data.personalInfo.fullName, 18, 'bold');
      yPos += 4;
    }

    // Contact info
    const contactInfo = [];
    if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
    if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
    if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
    
    if (contactInfo.length > 0) {
      addText(contactInfo.join(' | '), 10);
      yPos += 6;
    }

    // Summary
    if (data.personalInfo?.summary) {
      addText('SUMMARY', 14, 'bold');
      addText(data.personalInfo.summary, 11);
      yPos += 6;
    }

    // Experience
    if (data.experience?.length > 0) {
      addText('EXPERIENCE', 14, 'bold');
      
      data.experience.forEach((exp: any) => {
        addText(`${exp.jobTitle || 'Position'} - ${exp.company || 'Company'}`, 12, 'bold');
        
        const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
        if (dateRange.trim() !== ' - ') {
          addText(dateRange, 10);
        }
        
        if (exp.description) {
          addText(exp.description, 10);
        }
        yPos += 4;
      });
    }

    // Education
    if (data.education?.length > 0) {
      addText('EDUCATION', 14, 'bold');
      
      data.education.forEach((edu: any) => {
        addText(`${edu.degree || 'Degree'} - ${edu.school || 'Institution'}`, 11, 'bold');
        if (edu.graduationDate) {
          addText(edu.graduationDate, 10);
        }
        yPos += 4;
      });
    }

    // Skills
    if (data.skills?.length > 0) {
      addText('SKILLS', 14, 'bold');
      addText(data.skills.join(', '), 10);
    }

    console.log('Text PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
