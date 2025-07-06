import html2pdf from 'html2pdf.js';

export const generatePDF = async () => {
  const element = document.getElementById('resume-content');
  if (!element) {
    console.error('Resume content element not found');
    return;
  }

  // Add temporary styles for PDF generation
  const tempStyle = document.createElement('style');
  tempStyle.textContent = `
    #resume-content {
      background: white !important;
      color: black !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
    }
    #resume-content * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
  `;
  document.head.appendChild(tempStyle);

  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'resume.pdf',
    image: { 
      type: 'jpeg', 
      quality: 0.98,
      width: 794,
      height: 1123
    },
    html2canvas: { 
      scale: 3,
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      removeContainer: true,
      width: 794,
      height: 1123,
      dpi: 300,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break',
      after: '.page-break-after',
      avoid: '.no-break'
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
  } finally {
    // Remove temporary styles
    document.head.removeChild(tempStyle);
  }
};