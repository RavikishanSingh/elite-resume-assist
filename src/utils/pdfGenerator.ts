
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

    // Ensure element is fully visible
    resumeElement.style.display = 'block';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.opacity = '1';
    resumeElement.style.position = 'relative';
    resumeElement.style.zIndex = '1';

    // Force a reflow
    resumeElement.offsetHeight;
    
    // Wait a bit more for styles to apply
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing element with html2canvas...');
    
    // Capture with html2canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: true,
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: resumeElement.scrollWidth,
      windowHeight: resumeElement.scrollHeight,
      ignoreElements: (element) => {
        // Ignore any overlay elements that might interfere
        return element.classList.contains('ignore-pdf') || false;
      }
    });

    console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas is invalid, using fallback');
      return await generateFallbackPDF(data);
    }

    // Check if canvas has content
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Cannot get canvas context, using fallback');
      return await generateFallbackPDF(data);
    }

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    
    if (!imageData || imageData === 'data:,' || imageData.length < 100) {
      console.error('Invalid image data, using fallback');
      return await generateFallbackPDF(data);
    }

    console.log('Image data generated, creating PDF...');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // A4 dimensions in mm
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Calculate image dimensions to fit page with margin
    const maxWidth = pageWidth - (2 * margin);
    const maxHeight = pageHeight - (2 * margin);
    
    // Calculate aspect ratios
    const canvasRatio = canvas.width / canvas.height;
    const pageRatio = maxWidth / maxHeight;
    
    let imgWidth, imgHeight;
    
    if (canvasRatio > pageRatio) {
      // Image is wider than page ratio
      imgWidth = maxWidth;
      imgHeight = maxWidth / canvasRatio;
    } else {
      // Image is taller than page ratio
      imgHeight = maxHeight;
      imgWidth = maxHeight * canvasRatio;
    }
    
    // Center the image
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    
    console.log(`Adding image to PDF at position (${x}, ${y}) with size ${imgWidth}x${imgHeight}`);
    
    // Add image to PDF
    pdf.addImage(imageData, 'JPEG', x, y, imgWidth, imgHeight);
    
    console.log('PDF generated successfully!');
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
