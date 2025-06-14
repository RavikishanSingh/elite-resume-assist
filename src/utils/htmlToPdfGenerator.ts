
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

    // Apply professional PDF styling while maintaining exact size
    resumeElement.style.cssText = `
      ${originalStyle}
      background: white !important;
      box-shadow: none !important;
      border: none !important;
      transform: none !important;
      overflow: visible !important;
      width: ${originalWidth}px !important;
      min-height: ${originalHeight}px !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
    `;

    // Enhanced page break handling for professional multi-page layout
    const sections = resumeElement.querySelectorAll('section, .experience-item, .project-item, .education-item');
    sections.forEach(section => {
      const element = section as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '3';
      element.style.widows = '3';
      element.style.marginBottom = '20px'; // Ensure proper spacing between sections
    });

    // Ensure headers don't get separated from content
    const headers = resumeElement.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.orphans = '3';
      element.style.marginBottom = '12px'; // Professional spacing after headers
    });

    // Add professional spacing for multi-page layout
    const experienceItems = resumeElement.querySelectorAll('[style*="pageBreakInside: avoid"]');
    experienceItems.forEach((item, index) => {
      const element = item as HTMLElement;
      if (index > 0) {
        element.style.marginTop = '24px'; // Professional spacing between items
      }
    });

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Capturing resume at original preview size for professional PDF...');

    // Get the actual rendered dimensions
    const actualWidth = resumeElement.offsetWidth;
    const actualHeight = resumeElement.scrollHeight;
    
    console.log(`Professional capture dimensions: ${actualWidth}x${actualHeight}px`);

    // Configure html2canvas for high-quality professional capture
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // High quality for professional output
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
          // Preserve exact professional styling in clone
          clonedElement.style.width = `${actualWidth}px`;
          clonedElement.style.minHeight = `${actualHeight}px`;
          clonedElement.style.overflow = 'visible';
          clonedElement.style.background = 'white';
          
          // Fix any layout issues in the clone for professional output
          const clonedSections = clonedElement.querySelectorAll('section, div');
          clonedSections.forEach(section => {
            const element = section as HTMLElement;
            element.style.pageBreakInside = 'avoid';
            element.style.breakInside = 'avoid';
            element.style.orphans = '3';
            element.style.widows = '3';
          });

          // Ensure icons and logos are properly positioned
          const icons = clonedElement.querySelectorAll('svg, .lucide');
          icons.forEach(icon => {
            const element = icon as HTMLElement;
            element.style.display = 'inline-block';
            element.style.verticalAlign = 'middle';
            element.style.flexShrink = '0';
          });
        }
      }
    });

    console.log('Canvas captured, generating professional multi-page PDF...');

    // Create PDF with professional A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Professional A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const topMargin = 20; // Professional top margin for subsequent pages
    const bottomMargin = 20; // Professional bottom margin
    const sideMargin = 15; // Professional side margins
    const effectiveWidth = pdfWidth - (sideMargin * 2);
    const effectiveHeight = pdfHeight - topMargin - bottomMargin;
    
    // Calculate scaling to fit A4 professionally while maintaining aspect ratio
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`Professional PDF dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Calculate number of pages needed with professional spacing
    const totalPages = Math.ceil(scaledHeight / effectiveHeight);
    console.log(`Total professional pages needed: ${totalPages}`);

    // Add pages to PDF with professional margins and spacing
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

        // Fill with professional white background
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw the portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        // Convert to high-quality image and add to PDF
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        
        // Position on page with professional margins
        const xPosition = sideMargin;
        const yPosition = page === 0 ? topMargin : topMargin;
        const availableHeight = effectiveHeight;
        const finalHeight = Math.min(currentPageHeight, availableHeight);

        pdf.addImage(imgData, 'JPEG', xPosition, yPosition, scaledWidth, finalHeight, undefined, 'FAST');

        console.log(`Professional page ${page + 1}/${totalPages} - Height: ${finalHeight}mm, Y-position: ${yPosition}mm, X-position: ${xPosition}mm`);
      }
    }

    // Restore original styling
    resumeElement.style.cssText = originalStyle;

    // Add professional metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder',
      keywords: 'resume, professional, career, job application'
    });

    console.log('Professional multi-page PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    
    // Restore original styling in case of error
    const resumeElement = document.getElementById('resume-preview');
    if (resumeElement) {
      resumeElement.style.cssText = '';
    }
    
    throw new Error('Failed to generate professional PDF: ' + (error as Error).message);
  }
};
