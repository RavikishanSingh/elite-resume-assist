import React from 'react';

interface NoBreakSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const NoBreakSection: React.FC<NoBreakSectionProps> = ({ 
  children, 
  className = '', 
  id 
}) => {
  return (
    <div 
      className={`no-break avoid-break ${className}`}
      id={id}
      style={{
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}
    >
      {children}
    </div>
  );
};

export const PageBreak: React.FC = () => {
  return (
    <div 
      className="page-break"
      style={{
        pageBreakBefore: 'always',
        breakBefore: 'always'
      }}
    />
  );
};

export default NoBreakSection;