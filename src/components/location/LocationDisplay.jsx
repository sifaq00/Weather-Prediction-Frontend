import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '../../lib/utils';
import 'leaflet/dist/leaflet.css';

export function LocationDisplay({
    location,
    className,
    showMap = true,
    showCoordinates = true,
    showNavigation = true,
    ...props
}) {
    if (!location) {
        return (
            <div className={cn('text-gray-500 italic', className)} {...props}>
                No location selected
            </div>
        );
    }

    const { lat, lng, name } = location;
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    return (
        <div className={cn('space-y-4', className)} {...props}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-sky-500" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {name || 'Selected Location'}
                    </h3>
                    {showCoordinates && (
                        <p className="text-sm text-gray-500">
                            {lat.toFixed(6)}, {lng.toFixed(6)}
                        </p>
                    )}
                    {showNavigation && (
                        <a
                            href={navigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-sky-600 hover:text-sky-700"
                        >
                            <Navigation className="h-4 w-4" />
                            Get Directions
                        </a>
                    )}
                </div>
            </div>

            {showMap && (
                <div className="h-[200px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                        center={[lat, lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[lat, lng]} />
                    </MapContainer>
                </div>
            )}
        </div>
    );
} 