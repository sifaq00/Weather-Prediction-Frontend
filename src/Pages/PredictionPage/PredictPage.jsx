import React, { useState } from 'react';
import { LocationPicker } from '../../components/location/LocationPicker';
import { LocationDisplay } from '../../components/location/LocationDisplay';
import { WeatherCard } from '../../components/weather/WeatherCard';
import { ConfidenceIndicator } from '../../components/weather/ConfidenceIndicator';
import { useLocationHistory } from '../../hooks/useLocationHistory';
import { Toast, ToastContainer } from '../../components/ui/Toast';

export function PredictPage() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToHistory } = useLocationHistory();

    const fetchWeatherData = async (location) => {
        try {
            // Using Open-Meteo API (free, no API key required)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,wind_speed_10m,wind_direction_10m,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,is_day,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            const current = data.current;
            const daily = data.daily;

            // Map WMO Weather codes to our conditions
            const weatherCodeMap = {
                0: 'clear', // Clear sky
                1: 'clear', // Mainly clear
                2: 'partly_cloudy', // Partly cloudy
                3: 'cloudy', // Overcast
                45: 'fog', // Fog
                48: 'fog', // Depositing rime fog
                51: 'drizzle', // Light drizzle
                53: 'drizzle', // Moderate drizzle
                55: 'drizzle', // Dense drizzle
                61: 'rain', // Slight rain
                63: 'rain', // Moderate rain
                65: 'rain', // Heavy rain
                71: 'snow', // Slight snow
                73: 'snow', // Moderate snow
                75: 'snow', // Heavy snow
                77: 'snow', // Snow grains
                80: 'rain', // Slight rain showers
                81: 'rain', // Moderate rain showers
                82: 'rain', // Violent rain showers
                85: 'snow', // Slight snow showers
                86: 'snow', // Heavy snow showers
                95: 'thunderstorm', // Thunderstorm
                96: 'thunderstorm', // Thunderstorm with slight hail
                99: 'thunderstorm', // Thunderstorm with heavy hail
            };

            // Calculate confidence based on various factors
            const calculateConfidence = () => {
                let confidence = 85; // Base confidence

                // Adjust confidence based on forecast accuracy
                if (current.precipitation_probability > 80) { // High probability of precipitation
                    confidence -= 10;
                }
                if (current.wind_speed_10m > 20) { // High wind speeds
                    confidence -= 5;
                }
                if (Math.abs(daily.temperature_2m_max[0] - daily.temperature_2m_min[0]) > 10) { // Large temperature variation
                    confidence -= 5;
                }

                return Math.max(40, Math.min(95, confidence)); // Keep confidence between 40-95%
            };

            return {
                temperature: Math.round(current.temperature_2m),
                condition: weatherCodeMap[current.weather_code] || 'clear',
                humidity: current.relative_humidity_2m,
                windSpeed: Math.round(current.wind_speed_10m * 3.6), // Convert m/s to km/h
                confidence: calculateConfidence(),
                description: getWeatherDescription(current.weather_code),
                feelsLike: Math.round(current.apparent_temperature),
                pressure: Math.round(current.pressure_msl),
                visibility: current.visibility / 1000, // Convert to km
                precipitation: current.precipitation,
                cloudCover: current.cloud_cover,
                uvIndex: current.is_day ? 5 : 0, // Simplified UV index
            };
        } catch (err) {
            console.error('Error fetching weather data:', err);
            throw err;
        }
    };

    const getWeatherDescription = (code) => {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Light rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Light snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
        };
        return descriptions[code] || 'Unknown';
    };

    const handleLocationSelect = async (location) => {
        setSelectedLocation(location);
        addToHistory(location);
        setIsLoading(true);
        setError(null);

        try {
            const weatherData = await fetchWeatherData(location);
            setPrediction(weatherData);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Weather Prediction</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <LocationPicker
                        onLocationSelect={handleLocationSelect}
                        className="mb-8"
                    />

                    {selectedLocation && (
                        <LocationDisplay
                            location={selectedLocation}
                            className="mb-8"
                        />
                    )}
                </div>

                <div>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
                        </div>
                    ) : prediction ? (
                        <div className="space-y-6">
                            <WeatherCard
                                location={selectedLocation.name}
                                temperature={prediction.temperature}
                                condition={prediction.condition}
                                humidity={prediction.humidity}
                                windSpeed={prediction.windSpeed}
                                confidence={prediction.confidence}
                                feelsLike={prediction.feelsLike}
                                pressure={prediction.pressure}
                                visibility={prediction.visibility}
                                uvIndex={prediction.uvIndex}
                            />

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Prediction Confidence</h2>
                                <ConfidenceIndicator
                                    value={prediction.confidence}
                                    showLabel
                                    showProgress
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-16">
                            <p>Select a location to get weather predictions</p>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer>
                {error && (
                    <Toast
                        message={error}
                        variant="error"
                        onClose={() => setError(null)}
                    />
                )}
            </ToastContainer>
        </div>
    );
} 