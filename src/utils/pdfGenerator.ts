
import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  try {
    console.log('=== PDF Generation Started ===');
    console.log('Data:', data);
    console.log('Template:', templateName);
    
    const { default: jsPDF } = await import('jspdf');
    
    // Find the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
      console.error('Resume preview element not found');
      return generateTextPDF(data);
    }

    console.log('Resume element found');
    console.log('Element dimensions:', resumeElement.offsetWidth, 'x', resumeElement.offsetHeight);
    console.log('Element innerHTML length:', resumeElement.innerHTML.length);
    
    // Check if element has meaningful content
    const hasContent = resumeElement.innerHTML.trim().length > 100; // More than just empty divs
    if (!hasContent) {
      console.error('Resume element appears empty');
      return generateTextPDF(data);
    }

    // Ensure element is properly visible
    const computedStyle = window.getComputedStyle(resumeElement);
    console.log('Element visibility:', computedStyle.visibility);
    console.log('Element display:', computedStyle.display);
    console.log('Element opacity:', computedStyle.opacity);

    // Store original styles
    const originalStyles = {
      position: resumeElement.style.position,
      visibility: resumeElement.style.visibility,
      opacity: resumeElement.style.opacity,
      transform: resumeElement.style.transform,
      zIndex: resumeElement.style.zIndex,
      backgroundColor: resumeElement.style.backgroundColor
    };

    // Temporarily set optimal styles for capture
    resumeElement.style.position = 'relative';
    resumeElement.style.visibility = 'visible';
    resumeElement.style.opacity = '1';
    resumeElement.style.transform = 'scale(1)';
    resumeElement.style.zIndex = '9999';
    resumeElement.style.backgroundColor = '#ffffff';

    // Force reflow
    resumeElement.offsetHeight;

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Starting canvas capture...');
    console.log('Element final dimensions:', resumeElement.offsetWidth, 'x', resumeElement.offsetHeight);

    // Capture with html2canvas using more reliable settings
    const canvas = await html2canvas(resumeElement, {
      scale: 1, // Use 1:1 scale for better reliability
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false, // Reduce noise
      width: resumeElement.offsetWidth,
      height: resumeElement.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true, // Try this for better text rendering
      removeContainer: false,
      onclone: (clonedDoc) => {
        // Ensure styles are preserved in the clone
        const clonedElement = clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          clonedElement.style.visibility = 'visible';
          clonedElement.style.opacity = '1';
          clonedElement.style.backgroundColor = '#ffffff';
        }
      }
    });

    console.log('Canvas created:', canvas.width, 'x', canvas.height);

    // Restore original styles immediately
    Object.keys(originalStyles).forEach(key => {
      const value = originalStyles[key as keyof typeof originalStyles];
      if (value !== null && value !== undefined && value !== '') {
        (resumeElement.style as any)[key] = value;
      } else {
        resumeElement.style.removeProperty(key);
      }
    });

    // Validate canvas
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      console.error('Canvas is invalid or empty');
      return generateTextPDF(data);
    }

    // Check if canvas has actual content
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return generateTextPDF(data);
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasPixels = imageData.data.some((pixel, index) => {
      // Check alpha channel (every 4th value) and RGB values
      if (index % 4 === 3) return pixel > 0; // Alpha > 0
      return pixel < 255; // RGB < 255 (not pure white)
    });

    console.log('Canvas has visible content:', hasPixels);

    if (!hasPixels) {
      console.error('Canvas appears to be blank');
      return generateTextPDF(data);
    }

    // Convert to image
    const imgData = canvas.toDataURL('image/png', 1.0);
    console.log('Image data length:', imgData.length);

    if (!imgData || imgData === 'data:,' || imgData.length < 1000) {
      console.error('Image data is invalid');
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
    const margin = 10;
    const contentWidth = pageWidth - (2 * margin);
    const contentHeight = pageHeight - (2 * margin);

    // Calculate scaling to fit within A4 with margins
    const canvasAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = contentWidth / contentHeight;

    let imgWidth, imgHeight, xOffset, yOffset;

    if (canvasAspectRatio > pageAspectRatio) {
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

    console.log('Adding image to PDF:', { imgWidth, imgHeight, xOffset, yOffset });

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');

    console.log('=== PDF Generation Completed Successfully ===');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    console.log('Falling back to text PDF...');
    return generateTextPDF(data);
  }
};

const generateTextPDF = async (data: any) => {
  console.log('=== Generating Text-Based PDF ===');
  
  try {
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const lineHeight = 5;
    let yPos = margin;

    const addText = (text: string, fontSize: number = 10, fontWeight: string = 'normal') => {
      if (!text || text.trim() === '') return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontWeight);
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      // Check if we need a new page
      if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.text(lines, margin, yPos);
      yPos += lines.length * lineHeight + 2;
    };

    const addSection = (title: string) => {
      yPos += 5;
      addText(title, 12, 'bold');
      yPos += 2;
    };

    // Header
    if (data.personalInfo?.fullName) {
      addText(data.personalInfo.fullName, 16, 'bold');
      yPos += 3;
    }

    // Contact info
    const contactInfo = [];
    if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
    if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
    if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
    
    if (contactInfo.length > 0) {
      addText(contactInfo.join(' | '), 9);
    }

    // Summary
    if (data.personalInfo?.summary) {
      addSection('PROFESSIONAL SUMMARY');
      addText(data.personalInfo.summary, 10);
    }

    // Experience
    if (data.experience?.length > 0) {
      addSection('PROFESSIONAL EXPERIENCE');
      
      data.experience.forEach((exp: any) => {
        const jobTitle = exp.jobTitle || 'Position';
        const company = exp.company || 'Company';
        addText(`${jobTitle} - ${company}`, 11, 'bold');
        
        const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
        if (dateRange.trim() !== ' - ') {
          addText(dateRange, 9);
        }
        
        if (exp.description) {
          addText(exp.description, 9);
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
        addText(`${degree} - ${school}`, 10, 'bold');
        if (edu.graduationDate) {
          addText(edu.graduationDate, 9);
        }
        yPos += 2;
      });
    }

    // Skills
    if (data.skills?.length > 0) {
      addSection('SKILLS');
      addText(data.skills.join(', '), 9);
    }

    // Projects
    if (data.projects?.length > 0) {
      addSection('PROJECTS');
      
      data.projects.forEach((project: any) => {
        if (project.name) {
          addText(project.name, 10, 'bold');
        }
        if (project.description) {
          addText(project.description, 9);
        }
        if (project.technologies) {
          addText(`Technologies: ${project.technologies}`, 9);
        }
        yPos += 2;
      });
    }

    console.log('Text PDF generated successfully');
    return pdf;
    
  } catch (error) {
    console.error('Error generating text PDF:', error);
    
    // Last resort - create a minimal PDF with basic info
    const { default: jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    pdf.setFontSize(16);
    pdf.text('Resume', 20, 20);
    
    if (data.personalInfo?.fullName) {
      pdf.setFontSize(14);
      pdf.text(data.personalInfo.fullName, 20, 40);
    }
    
    pdf.setFontSize(10);
    pdf.text('Resume generated with basic formatting due to technical issues.', 20, 60);
    pdf.text('Please try again or contact support if this problem persists.', 20, 70);
    
    return pdf;
  }
};
