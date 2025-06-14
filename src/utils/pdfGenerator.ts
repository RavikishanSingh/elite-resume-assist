
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
      zIndex: resumeElement.style.zIndex
    };
    
    // Temporarily reset transform and scale for better capture
    resumeElement.style.transform = 'none';
    resumeElement.style.scale = '1';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.position = 'relative';
    resumeElement.style.zIndex = '1';
    
    // Force layout recalculation
    resumeElement.offsetHeight;
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Capturing element with html2canvas...');
    
    // Get the computed dimensions
    const rect = resumeElement.getBoundingClientRect();
    const width = Math.max(rect.width, resumeElement.scrollWidth, 794);
    const height = Math.max(rect.height, resumeElement.scrollHeight, 1123);
    
    console.log('Element dimensions:', width, 'x', height);
    
    // Capture with html2canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.classList?.contains('no-print') || false;
      }
    });
    
    console.log('Canvas created:', canvas.width, 'x', canvas.height);
    
    // Restore original styles
    Object.keys(originalStyles).forEach(key => {
      if (originalStyles[key as keyof typeof originalStyles]) {
        resumeElement.style[key as any] = originalStyles[key as keyof typeof originalStyles];
      }
    });
    
    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Invalid canvas, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    // Convert to image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    if (!imgData || imgData === 'data:,') {
      console.error('Failed to convert canvas to image, falling back to text PDF');
      return generateTextPDF(data);
    }
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    // Calculate image dimensions
    const maxWidth = pageWidth - (2 * margin);
    const maxHeight = pageHeight - (2 * margin);
    
    const aspectRatio = canvas.width / canvas.height;
    let imgWidth = maxWidth;
    let imgHeight = imgWidth / aspectRatio;
    
    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = imgHeight * aspectRatio;
    }
    
    // Center the image
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = margin;
    
    console.log('Adding image to PDF:', imgWidth, 'x', imgHeight);
    
    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
    
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
      format: 'a4'
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
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
      yPos += lines.length * lineHeight + 3;
    };

    const addSection = (title: string) => {
      yPos += 5;
      if (yPos + 15 > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;
      
      addText(title, margin, 14, 'bold');
    };

    // Header
    if (data.personalInfo?.fullName) {
      addText(data.personalInfo.fullName, margin, 18, 'bold');
      yPos += 2;
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

    console.log('Text PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
