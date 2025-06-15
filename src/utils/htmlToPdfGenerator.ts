
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateDirectPDF } from './directPdfGenerator';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Professional PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    // For better results, try direct PDF generation first
    if (templateName === 'modern') {
      console.log('Using direct PDF generation for modern template...');
      return generateDirectPDF(data);
    }

    // Fallback to html2canvas for other templates with improved settings
    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume for HTML-to-PDF generation...');

    // Create a clean clone for PDF generation
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-optimized styles
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '0';
    clonedElement.style.width = '794px'; // A4 width in pixels at 96 DPI
    clonedElement.style.minHeight = 'auto';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '40px'; // Consistent padding
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.fontSize = '14px';
    clonedElement.style.lineHeight = '1.5';
    clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    clonedElement.style.color = '#333333';
    clonedElement.style.transform = 'none';
    clonedElement.style.zoom = '1';

    // Fix any layout issues in the clone
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(element => {
      const el = element as HTMLElement;
      
      // Remove transforms that might cause issues
      if (el.style.transform && el.style.transform.includes('scale')) {
        el.style.transform = '';
      }
      
      // Ensure proper text rendering
      try {
        (el.style as any).webkitFontSmoothing = 'antialiased';
        (el.style as any).mozOsxFontSmoothing = 'grayscale';
      } catch (e) {
        // Ignore if browser doesn't support these properties
      }
      
      // Fix page break properties for better layout
      if (el.style.pageBreakInside) {
        el.style.pageBreakInside = 'avoid';
      }
      if (el.style.breakInside) {
        el.style.breakInside = 'avoid';
      }
    });

    // Append to body for rendering
    document.body.appendChild(clonedElement);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Capturing content with html2canvas...');

    const canvas = await html2canvas(clonedElement, {
      scale: 2, // High resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      logging: false,
      removeContainer: true,
      imageTimeout: 15000,
      height: clonedElement.scrollHeight,
      width: clonedElement.scrollWidth,
      x: 0,
      y: 0,
      windowWidth: clonedElement.scrollWidth,
      windowHeight: clonedElement.scrollHeight
    });

    // Clean up
    document.body.removeChild(clonedElement);

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    console.log('Canvas captured successfully, generating PDF...');

    // Create PDF with exact A4 proportions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 0; // No extra margins since content already has padding
    
    // Calculate proper scaling to fit A4 exactly
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;
    
    let imgWidth = pdfWidth;
    let imgHeight = pdfHeight;
    
    // Scale to fit within A4 while maintaining aspect ratio
    if (canvasAspectRatio > pdfAspectRatio) {
      // Canvas is wider, scale by width
      imgHeight = pdfWidth / canvasAspectRatio;
    } else {
      // Canvas is taller, scale by height
      imgWidth = pdfHeight * canvasAspectRatio;
    }
    
    console.log(`Canvas: ${canvas.width}x${canvas.height}px`);
    console.log(`PDF dimensions: ${imgWidth}x${imgHeight}mm`);
    
    // Calculate how many pages we need
    const contentHeight = (canvas.height / canvas.width) * imgWidth;
    const totalPages = Math.ceil(contentHeight / pdfHeight);
    
    console.log(`Content height: ${contentHeight}mm, Pages needed: ${totalPages}`);

    // Generate each page
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      // Calculate the slice of canvas for this page
      const yStart = (pageNum * pdfHeight / contentHeight) * canvas.height;
      const yEnd = Math.min(((pageNum + 1) * pdfHeight / contentHeight) * canvas.height, canvas.height);
      const sliceHeight = yEnd - yStart;

      if (sliceHeight > 0) {
        // Create a canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;

          // Fill with white background
          pageCtx.fillStyle = '#ffffff';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          
          // Draw the slice
          pageCtx.drawImage(
            canvas,
            0, yStart, canvas.width, sliceHeight,
            0, 0, canvas.width, sliceHeight
          );

          // Convert to image and add to PDF
          const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          
          // Center the content on the page
          const xOffset = (pdfWidth - imgWidth) / 2;
          const yOffset = margin;
          
          pdf.addImage(
            imgData,
            'JPEG',
            xOffset,
            yOffset,
            imgWidth,
            Math.min(pdfHeight - (2 * margin), (sliceHeight / canvas.width) * imgWidth),
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
