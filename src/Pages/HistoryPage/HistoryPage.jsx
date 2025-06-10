import React, { useState } from 'react';
import { LocationHistory } from '../../components/location/LocationHistory';
import { LocationDisplay } from '../../components/location/LocationDisplay';
import { useLocationHistory } from '../../hooks/useLocationHistory';
import { useNavigate } from 'react-router-dom';

export function HistoryPage() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const {
        history,
        favorites,
        clearHistory,
        toggleFavorite,
        removeFromHistory,
    } = useLocationHistory();
    const navigate = useNavigate();

    const handleLocationSelect = (location) => {
        navigate('/predict', { state: { location } });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Location History</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <LocationHistory
                            history={history}
                            favorites={favorites}
                            onLocationSelect={handleLocationSelect}
                            onClearHistory={clearHistory}
                            onToggleFavorite={toggleFavorite}
                            onRemoveFromHistory={removeFromHistory}
                        />
                    </div>
                </div>

                <div>
                    {selectedLocation ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <LocationDisplay
                                location={selectedLocation}
                                showMap={false}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                            <p>Select a location to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 