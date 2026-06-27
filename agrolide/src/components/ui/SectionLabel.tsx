import React, { HTMLAttributes } from 'react';

export interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function SectionLabel({ children, className = '', ...props }: SectionLabelProps) {
  return (
    <span className={`section-label ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
