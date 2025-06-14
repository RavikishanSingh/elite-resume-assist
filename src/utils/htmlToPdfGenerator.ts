
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Enhanced Multi-Page PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    // Get the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume for multi-page capture...');

    // Store original styles to restore later
    const originalStyle = resumeElement.style.cssText;
    const originalWidth = resumeElement.offsetWidth;
    const originalHeight = resumeElement.offsetHeight;
    
    console.log(`Original preview dimensions: ${originalWidth}x${originalHeight}px`);

    // Temporarily remove any margins/padding from the container for PDF
    resumeElement.style.margin = '0';
    resumeElement.style.padding = '0';
    resumeElement.style.boxShadow = 'none';
    resumeElement.style.border = 'none';

    // Enhanced page break handling for professional multi-page layout
    const sections = resumeElement.querySelectorAll('section, .experience-item, .project-item, .education-item');
    sections.forEach(section => {
      const element = section as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '3';
      element.style.widows = '3';
    });

    // Ensure headers don't get separated from content
    const headers = resumeElement.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.orphans = '3';
    });

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Capturing resume with exact preview styling...');

    // Get the actual rendered dimensions after removing margins
    const actualWidth = resumeElement.offsetWidth;
    const actualHeight = resumeElement.scrollHeight;
    
    console.log(`PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

    // Configure html2canvas for high-quality professional capture
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: actualWidth,
      height: actualHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          // Ensure the cloned element has no margins/padding
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '0';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';
        }
      }
    });

    // Restore original styles
    resumeElement.style.cssText = originalStyle;

    console.log('Canvas captured, generating professional multi-page PDF...');

    // Create PDF with professional A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Professional A4 dimensions in mm with minimal margins
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 5; // Minimal margin to prevent edge cutting
    const effectiveWidth = pdfWidth - (margin * 2);
    const effectiveHeight = pdfHeight - (margin * 2);
    
    // Calculate scaling to fit A4 while maintaining aspect ratio
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`PDF dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Calculate number of pages needed
    const totalPages = Math.ceil(scaledHeight / effectiveHeight);
    console.log(`Total pages needed: ${totalPages}`);

    // Add pages to PDF
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // Calculate the portion of canvas to include in this page
      const startY = page * effectiveHeight;
      const endY = Math.min((page + 1) * effectiveHeight, scaledHeight);
      const currentPageHeight = endY - startY;

      // Create a canvas for this page
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        const sourceHeight = (currentPageHeight * canvas.height) / scaledHeight;
        const sourceY = (startY * canvas.height) / scaledHeight;

        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        // Fill with white background
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw the portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        // Convert to image and add to PDF
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        
        // Position on page with minimal margins
        const xPosition = margin;
        const yPosition = margin;
        const finalHeight = Math.min(currentPageHeight, effectiveHeight);

        pdf.addImage(imgData, 'JPEG', xPosition, yPosition, scaledWidth, finalHeight, undefined, 'FAST');

        console.log(`Page ${page + 1}/${totalPages} - Height: ${finalHeight}mm`);
      }
    }

    // Add professional metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder',
      keywords: 'resume, professional, career, job application'
    });

    console.log('PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
