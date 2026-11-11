import React, { HTMLAttributes } from 'react';

export interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function SectionLabel({ children, className = '', ...props }: SectionLabelProps) {
  return (
    <span className={`mb-2.5 block font-urbanist text-label-sm font-bold uppercase tracking-[0.1em] text-primary ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
