
import jsPDF from 'jspdf';

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

interface PDFPosition {
  x: number;
  y: number;
}

export class DirectPDFGenerator {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private margin: number = 20;
  private lineHeight: number = 6;
  private sectionSpacing: number = 12;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set default font
    this.pdf.setFont('helvetica');
  }

  private checkPageBreak(neededSpace: number = 20): void {
    if (this.currentY + neededSpace > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addText(text: string, x: number, y: number, options: {
    fontSize?: number;
    fontStyle?: 'normal' | 'bold';
    maxWidth?: number;
    align?: 'left' | 'center' | 'right';
  } = {}): number {
    const { fontSize = 10, fontStyle = 'normal', maxWidth = 170, align = 'left' } = options;
    
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontStyle);
    
    if (text.length === 0) return y;
    
    const lines = this.pdf.splitTextToSize(text, maxWidth);
    const textHeight = lines.length * (fontSize * 0.35);
    
    this.checkPageBreak(textHeight + 5);
    
    // Update y position if page was added
    const actualY = this.currentY === this.margin ? this.currentY : y;
    
    lines.forEach((line: string, index: number) => {
      const lineY = actualY + (index * fontSize * 0.35);
      
      if (align === 'center') {
        this.pdf.text(line, this.pdf.internal.pageSize.getWidth() / 2, lineY, { align: 'center' });
      } else if (align === 'right') {
        this.pdf.text(line, x + maxWidth, lineY, { align: 'right' });
      } else {
        this.pdf.text(line, x, lineY);
      }
    });
    
    return actualY + textHeight;
  }

  private addSection(title: string): void {
    this.checkPageBreak(15);
    
    // Add some space before section
    this.currentY += this.sectionSpacing;
    
    // Section header with blue accent
    this.pdf.setFillColor(37, 99, 235); // Blue color
    this.pdf.rect(this.margin, this.currentY - 2, 3, 8, 'F');
    
    this.currentY = this.addText(title, this.margin + 8, this.currentY + 4, {
      fontSize: 14,
      fontStyle: 'bold'
    });
    
    this.currentY += 8;
  }

  private renderHeader(data: ResumeData): void {
    // Name
    this.currentY = this.addText(data.personalInfo.fullName, 0, this.currentY + 10, {
      fontSize: 24,
      fontStyle: 'bold',
      align: 'center',
      maxWidth: 170
    });
    
    this.currentY += 8;
    
    // Contact info in a single line
    const contactInfo = [];
    if (data.personalInfo.email) contactInfo.push(data.personalInfo.email);
    if (data.personalInfo.phone) contactInfo.push(data.personalInfo.phone);
    if (data.personalInfo.location) contactInfo.push(data.personalInfo.location);
    if (data.personalInfo.linkedIn) contactInfo.push(data.personalInfo.linkedIn);
    if (data.personalInfo.portfolio) contactInfo.push(data.personalInfo.portfolio);
    
    if (contactInfo.length > 0) {
      this.currentY = this.addText(contactInfo.join(' • '), 0, this.currentY, {
        fontSize: 10,
        align: 'center',
        maxWidth: 170
      });
    }
    
    // Add line under header
    this.currentY += 5;
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.currentY, 190, this.currentY);
    this.currentY += 5;
  }

  private renderSummary(data: ResumeData): void {
    if (!data.personalInfo.summary) return;
    
    this.addSection('Professional Summary');
    this.currentY = this.addText(data.personalInfo.summary, this.margin + 5, this.currentY, {
      fontSize: 10,
      maxWidth: 165
    });
  }

  private renderExperience(data: ResumeData): void {
    if (!data.experience || data.experience.length === 0) return;
    
    this.addSection('Professional Experience');
    
    data.experience.forEach((exp, index) => {
      this.checkPageBreak(25);
      
      // Job title and company
      this.currentY = this.addText(exp.jobTitle, this.margin + 5, this.currentY, {
        fontSize: 12,
        fontStyle: 'bold',
        maxWidth: 120
      });
      
      // Date range (right aligned)
      const dateRange = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate || ''}`;
      this.addText(dateRange, 0, this.currentY - 4, {
        fontSize: 10,
        align: 'right',
        maxWidth: 165
      });
      
      this.currentY = this.addText(exp.company, this.margin + 5, this.currentY + 2, {
        fontSize: 11,
        maxWidth: 165
      });
      
      this.currentY += 3;
      
      // Description
      if (exp.description) {
        this.currentY = this.addText(exp.description, this.margin + 5, this.currentY, {
          fontSize: 10,
          maxWidth: 165
        });
      }
      
      if (index < data.experience.length - 1) {
        this.currentY += 8;
      }
    });
  }

  private renderSkills(data: ResumeData): void {
    if (!data.skills || data.skills.length === 0) return;
    
    this.addSection('Core Competencies');
    
    const skillsText = data.skills.join(' • ');
    this.currentY = this.addText(skillsText, this.margin + 5, this.currentY, {
      fontSize: 10,
      maxWidth: 165
    });
  }

  private renderProjects(data: ResumeData): void {
    if (!data.projects || data.projects.length === 0) return;
    
    this.addSection('Key Projects');
    
    data.projects.forEach((project, index) => {
      this.checkPageBreak(20);
      
      // Project name
      this.currentY = this.addText(project.name, this.margin + 5, this.currentY, {
        fontSize: 12,
        fontStyle: 'bold',
        maxWidth: 165
      });
      
      this.currentY += 2;
      
      // Description
      if (project.description) {
        this.currentY = this.addText(project.description, this.margin + 5, this.currentY, {
          fontSize: 10,
          maxWidth: 165
        });
      }
      
      // Technologies
      if (project.technologies) {
        this.currentY += 2;
        this.currentY = this.addText(`Technologies: ${project.technologies}`, this.margin + 5, this.currentY, {
          fontSize: 9,
          maxWidth: 165
        });
      }
      
      if (index < data.projects.length - 1) {
        this.currentY += 8;
      }
    });
  }

  private renderEducation(data: ResumeData): void {
    if (!data.education || data.education.length === 0) return;
    
    this.addSection('Education');
    
    data.education.forEach((edu, index) => {
      this.checkPageBreak(15);
      
      // Degree
      this.currentY = this.addText(edu.degree, this.margin + 5, this.currentY, {
        fontSize: 12,
        fontStyle: 'bold',
        maxWidth: 120
      });
      
      // Graduation date (right aligned)
      this.addText(edu.graduationDate, 0, this.currentY - 4, {
        fontSize: 10,
        align: 'right',
        maxWidth: 165
      });
      
      // School
      this.currentY = this.addText(edu.school, this.margin + 5, this.currentY + 2, {
        fontSize: 11,
        maxWidth: 165
      });
      
      // GPA if available
      if (edu.gpa) {
        this.currentY += 2;
        this.currentY = this.addText(`GPA: ${edu.gpa}`, this.margin + 5, this.currentY, {
          fontSize: 10,
          maxWidth: 165
        });
      }
      
      if (index < data.education.length - 1) {
        this.currentY += 8;
      }
    });
  }

  public generatePDF(data: ResumeData, sectionOrder: string[] = ['summary', 'experience', 'skills', 'projects', 'education']): jsPDF {
    console.log('=== Starting Direct PDF Generation ===');
    
    // Render header
    this.renderHeader(data);
    
    // Render sections in specified order
    sectionOrder.forEach(section => {
      switch (section) {
        case 'summary':
          this.renderSummary(data);
          break;
        case 'experience':
          this.renderExperience(data);
          break;
        case 'skills':
          this.renderSkills(data);
          break;
        case 'projects':
          this.renderProjects(data);
          break;
        case 'education':
          this.renderEducation(data);
          break;
      }
    });
    
    // Set PDF metadata
    this.pdf.setProperties({
      title: `${data.personalInfo.fullName} - Professional Resume`,
      subject: 'Professional Resume',
      author: data.personalInfo.fullName,
      creator: 'Professional Resume Builder'
    });
    
    console.log('=== Direct PDF Generation Complete ===');
    return this.pdf;
  }
}

export const generateDirectPDF = (data: ResumeData, sectionOrder?: string[]): jsPDF => {
  const generator = new DirectPDFGenerator();
  return generator.generatePDF(data, sectionOrder);
};
