
export const generatePDF = async (data: any, templateName: string = 'modern') => {
  console.log('=== Starting Alternative PDF Generation ===');
  console.log('Data received:', data);
  console.log('Template:', templateName);

  try {
    // Dynamic import of jsPDF
    const { default: jsPDF } = await import('jspdf');
    console.log('jsPDF imported successfully');

    // Basic validation
    if (!data || !data.personalInfo?.fullName) {
      console.log('Insufficient data for PDF generation');
      throw new Error('Please fill in at least your name before downloading');
    }

    console.log('Creating PDF document with direct content rendering...');

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 5;
    let currentY = margin;

    // Helper function to add text with proper wrapping
    const addText = (text: string, fontSize: number = 10, fontStyle: string = 'normal', color: string = '#000000') => {
      if (!text || text.trim() === '') return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      
      // Set text color
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      pdf.setTextColor(r, g, b);
      
      const maxWidth = pageWidth - (2 * margin);
      const lines = pdf.splitTextToSize(text.toString(), maxWidth);
      
      // Check if we need a new page
      if (currentY + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      pdf.text(lines, margin, currentY);
      currentY += lines.length * lineHeight;
    };

    const addSection = (title: string, color: string = '#2563eb') => {
      currentY += 8;
      addText(title, 14, 'bold', color);
      currentY += 2;
      
      // Add colored underline
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      pdf.setDrawColor(r, g, b);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;
    };

    // Reset color for main content
    pdf.setTextColor(0, 0, 0);

    // Header with name
    if (data.personalInfo?.fullName) {
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 82, 130); // Professional blue
      pdf.text(data.personalInfo.fullName, margin, currentY);
      currentY += 12;
    }

    // Contact Information
    if (data.personalInfo) {
      const contactInfo = [];
      if (data.personalInfo.email) contactInfo.push(`📧 ${data.personalInfo.email}`);
      if (data.personalInfo.phone) contactInfo.push(`📞 ${data.personalInfo.phone}`);
      if (data.personalInfo.location) contactInfo.push(`📍 ${data.personalInfo.location}`);
      
      if (contactInfo.length > 0) {
        pdf.setTextColor(60, 60, 60);
        addText(contactInfo.join(' | '), 9);
        currentY += 4;
      }
    }

    // Professional Summary
    if (data.personalInfo?.summary) {
      addSection('PROFESSIONAL SUMMARY');
      addText(data.personalInfo.summary, 10);
    }

    // Experience
    if (data.experience?.length > 0) {
      addSection('PROFESSIONAL EXPERIENCE');
      
      data.experience.forEach((exp: any, index: number) => {
        if (exp.jobTitle && exp.company) {
          // Job title and company
          addText(`${exp.jobTitle}`, 12, 'bold', '#1f2937');
          addText(`${exp.company}`, 11, 'normal', '#374151');
          
          // Date range
          if (exp.startDate || exp.endDate) {
            const period = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
            addText(period, 9, 'italic', '#6b7280');
          }
          
          // Description
          if (exp.description) {
            currentY += 2;
            addText(exp.description, 10);
          }
          
          // Add space between experiences
          if (index < data.experience.length - 1) {
            currentY += 6;
          }
        }
      });
    }

    // Education
    if (data.education?.length > 0) {
      addSection('EDUCATION');
      
      data.education.forEach((edu: any, index: number) => {
        if (edu.degree && edu.school) {
          addText(`${edu.degree}`, 11, 'bold', '#1f2937');
          addText(`${edu.school}`, 10, 'normal', '#374151');
          
          if (edu.graduationDate) {
            addText(edu.graduationDate, 9, 'italic', '#6b7280');
          }
          
          if (index < data.education.length - 1) {
            currentY += 4;
          }
        }
      });
    }

    // Skills
    if (data.skills?.length > 0) {
      addSection('TECHNICAL SKILLS');
      const skillsText = Array.isArray(data.skills) ? data.skills.join(' • ') : data.skills;
      addText(`• ${skillsText}`, 10);
    }

    // Projects
    if (data.projects?.length > 0) {
      addSection('PROJECTS');
      
      data.projects.forEach((project: any, index: number) => {
        if (project.name) {
          addText(project.name, 11, 'bold', '#1f2937');
          
          if (project.description) {
            addText(project.description, 10);
          }
          
          if (project.technologies) {
            addText(`Technologies: ${project.technologies}`, 9, 'italic', '#6b7280');
          }
          
          if (project.url) {
            addText(`Link: ${project.url}`, 9, 'normal', '#2563eb');
          }
          
          if (index < data.projects.length - 1) {
            currentY += 4;
          }
        }
      });
    }

    // Footer
    currentY = pageHeight - 15;
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(8);
    pdf.text('Generated with SmartResume AI', margin, currentY);

    console.log('Alternative PDF generated successfully!');
    return pdf;

  } catch (error) {
    console.error('Error in alternative PDF generation:', error);
    throw new Error('Failed to generate PDF: ' + error.message);
  }
};
