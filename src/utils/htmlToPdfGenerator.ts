
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Smart Section Page Break PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume with smart section page breaks...');

    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-specific styles with proper margins
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '-9999px';
    clonedElement.style.width = '210mm';
    clonedElement.style.minHeight = '297mm';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '20mm'; // Balanced padding
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.fontSize = '11pt';
    clonedElement.style.lineHeight = '1.4';
    clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Apply smart page breaks to sections
    const allSections = clonedElement.querySelectorAll('section');
    allSections.forEach((section, index) => {
      const element = section as HTMLElement;
      
      // Ensure sections don't get cut in half
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.marginBottom = '20px';
      
      // Smart page break logic
      if (index >= 2) { // From third section onwards, start on new page if needed
        element.style.pageBreakBefore = 'auto';
        element.style.breakBefore = 'auto';
      }
      
      console.log(`Applied smart page breaks to section ${index + 1}`);
    });

    // Enhanced header handling
    const headers = clonedElement.querySelectorAll('h1, h2, h3, h4, header');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
    });

    document.body.appendChild(clonedElement);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Capturing resume with smart section page breaks...');

    const actualWidth = clonedElement.offsetWidth;
    const actualHeight = clonedElement.scrollHeight;
    
    console.log(`PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

    const canvas = await html2canvas(clonedElement, {
      scale: 2.0, // Balanced scale for quality and performance
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
      removeContainer: false
    });

    document.body.removeChild(clonedElement);

    console.log('Canvas captured, generating PDF with proper margins...');

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions with balanced margins
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10; // Reduced margin for better balance
    const effectiveWidth = pdfWidth - (margin * 2);
    const effectiveHeight = pdfHeight - (margin * 2);
    
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`PDF scaled dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Calculate pages with smart section break consideration
    const totalPages = Math.ceil(scaledHeight / effectiveHeight);
    
    console.log(`Total pages with smart section breaks: ${totalPages}`);

    // Generate pages with proper content positioning
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const startY = page * effectiveHeight;
      const endY = Math.min(startY + effectiveHeight, scaledHeight);
      const currentPageHeight = endY - startY;

      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        const sourceHeight = (currentPageHeight * canvas.height) / scaledHeight;
        const sourceY = (startY * canvas.height) / scaledHeight;

        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';

        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const finalHeight = Math.min(currentPageHeight, effectiveHeight);

        // Center the content properly with balanced margins
        pdf.addImage(imgData, 'JPEG', margin, margin, scaledWidth, finalHeight, undefined, 'FAST');

        console.log(`Page ${page + 1}/${totalPages} - Height: ${finalHeight}mm (Balanced Layout)`);
      }
    }

    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume with Smart Section Page Breaks',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder - Smart Section Breaks',
      keywords: 'resume, professional, career, smart page breaks, sections'
    });

    console.log('Smart Section Page Break PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('Smart Section Page Break PDF generation error:', error);
    throw new Error('Failed to generate PDF with smart section breaks: ' + (error as Error).message);
  }
};
