
import html2canvas from 'html2canvas';

export const generatePDF = async (data: any, templateName: string = 'modern') => {
  try {
    const { default: jsPDF } = await import('jspdf');
    
    // Try to capture the resume preview element
    const resumeElement = document.getElementById('resume-preview');
    if (resumeElement) {
      // Use html2canvas to capture the styled resume
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const pageWidth = 595;
      const pageHeight = 842;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      return pdf;
    } else {
      // Fallback to text-based PDF if canvas capture fails
      return generateTextPDF(data);
    }
  } catch (error) {
    console.error('Error generating PDF with template:', error);
    // Fallback to text-based PDF
    return generateTextPDF(data);
  }
};

const generateTextPDF = async (data: any) => {
  const { default: jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const lineHeight = 14;
  let yPos = margin;

  // Helper to add text with automatic page breaks
  const addText = (text: string, x: number, fontSize: number = 12, fontWeight: string = 'normal', maxWidth?: number) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontWeight);
    
    if (maxWidth && text) {
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (yPos + (lines.length * lineHeight) > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.text(lines, x, yPos);
      yPos += lines.length * lineHeight + 5;
    } else if (text) {
      if (yPos + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.text(text, x, yPos);
      yPos += lineHeight + 5;
    }
    
    return yPos;
  };

  const addSection = (title: string) => {
    yPos += 10;
    if (yPos + 30 > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }
    
    // Section line
    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;
    
    addText(title, margin, 14, 'bold');
    yPos += 10;
  };

  // Header
  if (data.personalInfo?.fullName) {
    addText(data.personalInfo.fullName, margin, 20, 'bold');
    yPos += 5;
  }

  // Contact info
  const contactInfo = [];
  if (data.personalInfo?.email) contactInfo.push(data.personalInfo.email);
  if (data.personalInfo?.phone) contactInfo.push(data.personalInfo.phone);
  if (data.personalInfo?.location) contactInfo.push(data.personalInfo.location);
  
  if (contactInfo.length > 0) {
    addText(contactInfo.join(' | '), margin, 10);
  }

  // Links
  const links = [];
  if (data.personalInfo?.linkedIn) links.push(data.personalInfo.linkedIn);
  if (data.personalInfo?.portfolio) links.push(data.personalInfo.portfolio);
  
  if (links.length > 0) {
    addText(links.join(' | '), margin, 10);
  }

  // Summary
  if (data.personalInfo?.summary) {
    addSection('SUMMARY');
    addText(data.personalInfo.summary, margin, 11, 'normal', pageWidth - 2 * margin);
  }

  // Experience
  if (data.experience?.length > 0) {
    addSection('EXPERIENCE');
    
    data.experience.forEach((exp: any) => {
      if (exp.jobTitle || exp.company) {
        // Job title and company
        const jobLine = `${exp.jobTitle || ''}${exp.jobTitle && exp.company ? ' at ' : ''}${exp.company || ''}`;
        addText(jobLine, margin, 12, 'bold');
        
        // Dates
        const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
        if (dateRange.trim() !== ' - ') {
          addText(dateRange, margin, 10, 'italic');
        }
        
        // Description
        if (exp.description) {
          addText(exp.description, margin, 10, 'normal', pageWidth - 2 * margin);
        }
        
        yPos += 10;
      }
    });
  }

  // Projects
  if (data.projects?.length > 0) {
    addSection('PROJECTS');
    
    data.projects.forEach((project: any) => {
      if (project.name) {
        addText(project.name, margin, 12, 'bold');
        
        if (project.description) {
          addText(project.description, margin, 10, 'normal', pageWidth - 2 * margin);
        }
        
        if (project.technologies) {
          addText(`Technologies: ${project.technologies}`, margin, 9, 'italic');
        }
        
        yPos += 10;
      }
    });
  }

  // Education
  if (data.education?.length > 0) {
    addSection('EDUCATION');
    
    data.education.forEach((edu: any) => {
      if (edu.degree || edu.school) {
        const eduLine = `${edu.degree || ''}${edu.degree && edu.school ? ' - ' : ''}${edu.school || ''}`;
        addText(eduLine, margin, 11, 'bold');
        
        if (edu.graduationDate) {
          addText(edu.current ? 'Currently Pursuing' : edu.graduationDate, margin, 10);
        }
        
        yPos += 10;
      }
    });
  }

  // Skills
  if (data.skills?.length > 0) {
    const skillsText = data.skills.filter((skill: string) => skill.trim()).join(', ');
    if (skillsText) {
      addSection('SKILLS');
      addText(skillsText, margin, 10, 'normal', pageWidth - 2 * margin);
    }
  }

  return pdf;
};
