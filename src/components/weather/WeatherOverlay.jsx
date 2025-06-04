import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { cn } from '../../lib/utils';

const TEMPERATURE_COLORS = {
    hot: '#ff4444',
    warm: '#ffbb33',
    mild: '#00C851',
    cool: '#33b5e5',
    cold: '#2BBBAD',
};

const getTemperatureColor = (temp) => {
    if (temp >= 30) return TEMPERATURE_COLORS.hot;
    if (temp >= 25) return TEMPERATURE_COLORS.warm;
    if (temp >= 20) return TEMPERATURE_COLORS.mild;
    if (temp >= 15) return TEMPERATURE_COLORS.cool;
    return TEMPERATURE_COLORS.cold;
};

export function WeatherOverlay({
    weatherData,
    className,
    radius = 5000,
    opacity = 0.6,
    ...props
}) {
    if (!weatherData || !Array.isArray(weatherData)) {
        return null;
    }

    return (
        <div className={cn('absolute inset-0 z-[400]', className)} {...props}>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {weatherData.map((data, index) => (
                    <CircleMarker
                        key={index}
                        center={[data.lat, data.lng]}
                        radius={radius}
                        pathOptions={{
                            fillColor: getTemperatureColor(data.temperature),
                            fillOpacity: opacity,
                            color: 'transparent',
                        }}
                    >
                        <Tooltip
                            permanent
                            direction="center"
                            className="weather-tooltip"
                            opacity={1}
                        >
                            <div className="text-center">
                                <div className="font-semibold">{data.temperature}°C</div>
                                <div className="text-xs">{data.condition}</div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
}

// Add custom styles for the tooltip
const style = document.createElement('style');
style.textContent = `
  .weather-tooltip {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: white !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  .weather-tooltip .leaflet-tooltip-pane {
    display: none;
  }
`;
document.head.appendChild(style); 