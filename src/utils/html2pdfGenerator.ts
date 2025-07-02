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
        margin: [20, 15, 20, 15], // top, right, bottom, left in mm
        filename: `${data.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          removeContainer: true,
          foreignObjectRendering: true
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
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      .no-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .page-break {
        page-break-before: always !important;
      }

      .page-break-after {
        page-break-after: always !important;
      }

      .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Prevent orphaned headers */
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      /* Keep job entries together */
      .experience-item,
      .education-item,
      .project-item {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 1rem !important;
      }

      /* Ensure proper spacing */
      section {
        margin-bottom: 1.5rem !important;
      }

      /* Hide screen-only elements */
      .screen-only {
        display: none !important;
      }

      /* Show PDF-only elements */
      .pdf-only {
        display: block !important;
      }
    }

    @media screen {
      .pdf-only {
        display: none !important;
      }
    }
  `;
  
  document.head.appendChild(style);
};