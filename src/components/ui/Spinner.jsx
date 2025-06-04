import React from 'react';
import { cn } from '../../lib/utils';

const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
};

const colors = {
    primary: 'border-sky-500',
    white: 'border-white',
    gray: 'border-gray-500',
};

export function Spinner({
    size = 'md',
    color = 'primary',
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                sizes[size],
                colors[color],
                className
            )}
            {...props}
        />
    );
} 