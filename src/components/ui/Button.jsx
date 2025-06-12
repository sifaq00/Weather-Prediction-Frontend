import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-sky-500 text-sky-500 hover:bg-sky-50',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading = false,
    disabled = false,
    ...props
}) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
} 