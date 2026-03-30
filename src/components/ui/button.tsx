import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'hero' | 'hero-outline' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:       'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  hero:          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98]',
  'hero-outline':'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]',
  outline:       'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
  ghost:         'hover:bg-accent hover:text-accent-foreground',
  secondary:     'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:   'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link:          'text-primary underline-offset-4 hover:underline',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm:      'h-8 px-3 text-xs rounded-md',
  lg:      'h-11 px-6 text-base',
  xl:      'h-12 px-8 text-base rounded-xl',
  icon:    'h-9 w-9',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
