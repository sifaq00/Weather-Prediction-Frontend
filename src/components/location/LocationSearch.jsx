import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

export function LocationSearch({
    onLocationSelect,
    className,
    placeholder = 'Search for a location...',
    ...props
}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchTimeout = useRef(null);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Set new timeout for search
        searchTimeout.current = setTimeout(async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        query
                    )}&limit=5`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch location suggestions');
                }

                const data = await response.json();
                setSuggestions(
                    data.map((item) => ({
                        name: item.display_name,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lon),
                    }))
                );
            } catch (err) {
                setError(err.message);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, [query]);

    const handleSelect = (location) => {
        setQuery(location.name);
        setSuggestions([]);
        onLocationSelect(location);
    };

    return (
        <div className={cn('relative', className)} {...props}>
            <div className="relative">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    error={error}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {suggestions.map((location, index) => (
                        <button
                            key={index}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => handleSelect(location)}
                        >
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{location.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                </div>
            )}
        </div>
    );
} 