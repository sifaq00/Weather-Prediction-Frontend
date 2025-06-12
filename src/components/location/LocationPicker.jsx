import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LocationSearch } from './LocationSearch';
import { getCurrentLocation } from '../../lib/locationUtils';
import { cn } from '../../lib/utils';
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

function MapEvents({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e);
        },
    });
    return null;
}

export function LocationPicker({
    onLocationSelect,
    initialLocation,
    className,
    ...props
}) {
    const [selectedLocation, setSelectedLocation] = useState(
        initialLocation || {
            lat: -6.2088,
            lng: 106.8456,
            name: 'Jakarta, Indonesia'
        }
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!initialLocation) {
            getCurrentLocation()
                .then((location) => {
                    setSelectedLocation(location);
                })
                .catch((err) => {
                    setError('Failed to get current location');
                    console.error(err);
                });
        }
    }, [initialLocation]);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        onLocationSelect?.(location);
    };

    const handleMapClick = async (e) => {
        try {
            // Fetch location name using reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
            );
            const data = await response.json();

            const newLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                name: data.display_name || `Location at ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`
            };
            setSelectedLocation(newLocation);
            onLocationSelect?.(newLocation);
        } catch (err) {
            console.error('Error fetching location name:', err);
            const newLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                name: `Location at ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`
            };
            setSelectedLocation(newLocation);
            onLocationSelect?.(newLocation);
        }
    };

    return (
        <div className={cn('space-y-4', className)} {...props}>
            <LocationSearch
                onLocationSelect={handleLocationSelect}
                className="w-full"
            />

            <div className="relative h-[400px] rounded-lg overflow-hidden border border-gray-200">
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
                    </div>
                )}

                <MapContainer
                    center={[selectedLocation.lat, selectedLocation.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                        position={[selectedLocation.lat, selectedLocation.lng]}
                        icon={icon}
                    />
                    <MapEvents onMapClick={handleMapClick} />
                </MapContainer>
            </div>

            <div className="text-sm text-gray-500">
                <p>Click on the map or search for a location to select it.</p>
                <p>Selected location: {selectedLocation.name}</p>
            </div>
        </div>
    );
} 