
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Professional PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume for PDF generation...');

    // Create a clean clone for PDF generation
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-optimized styles
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '0';
    clonedElement.style.width = '794px'; // A4 width in pixels at 96dpi
    clonedElement.style.minHeight = '1123px'; // A4 height in pixels at 96dpi
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '40px'; // Balanced padding
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.fontSize = '14px';
    clonedElement.style.lineHeight = '1.5';
    clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    clonedElement.style.color = '#333333';

    // Fix any layout issues in the clone
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(element => {
      const el = element as HTMLElement;
      // Remove any transform scaling that might cause issues
      if (el.style.transform && el.style.transform.includes('scale')) {
        el.style.transform = '';
      }
      // Ensure proper text rendering
      el.style.webkitFontSmoothing = 'antialiased';
      el.style.mozOsxFontSmoothing = 'grayscale';
    });

    // Append to body for rendering
    document.body.appendChild(clonedElement);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing content with html2canvas...');

    const canvas = await html2canvas(clonedElement, {
      scale: 2, // High quality capture
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: clonedElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: clonedElement.scrollHeight,
      logging: false,
      removeContainer: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure the cloned document has proper styling
        const clonedBody = clonedDoc.body;
        clonedBody.style.margin = '0';
        clonedBody.style.padding = '0';
      }
    });

    // Clean up
    document.body.removeChild(clonedElement);

    console.log('Canvas captured successfully, generating PDF...');

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 15; // Reasonable margin
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);
    
    // Calculate scaling to fit content properly
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledHeight = contentWidth * canvasAspectRatio;

    console.log(`Canvas: ${canvas.width}x${canvas.height}px`);
    console.log(`PDF content area: ${contentWidth}x${contentHeight}mm`);
    console.log(`Scaled height: ${scaledHeight}mm`);

    // Calculate number of pages needed
    const totalPages = Math.ceil(scaledHeight / contentHeight);
    console.log(`Total pages needed: ${totalPages}`);

    // Generate pages
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const startY = page * contentHeight;
      const endY = Math.min(startY + contentHeight, scaledHeight);
      const currentPageHeight = endY - startY;

      // Create a canvas for this page
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        // Calculate source dimensions from original canvas
        const sourceHeight = (currentPageHeight / scaledHeight) * canvas.height;
        const sourceY = (startY / scaledHeight) * canvas.height;

        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        // Fill with white background
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        
        // Enable high-quality rendering
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';

        // Draw the portion of the canvas for this page
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        // Convert to image and add to PDF
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        
        // Add image to PDF with proper positioning
        pdf.addImage(
          imgData, 
          'JPEG', 
          margin, 
          margin, 
          contentWidth, 
          currentPageHeight,
          undefined,
          'FAST'
        );

        console.log(`Page ${page + 1}/${totalPages} added - Height: ${currentPageHeight.toFixed(2)}mm`);
      }
    }

    // Set PDF metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo?.fullName || 'Resume Builder User',
      creator: 'Professional Resume Builder',
      keywords: 'resume, professional, career'
    });

    console.log('=== PDF generation completed successfully ===');
    return pdf;

  } catch (error) {
    console.error('PDF generation error:', error);
    
    // Provide specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Canvas capture failed')) {
        throw new Error('Failed to capture resume content. Please try refreshing the page and trying again.');
      } else if (error.message.includes('Resume preview not found')) {
        throw new Error('Resume preview is not ready. Please wait for the preview to load completely.');
      } else {
        throw new Error(`PDF generation failed: ${error.message}`);
      }
    }
    
    throw new Error('An unexpected error occurred during PDF generation. Please try again.');
  }
};
