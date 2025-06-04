import React from 'react';
import { Clock, Star, Trash2, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const WeatherPopup = ({ location, timestamp }) => {
    const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

    return (
        <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 mb-2">{location.name}</h3>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Last updated {timeAgo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Thermometer className="h-4 w-4" />
                    <span>Temperature: {Math.floor(Math.random() * 30) + 10}°C</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Droplets className="h-4 w-4" />
                    <span>Humidity: {Math.floor(Math.random() * 50) + 30}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wind className="h-4 w-4" />
                    <span>Wind: {Math.floor(Math.random() * 20) + 5} km/h</span>
                </div>
            </div>
        </div>
    );
};

export function LocationHistory({
    history,
    favorites,
    onLocationSelect,
    onClearHistory,
    onToggleFavorite,
    onRemoveFavorite,
    onRemoveFromHistory,
    className,
    ...props
}) {
    const renderLocationItem = (location, isFavorite = false) => {
        const timestamp = new Date(location.timestamp);
        const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

        return (
            <div
                key={`${location.lat}-${location.lng}`}
                className="flex flex-col gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <button
                            onClick={() => onLocationSelect(location)}
                            className="text-left w-full"
                        >
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                {location.name || 'Unnamed Location'}
                            </h4>
                            <p className="text-xs text-gray-500">
                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </p>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {timeAgo}
                        </span>
                        <button
                            onClick={() => onToggleFavorite(location)}
                            className={cn(
                                'p-1 rounded-full hover:bg-gray-100 transition-colors',
                                isFavorite ? 'text-yellow-400' : 'text-gray-400'
                            )}
                        >
                            <Star className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onRemoveFromHistory(location)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="h-[150px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                        center={[location.lat, location.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={[location.lat, location.lng]}
                            icon={icon}
                        >
                            <Popup>
                                <WeatherPopup location={location} timestamp={location.timestamp} />
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        );
    };

    return (
        <div className={cn('space-y-6', className)} {...props}>
            {favorites.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Favorite Locations
                    </h3>
                    <div className="space-y-4">
                        {favorites.map((location) =>
                            renderLocationItem(location, true)
                        )}
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">
                            Recent Locations
                        </h3>
                        <button
                            onClick={onClearHistory}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Clear All History
                        </button>
                    </div>
                    <div className="space-y-4">
                        {history.map((location) =>
                            renderLocationItem(location)
                        )}
                    </div>
                </div>
            )}

            {history.length === 0 && favorites.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No locations in history or favorites yet.</p>
                    <p className="text-sm mt-1">
                        Search for a location or click on the map to add one.
                    </p>
                </div>
            )}
        </div>
    );
} 