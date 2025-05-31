import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-velocity/dist/leaflet-velocity.css';
import 'leaflet-velocity';

export default function Hero() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY;
    let map;

    const initializeMap = (center, zoom) => {
      if (mapContainerRef.current && !mapInstanceRef.current) {
        map = L.map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          attributionControl: false,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          touchZoom: false,
          dragging: false,
        });
        mapInstanceRef.current = map;

        const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19,
        });
        baseLayer.addTo(map);

        const windDataUrl = 'https://onaci.github.io/leaflet-velocity/wind-global.json';

        fetch(windDataUrl)
          .then(response => response.json())
          .then(data => {
            const velocityLayer = L.velocityLayer({ displayValues: false, data: data, maxVelocity: 15 });
            const rainLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`, { opacity: 0.6 });
            const cloudLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`, { opacity: 0.5 });

            velocityLayer.addTo(map);
            rainLayer.addTo(map);
            cloudLayer.addTo(map);
          })
          .catch(error => console.error('Error fetching data:', error));
      }
    };

    const indonesiaCenter = [-2.5, 118.0];
    const indonesiaZoom = 5;
    initializeMap(indonesiaCenter, indonesiaZoom);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="w-full">
      <div className="relative flex flex-col justify-center items-center w-full min-h-[calc(100vh-62px)] overflow-hidden">
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full z-0"
          aria-label="Interactive map with wind animation"
        />
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-40 z-10 pointer-events-none"></div>
        
        <div className="relative z-20 flex flex-col items-center justify-center p-6 text-white w-full h-full pointer-events-none">
          <div className="max-w-2xl text-center pointer-events-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-xl">
              AI-Powered Weather Prediction
            </h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
              Harnessing the power of machine learning for precise, real-time weather forecasts across the archipelago.
            </p>
          </div>
          <button
            className="mt-8 px-8 py-3 text-base font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 pointer-events-auto"
            aria-label="Start weather prediction"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}