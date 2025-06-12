// src/Pages/PredictionPage/PredictPage.jsx

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, GitBranch, Download, LocateFixed, Satellite, Moon, Sun, Wand2, Cloud, CloudRain, CloudLightning, CloudFog, CloudSun } from 'lucide-react';
import { format, isToday, isPast, addDays, parseISO } from 'date-fns';
import { getPrediction, getPredictionNoSave } from '../../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

// Registrasi komponen ChartJS
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
);

// ============================================================================
// KOMPONEN UI LOKAL & HELPER
// ============================================================================

const WeatherIcon = ({ condition, size = "large" }) => {
  const sizes = {
    large: "h-20 w-20 mx-auto",
    small: "h-12 w-12 mx-auto"
  };
  const baseClassName = sizes[size];
  
  // PERBARUIAN: Menambahkan case untuk "mendung"
  switch(condition?.toLowerCase()) {
    case 'cerah':
      return <Sun className={cn(baseClassName, "text-yellow-400")} />;
    case 'mendung':
    case 'berawan':
       return <Cloud className={cn(baseClassName, "text-gray-400")} />;
    case 'hujan':
    case 'gerimis':
      return <CloudRain className={cn(baseClassName, "text-blue-400")} />;
    case 'badai petir':
      return <CloudLightning className={cn(baseClassName, "text-purple-500")} />;
    case 'kabut':
      return <CloudFog className={cn(baseClassName, "text-gray-300")} />;
    default:
      return <CloudSun className={cn(baseClassName, "text-sky-500")} />;
  }
};
WeatherIcon.propTypes = { 
  condition: PropTypes.string,
  size: PropTypes.oneOf(["small", "large"])
};

const InlinedButton = ({ children, variant = 'primary', size = 'lg', isLoading = false, disabled = false, className = '', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2";
    const variants = { primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow', secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300' };
    const sizes = { lg: 'px-5 py-3 text-base', md: 'px-4 py-2 text-sm', sm: 'p-2' };
    return ( <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled || isLoading} {...props}> {isLoading && <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />} {children} </button> );
};
InlinedButton.propTypes = { children: PropTypes.node.isRequired, variant: PropTypes.string, size: PropTypes.string, isLoading: PropTypes.bool, disabled: PropTypes.bool, className: PropTypes.string };

const InlinedInput = ({ className = '', type = 'text', label, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <input type={type} className={`w-full px-4 py-3 rounded-lg border border-gray-300 bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-gray-400 ${className}`} {...props} />
    </div>
);
InlinedInput.propTypes = { className: PropTypes.string, type: PropTypes.string, label: PropTypes.string };

function LocationSearch({ onLocationSelect, mapRef }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeout = useRef(null);
    useEffect(() => {
        if (query.length < 3) { setSuggestions([]); return; }
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();
                setSuggestions(data.map(item => ({ name: item.display_name, lat: parseFloat(item.lat), lng: parseFloat(item.lon) })));
            } catch (err) { console.error(err); } finally { setIsLoading(false); }
        }, 500);
    }, [query]);
    const handleSelect = (location) => {
        setQuery(location.name); setSuggestions([]); onLocationSelect(location);
        if (mapRef.current) { mapRef.current.flyTo([location.lat, location.lng], 13); }
    };
    return (
        <div className="relative w-full">
            <div className="relative">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for city or place name..." className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-gray-400"/>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                {isLoading && ( <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" /> )}
            </div>
            {suggestions.length > 0 && (
                <div className="absolute z-[1002] w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {suggestions.map((location, index) => (
                        <button key={index} className="w-full px-4 py-3 text-left hover:bg-sky-50 flex items-start gap-3" onClick={() => handleSelect(location)}>
                            <div className="h-5 w-5 text-sky-500 mt-1 flex-shrink-0 animate-pulse"> <div className="h-2 w-2 bg-sky-500 rounded-full animate-ping absolute"></div> <div className="h-2 w-2 bg-sky-500 rounded-full"></div> </div>
                            <span className="text-sm text-gray-700">{location.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
LocationSearch.propTypes = { onLocationSelect: PropTypes.func.isRequired, mapRef: PropTypes.object };

const MapController = ({ onMapClick, mapRef }) => { const map = useMap(); mapRef.current = map; useMapEvents({ click: onMapClick }); return null; };
MapController.propTypes = { onMapClick: PropTypes.func.isRequired, mapRef: PropTypes.object };

const InlinedToastContainer = ({ children }) => ( <div className="fixed bottom-0 right-0 p-4 space-y-4 z-[2000]"> {children} </div> );
InlinedToastContainer.propTypes = { children: PropTypes.node };

const InlinedToast = ({ message, onClose }) => ( <div className="flex items-center p-4 mb-4 rounded-lg border bg-red-50 text-red-800 border-red-200 animate-in slide-in-from-right-5"> <p className="text-sm font-medium">{message}</p> <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-black/5">X</button> </div> );
InlinedToast.propTypes = { message: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

function PredictionForm({ formData, onFormSubmit, isLoading, onInputChange }) {
    const fields = [ { name: 'temp_min_c', label: 'Min Temp (°C)' }, { name: 'temp_max_c', label: 'Max Temp (°C)' }, { name: 'temp_avg_c', label: 'Avg Temp (°C)' }, { name: 'humidity_avg_percent', label: 'Avg Humidity (%)' }, { name: 'precip_mm', label: 'Precipitation (mm)' }, { name: 'sunshine_duration_hours', label: 'Sunshine (hours)' }, { name: 'wind_speed_max_ms', label: 'Max Wind (m/s)' }, { name: 'wind_dir_max_deg', label: 'Wind Direction (°)' }, { name: 'wind_speed_avg_ms', label: 'Avg Wind (m/s)' } ];
    return (
        <form onSubmit={onFormSubmit} className="p-6 bg-white rounded-xl shadow-lg border space-y-4 animate-in fade-in-50">
            <div className="flex items-center gap-3"> <GitBranch className="w-7 h-7 text-sky-600"/> <h2 className="text-xl font-bold text-gray-800">Data for Predictions</h2> </div>
            <p className="text-sm text-gray-500"> Fill in the following data manually or automatically by selecting a location and date on the map. </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {fields.map(field => ( <InlinedInput key={field.name} label={field.label} name={field.name} type="number" step="any" value={formData[field.name] || ''} onChange={onInputChange} className={formData[field.name] ? 'bg-white' : 'bg-gray-100'} /> ))} </div>
            <InlinedButton type="submit" isLoading={isLoading} className="w-full"> <Wand2 className="mr-2 h-5 w-5"/> Get Prediction </InlinedButton>
        </form>
    );
}
PredictionForm.propTypes = { formData: PropTypes.object.isRequired, onFormSubmit: PropTypes.func.isRequired, isLoading: PropTypes.bool.isRequired, onInputChange: PropTypes.func.isRequired };

// ============================================================================
// HALAMAN UTAMA PREDICT PAGE
// ============================================================================
export function PredictPage() {
    const mapRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [activeTileLayer, setActiveTileLayer] = useState('street');
    const [isLocating, setIsLocating] = useState(false);
    const [weeklyPrediction, setWeeklyPrediction] = useState([]);

    const tileLayers = { street: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap' }, satellite: { url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', attribution: '© Esri' }, dark: { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '© CartoDB' } };
    
    const handleLocationSelect = (location) => { setSelectedLocation(location); };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition( (position) => { 
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`).then(res => res.json()).then(data => {
                    handleLocationSelect({ lat: latitude, lng: longitude, name: data.display_name || `Lokasi di ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
                    if (mapRef.current) { mapRef.current.flyTo([latitude, longitude], 15, { animate: true, duration: 1.5 }); }
                }).finally(() => setIsLocating(false));
            }, () => { setError("Izin lokasi ditolak."); setIsLocating(false); } ); 
        } else { setError("Geolocation tidak didukung."); } 
    };

    const handleMapClick = (e) => { 
        const { lat, lng } = e.latlng;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`).then(res => res.json()).then(data => handleLocationSelect({ lat, lng, name: data.display_name || `Lokasi di ${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
    };

    const handleFetchData = async () => {
        if (!selectedLocation) { setError("Silakan pilih lokasi terlebih dahulu."); return; }
        setIsLoadingData(true); setError(null); setPredictionResult(null);
        const date = selectedDate;
        const parsedDate = parseISO(date);
        const isHistorical = isPast(parsedDate) && !isToday(parsedDate);
        const baseUrl = isHistorical ? 'https://archive-api.open-meteo.com/v1/archive' : 'https://api.open-meteo.com/v1/forecast';
        const dailyParams = "temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration,windspeed_10m_max,winddirection_10m_dominant";
        const hourlyParams = "temperature_2m,relativehumidity_2m,windspeed_10m";
        try {
            const apiUrl = `${baseUrl}?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}&start_date=${date}&end_date=${date}&daily=${dailyParams}&hourly=${hourlyParams}&timezone=auto`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (!response.ok) throw new Error(data.reason || "Gagal mengambil data cuaca.");
            if (!data.daily || !data.daily.time.length) throw new Error("Tidak ada data untuk tanggal yang dipilih.");
            const calculateMean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
            const mappedData = {
                temp_max_c: data.daily.temperature_2m_max[0]?.toFixed(1), temp_min_c: data.daily.temperature_2m_min[0]?.toFixed(1),
                precip_mm: data.daily.precipitation_sum[0]?.toFixed(1), sunshine_duration_hours: (data.daily.sunshine_duration[0] / 3600)?.toFixed(1),
                wind_speed_max_ms: (data.daily.windspeed_10m_max[0] / 3.6)?.toFixed(1), wind_dir_max_deg: data.daily.winddirection_10m_dominant[0]?.toFixed(1),
                temp_avg_c: calculateMean(data.hourly.temperature_2m).toFixed(1), humidity_avg_percent: calculateMean(data.hourly.relativehumidity_2m).toFixed(1), 
                wind_speed_avg_ms: (calculateMean(data.hourly.windspeed_10m) / 3.6)?.toFixed(1),
            };
            setFormData(mappedData);
            const endDate = format(addDays(parsedDate, 6), 'yyyy-MM-dd');
            const weeklyApiUrl = `${baseUrl}?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}&start_date=${date}&end_date=${endDate}&daily=${dailyParams}&hourly=${hourlyParams}&timezone=auto`;
            const weeklyResponse = await fetch(weeklyApiUrl);
            const weeklyData = await weeklyResponse.json();
            if (!weeklyResponse.ok) throw new Error(weeklyData.reason || "Gagal mengambil data mingguan.");
            const weeklyProcessed = weeklyData.daily.time.map((date, index) => {
                const hourlyStartIndex = index * 24; const hourlyEndIndex = hourlyStartIndex + 24;
                const hourlyTemps = weeklyData.hourly.temperature_2m.slice(hourlyStartIndex, hourlyEndIndex);
                const hourlyHumidity = weeklyData.hourly.relativehumidity_2m.slice(hourlyStartIndex, hourlyEndIndex);
                const hourlyWind = weeklyData.hourly.windspeed_10m.slice(hourlyStartIndex, hourlyEndIndex);
                return {
                    date, temp_avg_c: calculateMean(hourlyTemps).toFixed(1),
                    temp_min_c: weeklyData.daily.temperature_2m_min[index]?.toFixed(1), temp_max_c: weeklyData.daily.temperature_2m_max[index]?.toFixed(1),
                    precip_mm: weeklyData.daily.precipitation_sum[index]?.toFixed(1), humidity_avg_percent: calculateMean(hourlyHumidity).toFixed(1),
                    wind_speed_avg_ms: (calculateMean(hourlyWind) / 3.6)?.toFixed(1), weather_condition: ''
                };
            });
            const predictionPromises = weeklyProcessed.map(async (dayData) => {
                const numericData = { temp_min_c: parseFloat(dayData.temp_min_c), temp_max_c: parseFloat(dayData.temp_max_c), temp_avg_c: parseFloat(dayData.temp_avg_c), humidity_avg_percent: parseFloat(dayData.humidity_avg_percent), precip_mm: parseFloat(dayData.precip_mm), sunshine_duration_hours: 0, wind_speed_max_ms: 0, wind_dir_max_deg: 0, wind_speed_avg_ms: parseFloat(dayData.wind_speed_avg_ms) };
                try {
                    const prediction = await getPredictionNoSave(numericData);
                    return { ...dayData, weather_condition: prediction.data.predicted_weather };
                } catch { return {...dayData, weather_condition: 'N/A'}; }
            });
            const weeklyWithPredictions = await Promise.all(predictionPromises);
            setWeeklyPrediction(weeklyWithPredictions);
        } catch (err) { setError(err.message); } finally { setIsLoadingData(false); }
    };

    const handlePredictSubmit = async (e) => {
        e.preventDefault(); setIsLoadingPrediction(true); setError(null);
        try {
            const numericFormData = Object.fromEntries( Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0]) );
            const predictionResponse = await getPrediction(numericFormData);
            setPredictionResult(predictionResponse.data.predicted_weather);
        } catch (err) { setError(err.response?.data?.error || "Gagal mendapatkan prediksi dari model Anda."); }
        finally { setIsLoadingPrediction(false); }
    };

    const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    const customIcon = new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png', shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

    const dates = weeklyPrediction.map(item => format(parseISO(item.date), 'EEE, d'));
    const tempChartData = {
        labels: dates,
        datasets: [ { label: 'Avg Temp', data: weeklyPrediction.map(d => d.temp_avg_c), borderColor: 'rgb(14, 165, 233)', backgroundColor: 'rgba(14, 165, 233, 0.2)', borderWidth: 3, tension: 0.3, fill: true }, { label: 'Min Temp', data: weeklyPrediction.map(d => d.temp_min_c), borderColor: 'rgb(103, 232, 249)', backgroundColor: 'rgba(103, 232, 249, 0.2)', borderWidth: 2, borderDash: [5, 5] }, { label: 'Max Temp', data: weeklyPrediction.map(d => d.temp_max_c), borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 2, borderDash: [5, 5] } ]
    };
    const precipHumidityData = {
        labels: dates,
        datasets: [ { label: 'Precipitation (mm)', data: weeklyPrediction.map(d => d.precip_mm), backgroundColor: 'rgba(59, 130, 246, 0.7)', borderWidth: 1 }, { label: 'Humidity (%)', data: weeklyPrediction.map(d => d.humidity_avg_percent), backgroundColor: 'rgba(20, 184, 166, 0.7)', borderWidth: 1, type: 'line', tension: 0.3 } ]
    };
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="text-center"> <h1 className="text-4xl font-bold">Weather Predictor</h1> <p className="text-lg text-gray-500 mt-2">Get accurate weather predictions with our AI model.</p> </div>
            <div className="relative h-[500px] rounded-xl shadow-lg overflow-hidden border isolate">
                <MapContainer center={[-2.5, 118.0]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer url={tileLayers[activeTileLayer].url} attribution={tileLayers[activeTileLayer].attribution} key={activeTileLayer}/>
                    {selectedLocation && ( <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon}/> )}
                    <MapController onMapClick={handleMapClick} mapRef={mapRef} />
                </MapContainer>
                <div className="absolute top-4 left-4 z-[1001] w-full max-w-sm">
                    <div className="p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 space-y-4">
                        <LocationSearch onLocationSelect={handleLocationSelect} mapRef={mapRef} />
                        <InlinedInput type="date" label="Select Date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={format(addDays(new Date(), 15), 'yyyy-MM-dd')} />
                        <InlinedButton onClick={handleFetchData} isLoading={isLoadingData} size="md" className="w-full"> <Download className="mr-2 h-4 w-4"/> Get Weather Data </InlinedButton>
                        {selectedLocation && ( <p className="text-xs text-green-600 font-medium pt-1"> Location: {selectedLocation.name.substring(0,50)}... </p> )}
                    </div>
                </div>
                <div className="absolute top-4 right-4 z-[1001] bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg flex flex-col gap-2 border">
                    <button onClick={() => setActiveTileLayer('street')} className={`p-2 rounded-md ${activeTileLayer === 'street' ? 'bg-sky-500 text-white' : 'bg-white hover:bg-gray-100'}`}><Sun className="h-5 w-5"/></button>
                    <button onClick={() => setActiveTileLayer('satellite')} className={`p-2 rounded-md ${activeTileLayer === 'satellite' ? 'bg-sky-500 text-white' : 'bg-white hover:bg-gray-100'}`}><Satellite className="h-5 w-5"/></button>
                    <button onClick={() => setActiveTileLayer('dark')} className={`p-2 rounded-md ${activeTileLayer === 'dark' ? 'bg-sky-500 text-white' : 'bg-white hover:bg-gray-100'}`}><Moon className="h-5 w-5"/></button>
                </div>
                <div className="absolute bottom-4 left-4 z-[1001]">
                    <InlinedButton onClick={handleGetCurrentLocation} size="md" className="!rounded-lg" isLoading={isLocating}> <LocateFixed className="h-5 w-5 mr-2"/> Use Current Location </InlinedButton>
                </div>
            </div>

            <PredictionForm formData={formData} onFormSubmit={handlePredictSubmit} isLoading={isLoadingPrediction} onInputChange={handleInputChange} />

            {isLoadingData && ( <p className='text-center text-gray-500 animate-pulse'> Fetching data from Open-Meteo... </p> )}
            {isLoadingPrediction && ( <p className='text-center text-gray-500 animate-pulse'> Running prediction model... </p> )}

            {predictionResult && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="space-y-8 mt-8"
                >
                    <div className="p-8 bg-sky-50 rounded-lg text-center border border-sky-200 shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Prediction Result for {format(parseISO(selectedDate), 'd MMMM yy')}
                        </h3>
                        <WeatherIcon condition={predictionResult} size="large" />
                        <p className="text-5xl font-bold text-sky-600 mt-2 capitalize">
                            {predictionResult}
                        </p>
                    </div>
                    
                    {weeklyPrediction.length > 0 && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-gray-800 text-center">7-Day Weather Forecast</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl shadow-lg border h-80">
                                    <Line options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: '7-Day Temperature Forecast (°C)'}}}} data={tempChartData} />
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-lg border h-80">
                                    <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Precipitation & Humidity'}}}} data={precipHumidityData} />
                                </div>
                            </div>
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {weeklyPrediction.map((day) => (
                                <motion.div 
                                    key={day.date} 
                                    className={`bg-white p-4 rounded-lg shadow-md border hover:shadow-xl transition-shadow cursor-pointer`}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <h3 className="font-semibold text-center text-sky-700 mb-2"> {format(parseISO(day.date), 'EEEE, d')} </h3>
                                    <div className="flex flex-col items-center justify-center mb-3">
                                        <WeatherIcon condition={day.weather_condition} size="small" />
                                        <span className="capitalize mt-2 text-gray-700 font-medium"> {day.weather_condition || 'N/A'} </span>
                                    </div>
                                    <div className="space-y-1 text-sm text-center">
                                        <p className="font-bold text-lg">{day.temp_avg_c}°C</p>
                                        <p className="text-gray-500">{day.temp_min_c}°C / {day.temp_max_c}°C</p>
                                        <p>💧 {day.precip_mm} mm</p>
                                        <p>💨 {day.wind_speed_avg_ms} m/s</p>
                                    </div>
                                </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
            
            <InlinedToastContainer>
                {error && <InlinedToast message={error} onClose={() => setError(null)} />}
            </InlinedToastContainer>
        </div>
    );
}