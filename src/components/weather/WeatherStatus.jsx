import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { cn } from '../../lib/utils';

const weatherDescriptions = {
    clear: 'Clear skies with plenty of sunshine',
    partly_cloudy: 'Partly cloudy with some sunshine',
    cloudy: 'Cloudy skies with limited sunshine',
    rain: 'Rain showers expected',
    drizzle: 'Light drizzle throughout the day',
    snow: 'Snowfall expected',
    thunderstorm: 'Thunderstorms likely',
    fog: 'Foggy conditions with reduced visibility',
    wind: 'Windy conditions expected',
};

export function WeatherStatus({
    condition,
    temperature,
    description,
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                'p-6 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50',
                'border border-sky-100 shadow-sm',
                className
            )}
            {...props}
        >
            <div className="flex items-center space-x-4">
                <div className="animate-pulse">
                    <WeatherIcon condition={condition} size="xl" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {temperature}°C
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {description || weatherDescriptions[condition]}
                    </p>
                </div>
            </div>
        </div>
    );
} 