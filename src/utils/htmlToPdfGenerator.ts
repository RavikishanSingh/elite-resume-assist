
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
    clonedElement.style.width = '210mm';
    clonedElement.style.minHeight = 'auto';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '20mm';
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.fontSize = '12px';
    clonedElement.style.lineHeight = '1.4';
    clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    clonedElement.style.color = '#333333';
    clonedElement.style.transform = 'none';

    // Fix any layout issues in the clone
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(element => {
      const el = element as HTMLElement;
      // Remove any transform scaling that might cause issues
      if (el.style.transform && el.style.transform.includes('scale')) {
        el.style.transform = '';
      }
      // Ensure proper text rendering with proper TypeScript handling
      try {
        (el.style as any).webkitFontSmoothing = 'antialiased';
        (el.style as any).mozOsxFontSmoothing = 'grayscale';
      } catch (e) {
        // Ignore if browser doesn't support these properties
      }
    });

    // Append to body for rendering
    document.body.appendChild(clonedElement);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing content with html2canvas...');

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      logging: false,
      removeContainer: false,
      imageTimeout: 15000,
      height: clonedElement.scrollHeight,
      width: clonedElement.scrollWidth
    });

    // Clean up
    document.body.removeChild(clonedElement);

    console.log('Canvas captured successfully, generating PDF...');

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    // Create PDF with proper A4 proportions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const marginTop = 10;
    const marginBottom = 10;
    const contentHeight = pdfHeight - marginTop - marginBottom;
    
    // Calculate proper scaling
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Scale to fit A4 width with proper margins
    const scaleX = (pdfWidth - 20) / (canvasWidth / 2); // 10mm margins on each side
    const scaledContentHeight = (canvasHeight / 2) * scaleX;
    
    console.log(`Canvas: ${canvasWidth}x${canvasHeight}px`);
    console.log(`Scaled content height: ${scaledContentHeight}mm`);
    
    // Calculate pages needed
    const totalPages = Math.ceil(scaledContentHeight / contentHeight);
    console.log(`Total pages needed: ${totalPages}`);

    // Generate each page
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      // Calculate the portion of canvas for this page
      const yStartMM = pageNum * contentHeight;
      const yEndMM = Math.min((pageNum + 1) * contentHeight, scaledContentHeight);
      
      // Convert back to canvas pixels
      const yStartPx = (yStartMM / scaleX) * 2;
      const yEndPx = Math.min((yEndMM / scaleX) * 2, canvasHeight);
      const sliceHeight = yEndPx - yStartPx;

      if (sliceHeight > 0) {
        // Create canvas slice for this page
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCanvas.width = canvasWidth;
          pageCanvas.height = sliceHeight;

          // Fill with white background
          pageCtx.fillStyle = '#ffffff';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          
          // Draw the slice
          pageCtx.drawImage(
            canvas,
            0, yStartPx, canvasWidth, sliceHeight,
            0, 0, canvasWidth, sliceHeight
          );

          // Convert to image and add to PDF
          const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          
          // Calculate dimensions for PDF
          const imgWidth = pdfWidth - 20; // 10mm margins
          const imgHeight = (sliceHeight / 2) * scaleX;
          
          pdf.addImage(
            imgData,
            'JPEG',
            10, // 10mm left margin
            marginTop,
            imgWidth,
            Math.min(imgHeight, contentHeight),
            undefined,
            'FAST'
          );

          console.log(`Page ${pageNum + 1}/${totalPages} added`);
        }
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
