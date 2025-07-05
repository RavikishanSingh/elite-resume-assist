import React from 'react';

const ResumePreview = () => {
  return (
    <div className="preview-container">
      <div className="flex items-center justify-center p-4">
        <button 
          onClick={() => {
            const { generatePDF } = require('../utils/html2pdfGenerator');
            generatePDF();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ResumePreview;