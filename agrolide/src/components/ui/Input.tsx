import React, { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`input ${error ? 'error' : ''} ${className}`.trim()}
          {...props}
        />
        {error && (
          <span className="error-msg">
            <AlertCircle size={14} color="#d32f2f" strokeWidth={1.5} />
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
