import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../lib/utils';

export function WeatherCard({
    location,
    temperature,
    condition,
    humidity,
    windSpeed,
    confidence,
    feelsLike,
    pressure,
    visibility,
    uvIndex,
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                'p-6 rounded-xl bg-white shadow-lg border border-gray-200',
                'hover:shadow-xl transition-shadow duration-300',
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{location}</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {temperature}°C
                    </p>
                </div>
                <WeatherIcon condition={condition} size="lg" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Feels Like</span>
                    <span>{feelsLike}°C</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Humidity</span>
                    <span>{humidity}%</span>
                </div>
                <ProgressBar value={humidity} variant="primary" size="sm" />

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Wind Speed</span>
                    <span>{windSpeed} km/h</span>
                </div>
                <ProgressBar value={windSpeed} variant="info" size="sm" />

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Pressure</span>
                    <span>{pressure} hPa</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Visibility</span>
                    <span>{visibility} km</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>UV Index</span>
                    <span>{uvIndex}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                    <span>Prediction Confidence</span>
                    <span>{confidence}%</span>
                </div>
                <ProgressBar
                    value={confidence}
                    variant={confidence > 70 ? 'success' : confidence > 40 ? 'warning' : 'error'}
                    size="sm"
                />
            </div>
        </div>
    );
} 