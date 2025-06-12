import { useState, useEffect } from 'react';
import { getHistory } from '../../services/api'; 
import { format } from 'date-fns'; 
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Thermometer, Droplets, Wind, Zap } from 'lucide-react';

export function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <h1 className="text-3xl font-bold mb-8">Prediction History</h1>

            {history.length === 0 ? (
                <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-lg">
                    <p className="text-xl">No prediction history found.</p>
                    <p className="text-sm mt-2">Make a prediction on the Predict page to see it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((record) => (
                        <div key={record.id} className="bg-white rounded-lg shadow-md p-5 border hover:shadow-lg transition-shadow">
                            <p className="text-xs text-gray-400 mb-2">
                                {format(new Date(record.timestamp), 'PPP p')}
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-6 h-6 text-yellow-500" />
                                <h3 className="text-xl font-bold text-sky-600">
                                    {record.prediction}
                                </h3>
                            </div>
                            <div className="text-sm text-gray-700 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1"><Thermometer className="w-4 h-4 text-red-500"/> Avg Temp</span>
                                    <span>{record.inputs.temp_avg_c}°C</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1"><Droplets className="w-4 h-4 text-blue-500"/> Avg Humidity</span>
                                    <span>{record.inputs.humidity_avg_percent}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1"><Wind className="w-4 h-4 text-gray-500"/> Avg Wind</span>
                                    <span>{record.inputs.wind_speed_avg_ms} m/s</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}