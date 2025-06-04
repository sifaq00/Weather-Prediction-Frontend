import React from 'react';
import { cn } from '../../lib/utils';

export function Input({
    className,
    type = 'text',
    error,
    label,
    helperText,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400',
                    className
                )}
                {...props}
            />
            {(error || helperText) && (
                <p
                    className={cn(
                        'mt-1 text-sm',
                        error ? 'text-red-500' : 'text-gray-500'
                    )}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
} 