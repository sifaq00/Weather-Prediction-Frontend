import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
    primary: 'bg-sky-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
};

const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

export function ProgressBar({
    value,
    max = 100,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    className,
    ...props
}) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className="w-full" {...props}>
            <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
                <div
                    className={cn(
                        'transition-all duration-300 ease-in-out',
                        variants[variant],
                        sizes[size]
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-sm text-gray-600">
                    {percentage.toFixed(0)}%
                </div>
            )}
        </div>
    );
} 