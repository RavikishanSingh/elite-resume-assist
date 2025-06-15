
const PageBreakIndicator = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Page 1 boundary */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 bg-red-50"
        style={{ 
          top: 'calc(297mm * 0.6)', // A4 height scaled down
          height: '2px'
        }}
      >
        <div className="absolute right-2 -top-6 bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-800">
          Page 1 End
        </div>
      </div>
      
      {/* Page 2 boundary */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 bg-red-50"
        style={{ 
          top: 'calc(297mm * 0.6 * 2)', // Two A4 pages scaled down
          height: '2px'
        }}
      >
        <div className="absolute right-2 -top-6 bg-red-100 px-2 py-1 rounded text-xs font-medium text-red-800">
          Page 2 End
        </div>
      </div>

      {/* Page indicators */}
      <div className="absolute left-2 top-2 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-800">
        Page 1
      </div>
      <div 
        className="absolute left-2 bg-blue-100 px-2 py-1 rounded text-xs font-medium text-blue-800"
        style={{ top: 'calc(297mm * 0.6 + 10px)' }}
      >
        Page 2
      </div>
    </div>
  );
};

export default PageBreakIndicator;
