import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-gray-900/80 border border-gray-800 rounded-xl shadow-lg ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 border-b border-gray-800 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3 
      className={`text-lg font-semibold text-white ${className || ''}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <p 
      className={`text-sm text-gray-400 ${className || ''}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 border-t border-gray-800 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
} 