import React from 'react';
import {
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    Sun,
    CloudFog,
    Wind,
    CloudDrizzle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const weatherIcons = {
    clear: Sun,
    partly_cloudy: Cloud,
    cloudy: Cloud,
    rain: CloudRain,
    drizzle: CloudDrizzle,
    snow: CloudSnow,
    thunderstorm: CloudLightning,
    fog: CloudFog,
    wind: Wind,
};

const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
};

export function WeatherIcon({
    condition,
    size = 'md',
    className,
    ...props
}) {
    const Icon = weatherIcons[condition] || Sun;

    return (
        <Icon
            className={cn(
                'text-sky-500',
                sizes[size],
                className
            )}
            {...props}
        />
    );
} 