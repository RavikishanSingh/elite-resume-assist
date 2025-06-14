
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDFFromHTML = async (data: any, templateName: string = 'modern') => {
  console.log('=== HTML-to-PDF Generation Started ===');
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

    console.log('Capturing resume preview...');

    // Configure html2canvas for high quality output
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123
    });

    console.log('Canvas created, generating PDF...');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Calculate aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let imgWidth = pdfWidth;
    let imgHeight = pdfHeight;

    // Adjust dimensions to maintain aspect ratio
    if (canvasAspectRatio > pdfAspectRatio) {
      imgHeight = pdfWidth / canvasAspectRatio;
    } else {
      imgWidth = pdfHeight * canvasAspectRatio;
    }

    // Center the image on the page
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    console.log('PDF generation completed successfully');
    return pdf;

  } catch (error) {
    console.error('HTML-to-PDF generation error:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
};
