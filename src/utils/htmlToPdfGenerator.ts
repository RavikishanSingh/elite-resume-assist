
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

    // Create a temporary clone for PDF generation with PDF-specific styling
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'pdf-clone';
    clonedElement.style.cssText = `
      position: absolute;
      top: -10000px;
      left: -10000px;
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
      z-index: -1;
    `;

    // Set PDF mode on the cloned template
    const templateElement = clonedElement.querySelector('[data-template]') || clonedElement.firstElementChild;
    if (templateElement && templateName === 'modern') {
      // For Modern template, ensure PDF-specific styling
      (templateElement as HTMLElement).className = 
        (templateElement as HTMLElement).className.replace(/px-16/g, 'px-12').replace(/py-12/g, 'py-10');
      
      // Update all spacing elements for PDF mode
      const spacingElements = clonedElement.querySelectorAll('[class*="px-"], [class*="pr-"]');
      spacingElements.forEach(el => {
        const element = el as HTMLElement;
        element.className = element.className
          .replace(/px-8/g, 'px-4')
          .replace(/px-4/g, 'px-2')
          .replace(/pr-4/g, 'pr-2');
      });
    }

    // Append clone to body for rendering
    document.body.appendChild(clonedElement);

    // Enhanced page break handling for professional multi-page layout
    const sections = clonedElement.querySelectorAll('section, .experience-item, .project-item, .education-item');
    sections.forEach(section => {
      const element = section as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '3';
      element.style.widows = '3';
      element.style.marginBottom = '20px';
    });

    // Ensure headers don't get separated from content
    const headers = clonedElement.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.orphans = '3';
      element.style.marginBottom = '12px';
    });

    // Add professional spacing for multi-page layout
    const experienceItems = clonedElement.querySelectorAll('[style*="pageBreakInside: avoid"]');
    experienceItems.forEach((item, index) => {
      const element = item as HTMLElement;
      if (index > 0) {
        element.style.marginTop = '24px';
      }
    });

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Capturing resume with PDF-optimized styling...');

    // Get the actual rendered dimensions of the clone
    const actualWidth = clonedElement.offsetWidth;
    const actualHeight = clonedElement.scrollHeight;
    
    console.log(`PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

    // Configure html2canvas for high-quality professional capture
    const canvas = await html2canvas(clonedElement, {
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
      logging: false
    });

    // Remove the clone
    document.body.removeChild(clonedElement);

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
    const topMargin = 15;
    const bottomMargin = 15;
    const sideMargin = 15;
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
        const yPosition = topMargin;
        const availableHeight = effectiveHeight;
        const finalHeight = Math.min(currentPageHeight, availableHeight);

        pdf.addImage(imgData, 'JPEG', xPosition, yPosition, scaledWidth, finalHeight, undefined, 'FAST');

        console.log(`Professional page ${page + 1}/${totalPages} - Height: ${finalHeight}mm, Y-position: ${yPosition}mm, X-position: ${xPosition}mm`);
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

    console.log('Professional multi-page PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('Enhanced PDF generation error:', error);
    throw new Error('Failed to generate professional PDF: ' + (error as Error).message);
  }
};
