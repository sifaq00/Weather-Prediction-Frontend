import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-gray-200',
                className
            )}
            {...props}
        />
    );
}

export function SkeletonText({
    className,
    lines = 3,
    ...props
}) {
    return (
        <div className="space-y-2" {...props}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-3/4' : 'w-full',
                        className
                    )}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                'p-4 rounded-lg border border-gray-200',
                className
            )}
            {...props}
        >
            <Skeleton className="h-4 w-1/3 mb-4" />
            <SkeletonText lines={3} />
        </div>
    );
} 