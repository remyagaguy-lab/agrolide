import React, { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost-dark' | 'text';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', href, className = '', children, ...props }: ButtonProps) {
  const baseClass = `btn-${variant}`;
  
  if (href) {
    return (
      <Link href={href} className={`${baseClass} ${className}`.trim()}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
