import React, { HTMLAttributes } from 'react';

export type CardVariant = 'standard' | 'dark' | 'feature' | 'membre' | 'blog';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export function Card({ variant = 'standard', className = '', children, ...props }: CardProps) {
  let baseClass = 'card';
  if (variant === 'dark') baseClass = 'card-dark';
  if (variant === 'feature') baseClass = 'card-feature';
  if (variant === 'membre') baseClass = 'card-membre';
  if (variant === 'blog') baseClass = 'card-blog';

  return (
    <div className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
