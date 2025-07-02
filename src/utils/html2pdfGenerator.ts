import html2pdf from 'html2pdf.js';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    portfolio?: string;
    summary?: string;
  };
  experience?: Array<{
    jobTitle: string;
    company: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    school: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills?: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string;
  }>;
}

export const generatePixelPerfectPDF = async (data: ResumeData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const element = document.getElementById('resume-preview');
      
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.id = 'resume-pdf-clone';
      
      // Add print-specific classes to prevent content splitting
      const sections = clonedElement.querySelectorAll('section, .experience-item, .education-item, .project-item');
      sections.forEach(section => {
        section.classList.add('no-break');
      });

      // Temporarily add to DOM for rendering
      document.body.appendChild(clonedElement);

      const opt = {
        margin: 0, // No margins - handled by CSS
        filename: `${data.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          removeContainer: true,
          foreignObjectRendering: true,
          scrollX: 0,
          scrollY: 0,
          width: clonedElement.scrollWidth,
          height: clonedElement.scrollHeight
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
          precision: 16
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break',
          after: '.page-break-after',
          avoid: ['.no-break', '.avoid-break', '.experience-item', '.education-item', '.project-item']
        }
      };

      html2pdf()
        .set(opt)
        .from(clonedElement)
        .save()
        .then(() => {
          // Clean up cloned element
          document.body.removeChild(clonedElement);
          resolve();
        })
        .catch((error: Error) => {
          // Clean up cloned element on error
          if (document.body.contains(clonedElement)) {
            document.body.removeChild(clonedElement);
          }
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const addPrintStyles = () => {
  // Add print-specific styles if not already present
  const existingStyle = document.getElementById('print-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'print-styles';
  style.textContent = `
    /* Global print styles for pixel-perfect PDF generation */
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      }

      * {
        box-sizing: border-box !important;
      }

      /* Page break prevention */
      .no-break,
      .avoid-break,
      .experience-item,
      .education-item,
      .project-item {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        display: block !important;
      }

      /* Force page breaks */
      .page-break {
        page-break-before: always !important;
        break-before: always !important;
      }

      .page-break-after {
        page-break-after: always !important;
        break-after: always !important;
      }

      /* Prevent orphaned headers */
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Section spacing and layout */
      section {
        margin-bottom: 1.5rem !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Job/Education/Project entries */
      .experience-item,
      .education-item,
      .project-item {
        margin-bottom: 1rem !important;
        padding: 0.5rem 0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Skills and other compact sections */
      .skills-container,
      .competencies-container {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Hide screen-only elements */
      .screen-only {
        display: none !important;
      }

      /* Show PDF-only elements */
      .pdf-only {
        display: block !important;
      }

      /* Ensure proper text rendering */
      * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }

      /* Fix background colors and borders */
      .bg-blue-50 { background-color: #eff6ff !important; }
      .bg-blue-100 { background-color: #dbeafe !important; }
      .text-blue-600 { color: #2563eb !important; }
      .text-blue-800 { color: #1e40af !important; }
      .border-blue-200 { border-color: #bfdbfe !important; }
      .bg-gray-50 { background-color: #f9fafb !important; }
      .text-gray-600 { color: #4b5563 !important; }
      .text-gray-700 { color: #374151 !important; }
      .text-gray-900 { color: #111827 !important; }
    }

    /* Screen styles for preview accuracy */
    @media screen {
      .pdf-only {
        display: none !important;
      }

      /* Preview should match print styles */
      #resume-preview {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        color-adjust: exact;
      }
    }
  `;
  
  document.head.appendChild(style);
};