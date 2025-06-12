import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getHistory } from '../../services/api'; 
import { format } from 'date-fns'; 
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Thermometer, Droplets, Wind, Cloud, Sun, CloudRain, CloudLightning, CloudFog, CloudSun, ListFilter, ArrowUpDown, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Komponen Ikon Cuaca
const WeatherIcon = ({ condition, className }) => {
  const iconMap = {
    'cerah': <Sun className={cn("text-yellow-400", className)} />,
    'mendung': <Cloud className={cn("text-gray-400", className)} />,
    'berawan': <Cloud className={cn("text-gray-400", className)} />,
    'hujan': <CloudRain className={cn("text-blue-400", className)} />,
    'gerimis': <CloudRain className={cn("text-blue-300", className)} />,
    'badai petir': <CloudLightning className={cn("text-purple-500", className)} />,
    'kabut': <CloudFog className={cn("text-gray-300", className)} />,
  };
  return iconMap[condition?.toLowerCase()] || <CloudSun className={cn("text-sky-500", className)} />;
};

WeatherIcon.propTypes = {
    condition: PropTypes.string,
    className: PropTypes.string
};

export function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const response = await getHistory();
                setHistory(response.data);
            } catch (err) {
                setError('Gagal mengambil riwayat prediksi. Silakan coba lagi nanti.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const chartData = useMemo(() => {
        if (history.length === 0) return null;
        const counts = history.reduce((acc, record) => {
            const prediction = record.prediction.toLowerCase();
            acc[prediction] = (acc[prediction] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(counts);
        const data = Object.values(counts);
        const backgroundColors = labels.map(label => {
            if (label.includes('cerah')) return 'rgba(255, 206, 86, 0.7)';
            if (label.includes('mendung') || label.includes('berawan')) return 'rgba(150, 150, 150, 0.7)';
            if (label.includes('hujan')) return 'rgba(54, 162, 235, 0.7)';
            return 'rgba(201, 203, 207, 0.7)';
        });

        return {
            labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [{
                label: 'Jumlah Prediksi',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(c => c.replace('0.7', '1')),
                borderWidth: 1,
            }],
        };
    }, [history]);

    const displayedHistory = useMemo(() => {
        return history
            .filter(record => filter === 'all' || record.prediction.toLowerCase() === filter)
            .sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [history, filter, sortOrder]);

    const predictionTypes = useMemo(() => ['all', ...new Set(history.map(r => r.prediction.toLowerCase()))], [history]);

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (isLoading) {
        return (
             <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Prediction History</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} className="h-48" />)}
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="text-center text-red-500 py-16">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Prediction History</h1>
            <p className="text-gray-500 mb-8">Lihat dan kelola semua prediksi yang pernah Anda buat.</p>

            {/* BARU: Visualisasi Data */}
            {chartData && (
                <motion.div 
                    className="mb-8 p-6 bg-white rounded-lg shadow-md border"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                        <PieChart className="w-6 h-6" />
                        Prediction Summary
                    </h2>
                    <div className="max-w-xs mx-auto">
                        <Pie data={chartData} options={{ plugins: { legend: { position: 'top' } } }} />
                    </div>
                </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                    <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                        <ListFilter className="inline-block w-4 h-4 mr-1" />
                        Filter by Weather
                    </label>
                    <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500">
                        {predictionTypes.map(type => (
                            <option key={type} value={type} className="capitalize">{type}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                        <ArrowUpDown className="inline-block w-4 h-4 mr-1" />
                        Sort by Date
                    </label>
                    <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {displayedHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-lg">
                    <p className="text-xl">No prediction history found.</p>
                    <p className="text-sm mt-2">Make a prediction or adjust your filters.</p>
                </div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {displayedHistory.map((record) => (
                        <motion.div 
                            key={record.id} 
                            className="bg-white rounded-lg shadow-md p-5 border hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                            variants={itemVariants}
                            onClick={() => setSelectedRecord(record)}
                        >
                            <p className="text-xs text-gray-400 mb-2">
                                {format(new Date(record.timestamp + 'Z'), 'PPP p')}
                            </p>
                            <div className="flex items-center gap-3 mb-4">
                                <WeatherIcon condition={record.prediction} className="w-8 h-8"/>
                                <h3 className="text-2xl font-bold text-sky-600 capitalize">
                                    {record.prediction}
                                </h3>
                            </div>
                            <div className="text-sm text-gray-700 space-y-2 border-t pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-red-500"/> Avg Temp</span>
                                    <span>{record.inputs.temp_avg_c}°C</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-blue-500"/> Avg Humidity</span>
                                    <span>{record.inputs.humidity_avg_percent}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-gray-500"/> Avg Wind</span>
                                    <span>{record.inputs.wind_speed_avg_ms} m/s</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title="Prediction Details">
                {selectedRecord && (
                    <div className="space-y-4">
                        <div className="p-4 bg-sky-50 rounded-lg text-center">
                            <WeatherIcon condition={selectedRecord.prediction} className="w-12 h-12 mx-auto" />
                            <p className="text-2xl font-bold capitalize mt-2">{selectedRecord.prediction}</p>
                            <p className="text-sm text-gray-500">
                                {format(new Date(selectedRecord.timestamp + 'Z'), 'PPP p')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Input Parameters:</h4>
                            <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md text-sm space-y-2">
                                {Object.entries(selectedRecord.inputs).map(([key, value]) => (
                                    <li key={key} className="flex justify-between">
                                        <span className="capitalize font-medium text-gray-600">{key.replace(/_/g, ' ')}:</span>
                                        <span className="text-gray-800">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}