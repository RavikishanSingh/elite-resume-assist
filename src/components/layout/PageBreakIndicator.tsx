
const PageBreakIndicator = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Page 1 boundary - positioned before Key Projects section */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 bg-red-50"
        style={{ 
          top: '240mm', // Positioned to ensure Key Projects starts on page 2
          height: '2px'
        }}
      >
        <div className="absolute right-2 -top-6 bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-800">
          Page 1 End - Key Projects starts Page 2
        </div>
      </div>
      
      {/* Page 2 boundary */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 bg-red-50"
        style={{ 
          top: '537mm', // Page 2 end (297mm + 240mm)
          height: '2px'
        }}
      >
        <div className="absolute right-2 -top-6 bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-800">
          Page 2 End
        </div>
      </div>

      {/* Page 3 boundary for longer resumes */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 bg-red-50"
        style={{ 
          top: '834mm', // Page 3 end (297mm + 297mm + 240mm)
          height: '2px'
        }}
      >
        <div className="absolute right-2 -top-6 bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-800">
          Page 3 End
        </div>
      </div>

      {/* Page indicators */}
      <div className="absolute left-2 top-2 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-800">
        Page 1
      </div>
      <div 
        className="absolute left-2 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-800"
        style={{ top: '250mm' }}
      >
        Page 2 - Key Projects Start Here
      </div>
      <div 
        className="absolute left-2 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-800"
        style={{ top: '547mm' }}
      >
        Page 3
      </div>
    </div>
  );
};

export default PageBreakIndicator;
