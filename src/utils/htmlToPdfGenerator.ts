
import jsPDF from 'jspdf';
import { generateDirectPDF } from './directPdfGenerator';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== Professional PDF Generation Started ===');
  console.log('Template:', templateName);

  try {
    if (!data || !data.personalInfo?.fullName) {
      throw new Error('Please fill in at least your name before downloading');
    }

    // For better results, try direct PDF generation first for compatible templates
    if (templateName === 'modern') {
      console.log('Using direct PDF generation for modern template...');
      return generateDirectPDF(data);
    }

    // Fallback to the improved html2canvas-based method for other templates
    const resumeElement = document.getElementById('resume-preview') || document.getElementById('layout-preview');
    if (!resumeElement) {
      throw new Error('Resume preview not found');
    }

    console.log('Preparing resume for PDF generation via pdf.html() with smart auto-paging...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // We operate on a clone to avoid affecting the live view and to apply print-friendly styles.
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
    document.body.appendChild(clonedElement);

    // Ensure clone has explicit dimensions for rendering.
    clonedElement.style.width = '210mm';
    clonedElement.style.height = 'auto'; // Let height be determined by content
    clonedElement.style.position = 'absolute';
    clonedElement.style.top = '-9999px';
    clonedElement.style.left = '0';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0'; // Padding is inside the template component
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.transform = 'none';

    // Wait for fonts and images to load before capturing
    await new Promise(resolve => setTimeout(resolve, 1500));

    await pdf.html(clonedElement, {
      margin: 0,
      autoPaging: 'text', // Key for smart page breaks. It respects `page-break-inside: avoid`.
      html2canvas: {
        scale: 2, // High resolution for crisp text and images
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // Ensure it renders the full content, not just the visible part
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight,
      },
      width: 210, // A4 width in mm
      windowWidth: 800, // A reasonable CSS pixel width for rendering (A4 at 96dpi is ~794px)
    });

    // Clean up the cloned element from the DOM
    if (document.body.contains(clonedElement)) {
      document.body.removeChild(clonedElement);
    }
    
    // The pdf object is mutated by pdf.html() and is now complete.

    // Set PDF metadata
    pdf.setProperties({
      title: `${data.personalInfo?.fullName || 'Resume'} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo?.fullName || 'Resume Builder User',
      creator: 'Professional Resume Builder',
      keywords: 'resume, professional, career',
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
