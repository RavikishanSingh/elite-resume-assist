import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateDirectPDF } from './directPdfGenerator';

// Helper function to wait for all images within an element to load.
const waitForImages = (element: HTMLElement): Promise<void[]> => {
  const images = Array.from(element.getElementsByTagName('img'));
  const promises = images.map(img => {
    if (img.complete && img.naturalHeight !== 0) {
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve on error too, to not block forever
    });
  });
  return Promise.all(promises);
};

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Professional PDF Generation Started (v3 - Fixed) ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    // For modern template, use direct PDF generation for best results
    if (templateName === 'modern') {
      console.log('Using direct PDF generation for modern template...');
      return generateDirectPDF(data);
    }

    // For other templates, use html2canvas approach
    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Using html2canvas approach for template:', templateName);

    // Wait for fonts and images to load
    await document.fonts.ready;
    await waitForImages(resumeElement);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create high-quality canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight,
      windowWidth: 1200,
      windowHeight: resumeElement.scrollHeight,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit A4
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = Math.min(pageWidth / (canvasWidth * 0.264583), pageHeight / (canvasHeight * 0.264583));
    
    const imgWidth = canvasWidth * 0.264583 * ratio;
    const imgHeight = canvasHeight * 0.264583 * ratio;
    
    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2;
    const y = 0;

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Handle multi-page content
    let remainingHeight = imgHeight;
    let currentY = y;
    let pageCount = 0;

    while (remainingHeight > 0) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const currentPageHeight = Math.min(remainingHeight, pageHeight);
      const sourceY = pageCount * pageHeight / ratio / 0.264583;
      const sourceHeight = currentPageHeight / ratio / 0.264583;

      // Create a temporary canvas for this page
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sourceHeight;

      if (pageCtx) {
        pageCtx.drawImage(canvas, 0, sourceY, canvasWidth, sourceHeight, 0, 0, canvasWidth, sourceHeight);
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(pageImgData, 'PNG', x, 0, imgWidth, currentPageHeight);
      }

      remainingHeight -= currentPageHeight;
      pageCount++;

      // Safety check to prevent infinite loop
      if (pageCount > 10) {
        console.warn('PDF generation stopped at 10 pages to prevent infinite loop');
        break;
      }
    }

    // Set PDF metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo?.fullName || 'Resume Builder User',
      creator: 'Professional Resume Builder',
      keywords: 'resume, professional, career',
    });

    console.log('=== PDF generation completed successfully (v3) ===');
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