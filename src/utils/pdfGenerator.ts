
import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Starting PDF Generation ===');
  console.log('Data received:', data);
  console.log('Template:', templateName);

  try {
    // Dynamic import of jsPDF
    const { default: jsPDF } = await import('jspdf');
    console.log('jsPDF imported successfully');

    // Basic validation
    if (!data || !data.personalInfo?.fullName) {
      console.log('Insufficient data, using fallback PDF');
      return await generateFallbackPDF(data);
    }

    // Try to find the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    
    if (!resumeElement) {
      console.log('Resume preview element not found, using fallback');
      return await generateFallbackPDF(data);
    }

    console.log('Resume element found, checking visibility...');
    
    // Ensure element is visible and properly sized
    const rect = resumeElement.getBoundingClientRect();
    console.log('Element rect:', rect);
    
    if (rect.width === 0 || rect.height === 0) {
      console.log('Element has zero dimensions, using fallback');
      return await generateFallbackPDF(data);
    }

    // Force element to be visible with proper styling
    const originalStyles = {
      display: resumeElement.style.display,
      visibility: resumeElement.style.visibility,
      opacity: resumeElement.style.opacity,
      transform: resumeElement.style.transform,
      position: resumeElement.style.position
    };

    // Apply capture-friendly styles
    resumeElement.style.display = 'block';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.opacity = '1';
    resumeElement.style.transform = 'none';
    resumeElement.style.position = 'relative';

    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Capturing element with html2canvas...');
    
    // Capture with optimized settings
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.scale = '1';
        }
      }
    });

    // Restore original styles
    Object.assign(resumeElement.style, originalStyles);

    console.log('Canvas created:', canvas.width, 'x', canvas.height);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.log('Invalid canvas, using fallback');
      return await generateFallbackPDF(data);
    }

    // Get image data
    const imageData = canvas.toDataURL('image/png', 1.0);
    
    if (!imageData || imageData === 'data:,' || imageData.length < 100) {
      console.log('Invalid image data, using fallback');
      return await generateFallbackPDF(data);
    }

    console.log('Creating PDF document...');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Calculate aspect ratio and fit image properly
    const canvasAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;
    
    let imgWidth = pageWidth;
    let imgHeight = pageHeight;
    
    if (canvasAspectRatio > pageAspectRatio) {
      // Canvas is wider, fit to width
      imgHeight = pageWidth / canvasAspectRatio;
    } else {
      // Canvas is taller, fit to height
      imgWidth = pageHeight * canvasAspectRatio;
    }
    
    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    
    console.log(`Adding image to PDF: ${imgWidth}mm x ${imgHeight}mm at (${x}, ${y})`);
    
    pdf.addImage(imageData, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST');
    
    console.log('PDF generated successfully!');
    return pdf;

  } catch (error) {
    console.error('Error in PDF generation:', error);
    console.log('Falling back to text-based PDF');
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
      if (!text || text.trim() === '') return;
      
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
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(data.personalInfo.fullName, margin, currentY);
      currentY += 12;
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
    throw new Error('Failed to generate PDF: ' + error.message);
  }
};
