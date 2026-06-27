import React, { HTMLAttributes } from 'react';

export type BadgeVariant = 'junior' | 'professionnel' | 'partenaire' | 'senior' | 'actif' | 'expire' | 'nouveau' | 'category';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant, className = '', children, ...props }: BadgeProps) {
  const baseClass = `badge-base badge-${variant}`;
  return (
    <span className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
