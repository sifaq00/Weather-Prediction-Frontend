import React from 'react';
import { cn } from '../../lib/utils';

const recommendations = {
    clear: [
        { activity: 'Outdoor Activities', icon: '🌞', description: 'Perfect weather for outdoor activities' },
        { activity: 'Beach Visit', icon: '🏖️', description: 'Great day for a beach visit' },
        { activity: 'Hiking', icon: '🥾', description: 'Ideal conditions for hiking' },
    ],
    partly_cloudy: [
        { activity: 'Light Exercise', icon: '🏃', description: 'Good weather for light exercise' },
        { activity: 'Picnic', icon: '🧺', description: 'Nice weather for a picnic' },
        { activity: 'Photography', icon: '📸', description: 'Great lighting for photography' },
    ],
    cloudy: [
        { activity: 'Indoor Activities', icon: '🏠', description: 'Consider indoor activities' },
        { activity: 'Shopping', icon: '🛍️', description: 'Good day for shopping' },
        { activity: 'Museum Visit', icon: '🏛️', description: 'Perfect for museum visits' },
    ],
    rain: [
        { activity: 'Indoor Entertainment', icon: '🎮', description: 'Stay indoors for entertainment' },
        { activity: 'Reading', icon: '📚', description: 'Cozy day for reading' },
        { activity: 'Movie Day', icon: '🎬', description: 'Great day for watching movies' },
    ],
    snow: [
        { activity: 'Winter Sports', icon: '⛷️', description: 'Perfect for winter sports' },
        { activity: 'Snow Play', icon: '☃️', description: 'Great for snow activities' },
        { activity: 'Hot Drinks', icon: '☕', description: 'Stay warm with hot drinks' },
    ],
    thunderstorm: [
        { activity: 'Stay Indoors', icon: '🏠', description: 'Stay indoors for safety' },
        { activity: 'Emergency Kit', icon: '🛠️', description: 'Keep emergency kit ready' },
        { activity: 'Backup Power', icon: '🔋', description: 'Ensure backup power is available' },
    ],
    fog: [
        { activity: 'Indoor Activities', icon: '🏠', description: 'Limited visibility, stay indoors' },
        { activity: 'Caution Driving', icon: '🚗', description: 'Drive with extra caution' },
        { activity: 'Indoor Exercise', icon: '💪', description: 'Good day for indoor exercise' },
    ],
    wind: [
        { activity: 'Secure Items', icon: '🔒', description: 'Secure outdoor items' },
        { activity: 'Indoor Sports', icon: '🏸', description: 'Consider indoor sports' },
        { activity: 'Wind Sports', icon: '🪁', description: 'Great for wind sports if safe' },
    ],
};

export function WeatherRecommendation({
    condition,
    className,
    ...props
}) {
    const conditionRecommendations = recommendations[condition] || recommendations.clear;

    return (
        <div
            className={cn(
                'p-6 rounded-xl bg-white border border-gray-200',
                'shadow-sm hover:shadow-md transition-shadow duration-300',
                className
            )}
            {...props}
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended Activities
            </h3>
            <div className="space-y-4">
                {conditionRecommendations.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                            <h4 className="font-medium text-gray-900">{item.activity}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 