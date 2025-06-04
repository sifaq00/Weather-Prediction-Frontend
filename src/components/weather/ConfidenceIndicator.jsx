import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../lib/utils';

const getConfidenceColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 40) return 'text-orange-600';
    return 'text-red-600';
};

const getConfidenceLabel = (value) => {
    if (value >= 80) return 'High Confidence';
    if (value >= 60) return 'Moderate Confidence';
    if (value >= 40) return 'Low Confidence';
    return 'Very Low Confidence';
};

export function ConfidenceIndicator({
    value,
    showLabel = true,
    showProgress = true,
    className,
    ...props
}) {
    const color = getConfidenceColor(value);
    const label = getConfidenceLabel(value);

    return (
        <div className={cn('space-y-2', className)} {...props}>
            {showLabel && (
                <div className="flex items-center justify-between">
                    <span className={cn('text-sm font-medium', color)}>
                        {label}
                    </span>
                    <span className={cn('text-sm font-semibold', color)}>
                        {value}%
                    </span>
                </div>
            )}
            {showProgress && (
                <ProgressBar
                    value={value}
                    variant={value >= 80 ? 'success' : value >= 60 ? 'warning' : value >= 40 ? 'warning' : 'error'}
                    size="sm"
                />
            )}
        </div>
    );
} 