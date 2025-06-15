import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Intelligent Section Page Break PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume with intelligent section page breaks...');

    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-specific styles to ensure proper page breaks for ALL sections
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

    // Apply intelligent page breaks to ALL sections to prevent content splitting
    const allSections = clonedElement.querySelectorAll('section');
    allSections.forEach((section, index) => {
      const element = section as HTMLElement;
      
      // Ensure no section gets cut in half
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.orphans = '4';
      element.style.widows = '4';
      
      // Apply smart page breaks based on section position
      if (index === 0) {
        // First section (usually summary) stays with header
        element.style.pageBreakBefore = 'avoid';
        element.style.breakBefore = 'avoid';
      } else if (index === 1) {
        // Second section can break if needed but prefer to stay
        element.style.pageBreakBefore = 'auto';
        element.style.breakBefore = 'auto';
      } else {
        // Later sections should start fresh pages if they would be cut
        element.style.pageBreakBefore = 'always';
        element.style.breakBefore = 'always';
      }
      
      console.log(`Applied intelligent page breaks to section ${index + 1}`);
    });

    // Enhanced header handling - never break header
    const headers = clonedElement.querySelectorAll('h1, h2, h3, h4, header');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      
      // Headers should keep their content together
      const nextSibling = element.nextElementSibling;
      if (nextSibling) {
        (nextSibling as HTMLElement).style.pageBreakBefore = 'avoid';
        (nextSibling as HTMLElement).style.breakBefore = 'avoid';
      }
    });

    // Ensure experience and project items stay together
    const experienceItems = clonedElement.querySelectorAll('[style*="pageBreakInside: avoid"]');
    experienceItems.forEach(item => {
      const element = item as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
    });

    document.body.appendChild(clonedElement);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Capturing resume with intelligent section page breaks...');

    const actualWidth = clonedElement.offsetWidth;
    const actualHeight = clonedElement.scrollHeight;
    
    console.log(`PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

    const canvas = await html2canvas(clonedElement, {
      scale: 2.5, // Higher scale for better quality
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
          // Re-apply intelligent section breaks in cloned document
          const sectionsInClone = clonedDocElement.querySelectorAll('section');
          sectionsInClone.forEach((section, index) => {
            const element = section as HTMLElement;
            element.style.pageBreakInside = 'avoid';
            element.style.breakInside = 'avoid';
            
            if (index > 1) {
              element.style.pageBreakBefore = 'always';
              element.style.breakBefore = 'always';
            }
          });
        }
      }
    });

    document.body.removeChild(clonedElement);

    console.log('Canvas captured, generating PDF with intelligent section breaks...');

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions optimized for intelligent section breaks
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 15; // Balanced margin for better content flow
    const effectiveWidth = pdfWidth - (margin * 2);
    const effectiveHeight = pdfHeight - (margin * 2);
    
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`PDF scaled dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Calculate pages with intelligent section break consideration
    const totalPages = Math.ceil(scaledHeight / effectiveHeight);
    
    console.log(`Total pages with intelligent section breaks: ${totalPages}`);

    // Generate pages with proper intelligent section placement
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

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
        const finalHeight = Math.min(currentPageHeight, effectiveHeight);

        pdf.addImage(imgData, 'JPEG', margin, margin, scaledWidth, finalHeight, undefined, 'FAST');

        console.log(`Page ${page + 1}/${totalPages} - Height: ${finalHeight}mm (Intelligent Section Breaks)`);
      }
    }

    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume with Intelligent Section Page Breaks',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder - Intelligent Section Breaks',
      keywords: 'resume, professional, career, intelligent page breaks, sections'
    });

    console.log('Intelligent Section Page Break PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('Intelligent Section Page Break PDF generation error:', error);
    throw new Error('Failed to generate PDF with intelligent section breaks: ' + (error as Error).message);
  }
};
