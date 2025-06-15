
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Key Projects Page 2 PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume with Key Projects forced to page 2...');

    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    clonedElement.id = 'resume-pdf-clone';
    
    // Apply PDF-specific styles to ensure proper page breaks
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

    // Force Key Projects to start on new page
    const projectsSection = clonedElement.querySelector('[key="projects"]') || 
                           clonedElement.querySelector('section:has(h2:contains("Key Projects"))') ||
                           clonedElement.querySelector('h2:contains("Key Projects")')?.closest('section');
    
    if (projectsSection) {
      const element = projectsSection as HTMLElement;
      element.style.pageBreakBefore = 'always';
      element.style.breakBefore = 'always';
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      console.log('Forced Key Projects to start on new page');
    }

    // Ensure other sections don't break badly
    const sections = clonedElement.querySelectorAll('section');
    sections.forEach((section, index) => {
      const element = section as HTMLElement;
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
      element.style.orphans = '4';
      element.style.widows = '4';
    });

    // Enhanced header handling
    const headers = clonedElement.querySelectorAll('h1, h2, h3, h4');
    headers.forEach(header => {
      const element = header as HTMLElement;
      element.style.pageBreakAfter = 'avoid';
      element.style.breakAfter = 'avoid';
      element.style.pageBreakInside = 'avoid';
      element.style.breakInside = 'avoid';
    });

    document.body.appendChild(clonedElement);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturing resume with Key Projects on page 2...');

    const actualWidth = clonedElement.offsetWidth;
    const actualHeight = clonedElement.scrollHeight;
    
    console.log(`PDF capture dimensions: ${actualWidth}x${actualHeight}px`);

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
          // Re-apply Key Projects page break in cloned document
          const projectsInClone = clonedDocElement.querySelector('[key="projects"]') ||
                                 clonedDocElement.querySelector('section:has(h2:contains("Key Projects"))')
          if (projectsInClone) {
            const element = projectsInClone as HTMLElement;
            element.style.pageBreakBefore = 'always';
            element.style.breakBefore = 'always';
          }
        }
      }
    });

    document.body.removeChild(clonedElement);

    console.log('Canvas captured, generating PDF with Key Projects on page 2...');

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas capture failed - no content rendered');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions optimized for Key Projects page break
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 12; // Optimal margin for page breaks
    const effectiveWidth = pdfWidth - (margin * 2);
    const effectiveHeight = pdfHeight - (margin * 2);
    
    const canvasAspectRatio = canvas.height / canvas.width;
    const scaledWidth = effectiveWidth;
    const scaledHeight = scaledWidth * canvasAspectRatio;

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`PDF scaled dimensions: ${scaledWidth}x${scaledHeight}mm`);

    // Calculate pages with Key Projects break consideration
    const page1Height = 240; // Force break before Key Projects
    const remainingHeight = scaledHeight - page1Height;
    const additionalPages = Math.ceil(remainingHeight / effectiveHeight);
    const totalPages = 1 + additionalPages;
    
    console.log(`Total pages with Key Projects on page 2: ${totalPages}`);

    // Generate pages with proper Key Projects placement
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      let startY, endY, currentPageHeight;
      
      if (page === 0) {
        // Page 1: Content up to Key Projects
        startY = 0;
        endY = page1Height;
        currentPageHeight = page1Height;
      } else {
        // Page 2+: Key Projects and remaining content
        startY = page1Height + ((page - 1) * effectiveHeight);
        endY = Math.min(startY + effectiveHeight, scaledHeight);
        currentPageHeight = endY - startY;
      }

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

        console.log(`Page ${page + 1}/${totalPages} - Height: ${finalHeight}mm ${page === 1 ? '(Key Projects starts here)' : ''}`);
      }
    }

    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume with Key Projects on Page 2',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder - Key Projects Page 2',
      keywords: 'resume, professional, career, key projects, page 2'
    });

    console.log('Key Projects Page 2 PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('Key Projects Page 2 PDF generation error:', error);
    throw new Error('Failed to generate PDF with Key Projects on page 2: ' + (error as Error).message);
  }
};
