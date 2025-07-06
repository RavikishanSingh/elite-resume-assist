import html2pdf from 'html2pdf.js';

export const generatePDF = async () => {
  const element = document.getElementById('resume-content');
  if (!element) {
    console.error('Resume content element not found');
    return;
  }

  // Create loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; color: white; font-family: system-ui;">
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div>Generating perfect PDF...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  // Enhanced PDF generation options for perfect quality
  const opt = {
    margin: [5, 5, 5, 5], // Small margins in mm
    filename: `Resume_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 1.0, // Maximum quality
      width: 2480,  // High resolution width (A4 at 300 DPI)
      height: 3508  // High resolution height (A4 at 300 DPI)
    },
    html2canvas: { 
      scale: 4,        // Higher scale for crisp text
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      removeContainer: false,
      width: 2480,     // Match image dimensions
      height: 3508,
      dpi: 300,        // High DPI for print quality
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // Apply print-specific styles to cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1.5 !important;
          }
          .resume-wrapper {
            font-size: 14px !important;
            line-height: 1.6 !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid !important;
            margin-bottom: 0.5em !important;
          }
          p, li {
            margin-bottom: 0.3em !important;
          }
          .no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true,
      precision: 2
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break',
      after: '.page-break-after',
      avoid: ['.no-break', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    }
  };

  try {
    console.log('Starting PDF generation with enhanced settings...');
    await html2pdf().set(opt).from(element).save();
    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('PDF generation failed. Please try again.');
  } finally {
    // Remove loading indicator
    document.body.removeChild(loadingDiv);
  }
};