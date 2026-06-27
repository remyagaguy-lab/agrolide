import React from 'react';
import Image from 'next/image';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ src, alt, initials, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = `avatar-${size}`;
  
  return (
    <div className={`avatar ${sizeClass} ${className}`.trim()}>
      {src ? (
        <Image 
          src={src} 
          alt={alt || 'Avatar'} 
          width={80} 
          height={80} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials?.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
