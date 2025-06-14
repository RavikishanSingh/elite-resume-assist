
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

    // Set up the resume element for optimal PDF capture
    const originalStyle = resumeElement.style.cssText;
    
    // Apply professional PDF styling
    resumeElement.style.cssText = `
      width: 210mm !important;
      min-height: 297mm !important;
      max-width: 210mm !important;
      padding: 20mm !important;
      margin: 0 !important;
      background: white !important;
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
      color: #2d3748 !important;
      box-sizing: border-box !important;
      transform: none !important;
      box-shadow: none !important;
      border: none !important;
      page-break-inside: avoid !important;
    `;

    // Wait for fonts and layout to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('Capturing high-quality resume...');

    // Configure html2canvas for professional quality
    const canvas = await html2canvas(resumeElement, {
      scale: 3, // High resolution for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width at 96 DPI
      height: Math.max(1123, resumeElement.scrollHeight), // Dynamic height
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: Math.max(1123, resumeElement.scrollHeight),
      logging: false,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('resume-preview');
        if (clonedElement) {
          // Ensure all text is readable and properly styled
          clonedElement.style.fontFamily = 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
          clonedElement.style.fontSize = '11pt';
          clonedElement.style.lineHeight = '1.4';
          
          // Fix any layout issues in the clone
          const sections = clonedElement.querySelectorAll('section, div');
          sections.forEach(section => {
            const element = section as HTMLElement;
            element.style.pageBreakInside = 'avoid';
            element.style.orphans = '3';
            element.style.widows = '3';
          });
        }
      }
    });

    console.log('Canvas captured, generating professional PDF...');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const pageHeight = canvas.height * (pdfWidth / canvas.width);

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`Calculated PDF height: ${pageHeight}mm`);

    // Calculate number of pages needed
    const totalPages = Math.ceil(pageHeight / pdfHeight);
    console.log(`Total pages needed: ${totalPages}`);

    // Add pages to PDF
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // Calculate the portion of canvas to include in this page
      const startY = page * pdfHeight;
      const endY = Math.min((page + 1) * pdfHeight, pageHeight);
      const currentPageHeight = endY - startY;

      // Create a canvas for this page
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        const sourceHeight = (currentPageHeight * canvas.height) / pageHeight;
        const sourceY = (startY * canvas.height) / pageHeight;

        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        // Draw the portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, canvas.width, sourceHeight
        );

        // Convert to image and add to PDF
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        
        // Calculate dimensions to fit page perfectly
        const imgWidth = pdfWidth;
        const imgHeight = currentPageHeight;

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

        console.log(`Added page ${page + 1}/${totalPages}`);
      }
    }

    // Restore original styling
    resumeElement.style.cssText = originalStyle;

    // Add metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo?.fullName || 'Resume Builder',
      creator: 'Professional Resume Builder',
      producer: 'Advanced PDF Generator'
    });

    console.log('Multi-page PDF generation completed successfully');
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
