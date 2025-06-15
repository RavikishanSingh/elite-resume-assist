
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Enhanced Section-Aware PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    // Get the resume preview element - check both IDs
    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume for section-aware multi-page capture...');

    // Create a clone for PDF generation to avoid affecting the preview
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-specific styles to the clone with enhanced section handling
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
    clonedElement.style.fontSize = '11pt';
    clonedElement.style.lineHeight = '1.4';
    clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    clonedElement.style.transform = 'none';
    clonedElement.style.transformOrigin = 'unset';
    clonedElement.style.overflow = 'visible';
    
    // Enhanced section-aware page break handling
    const sections = clonedElement.querySelectorAll('section');
    sections.forEach((section, index) => {
      const element = section as HTMLElement;
      // Ensure sections start on new pages when needed
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '4';
      element.style.widows = '4';
      
      // Force page breaks for specific sections if they're getting too long
      if (index > 0) {
        element.style.pageBreakBefore = 'auto';
        element.style.breakBefore = 'auto';
      }
    });

    // Enhanced header handling to prevent separation
    const headers = clonedElement.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '4';
      element.style.widows = '4';
    });

    // Enhanced experience and project item handling
    const items = clonedElement.querySelectorAll('.experience-item, .project-item, .education-item, [style*="pageBreakInside"]');
    items.forEach(item => {
      const element = item as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '4';
      element.style.widows = '4';
    });

    // Add clone to document for rendering
    document.body.appendChild(clonedElement);

    // Extended wait for layout to settle and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing resume with section-aware rendering...');

    // Get the actual rendered dimensions
    const actualWidth = clonedElement.offsetWidth;
    const actualHeight = clonedElement.scrollHeight;
    
    console.log(`Section-aware PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

    // Configure html2canvas for section-aware high-quality capture
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
      logging: false,
      removeContainer: false,
      onclone: (clonedDoc) => {
        const clonedDocElement = clonedDoc.getElementById('resume-pdf-clone');
        if (clonedDocElement) {
          // Ensure proper font loading and section visibility
          clonedDocElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          clonedDocElement.style.fontSize = '11pt';
          clonedDocElement.style.lineHeight = '1.4';
          clonedDocElement.style.color = '#000000';
          clonedDocElement.style.visibility = 'visible';
          clonedDocElement.style.opacity = '1';
          clonedDocElement.style.display = 'block';
          
          // Re-apply section break styles in cloned document
          const clonedSections = clonedDocElement.querySelectorAll('section');
          clonedSections.forEach(section => {
            const element = section as HTMLElement;
            element.style.pageBreakInside = 'avoid';
            element.style.breakInside = 'avoid';
          });
        }
      }
    });

    // Remove the clone from document
    document.body.removeChild(clonedElement);

    console.log('Canvas captured, generating section-aware multi-page PDF...');

    // Verify canvas has content
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    // Create PDF with professional A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Professional A4 dimensions with optimized margins for section flow
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10; // Reduced margin for better content flow
    const effectiveWidth = pdfWidth - (margin * 2);
    const effectiveHeight = pdfHeight - (margin * 2);
    
    // Calculate scaling to fit A4 while maintaining aspect ratio
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`PDF dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Intelligent page break calculation based on section boundaries
    const pageBreakThreshold = effectiveHeight - 5; // Small buffer for section completion
    const totalPages = Math.ceil(scaledHeight / pageBreakThreshold);
    console.log(`Total pages needed with section awareness: ${totalPages}`);

    // Add pages to PDF with intelligent section-aware content distribution
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // Calculate the portion of canvas to include in this page
      const startY = page * pageBreakThreshold;
      const endY = Math.min((page + 1) * pageBreakThreshold, scaledHeight);
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

        // Apply high-quality smoothing for crisp text
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';

        // Draw the portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        // Convert to image and add to PDF with optimized quality
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        
        // Position on page with optimized margins
        const xPosition = margin;
        const yPosition = margin;
        const finalHeight = Math.min(currentPageHeight, pageBreakThreshold);

        pdf.addImage(imgData, 'JPEG', xPosition, yPosition, scaledWidth, finalHeight, undefined, 'FAST');

        console.log(`Page ${page + 1}/${totalPages} - Height: ${finalHeight}mm (Section-aware)`);
      }
    }

    // Add professional metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume with Section-Aware Layout',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder - Section Aware',
      keywords: 'resume, professional, career, job application, section layout'
    });

    console.log('Section-aware PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('Section-aware PDF generation error:', error);
    throw new Error('Failed to generate section-aware PDF: ' + (error as Error).message);
  }
};
