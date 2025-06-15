
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

    // Create a clone for PDF generation to avoid affecting the preview
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-specific styles to the clone
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '-9999px';
    clonedElement.style.width = '210mm';
    clonedElement.style.minHeight = '297mm';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.fontSize = '12px';
    clonedElement.style.lineHeight = '1.5';
    clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // Ensure all text is visible and not cut off
    clonedElement.style.overflow = 'visible';
    clonedElement.style.wordWrap = 'break-word';
    clonedElement.style.hyphens = 'auto';
    
    // Fix text rendering issues
    const allTextElements = clonedElement.querySelectorAll('*');
    allTextElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.overflow = 'visible';
      el.style.textOverflow = 'clip';
      el.style.whiteSpace = 'normal';
      el.style.wordBreak = 'normal';
      el.style.overflowWrap = 'break-word';
    });

    // Enhanced page break handling for professional multi-page layout
    const sections = clonedElement.querySelectorAll('section, .experience-item, .project-item, .education-item');
    sections.forEach(section => {
      const element = section as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '3';
      element.style.widows = '3';
    });

    // Ensure headers don't get separated from content
    const headers = clonedElement.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.orphans = '3';
    });

    // Add clone to document for rendering
    document.body.appendChild(clonedElement);

    // Wait for layout to settle and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Capturing resume with enhanced text rendering...');

    // Get the actual rendered dimensions of the clone
    const actualWidth = clonedElement.offsetWidth;
    const actualHeight = clonedElement.scrollHeight;
    
    console.log(`PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

    // Configure html2canvas for high-quality professional capture with better text rendering
    const canvas = await html2canvas(clonedElement, {
      scale: 4, // Higher scale for better text quality
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
      foreignObjectRendering: true, // Better rendering for complex elements
      onclone: (clonedDoc) => {
        const clonedDocElement = clonedDoc.getElementById('resume-pdf-clone');
        if (clonedDocElement) {
          // Ensure proper font loading in the cloned document
          clonedDocElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          clonedDocElement.style.fontSize = '12px';
          clonedDocElement.style.lineHeight = '1.5';
          
          // Fix any text rendering issues in the clone
          const textElements = clonedDocElement.querySelectorAll('*');
          textElements.forEach(el => {
            const element = el as HTMLElement;
            element.style.overflow = 'visible';
            element.style.textOverflow = 'clip';
            element.style.whiteSpace = 'normal';
          });
        }
      }
    });

    // Remove the clone from document
    document.body.removeChild(clonedElement);

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
    const margin = 5; // Reduced margin to prevent content cutoff
    const effectiveWidth = pdfWidth - (margin * 2);
    const effectiveHeight = pdfHeight - (margin * 2);
    
    // Calculate scaling to fit A4 while maintaining aspect ratio and preventing text cutoff
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`PDF dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Calculate number of pages needed
    const totalPages = Math.ceil(scaledHeight / effectiveHeight);
    console.log(`Total pages needed: ${totalPages}`);

    // Add pages to PDF with proper content distribution
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

        // Apply smoothing for better text quality
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';

        // Draw the portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        // Convert to image and add to PDF with high quality
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        
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
