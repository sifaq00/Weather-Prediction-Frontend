// src/Pages/PredictPage.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { getPrediction } from '../../services/api';
import { Toast, ToastContainer } from '../../components/ui/Toast';
import { CloudSun, GitBranch } from 'lucide-react';
function CustomPredictionForm({ onPredict, setCustomPrediction }) {
    const [formData, setFormData] = useState({
        temp_min_c: '19', temp_max_c: '30', temp_avg_c: '25',
        humidity_avg_percent: '80', precip_mm: '0.5', sunshine_duration_hours: '8',
        wind_speed_max_ms: '5.5', wind_dir_max_deg: '180', wind_speed_avg_ms: '2.1'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const numericFormData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
        );
        await onPredict(numericFormData);
        setIsLoading(false);
    };

    const fields = [
        { name: 'temp_min_c', label: 'Min Temp (°C)' }, { name: 'temp_max_c', label: 'Max Temp (°C)' },
        { name: 'temp_avg_c', label: 'Avg Temp (°C)' }, { name: 'humidity_avg_percent', label: 'Avg Humidity (%)' },
        { name: 'precip_mm', label: 'Precipitation (mm)' }, { name: 'sunshine_duration_hours', label: 'Sunshine (hours)' },
        { name: 'wind_speed_max_ms', label: 'Max Wind (m/s)' }, { name: 'wind_dir_max_deg', label: 'Wind Direction (°)' },
        { name: 'wind_speed_avg_ms', label: 'Avg Wind (m/s)' }
    ];

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg border space-y-4">
            <div className="flex items-center gap-3">
                <GitBranch className="w-7 h-7 text-sky-600"/>
                <h2 className="text-xl font-bold text-gray-800">Custom Model Prediction</h2>
            </div>
            <p className="text-sm text-gray-500">Masukkan 9 fitur yang dibutuhkan oleh model machine learning Anda untuk mendapatkan prediksi cuaca.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map(field => (
                    <Input
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type="number"
                        step="any"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                    />
                ))}
            </div>
            <div className="flex gap-4">
                <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                    Get Prediction
                </Button>
                <Button type="button" variant="secondary" onClick={() => setCustomPrediction(null)} className="w-1/3">Clear</Button>
            </div>
        </form>
    );
}

CustomPredictionForm.propTypes = {
    onPredict: PropTypes.func.isRequired,
    setCustomPrediction: PropTypes.func.isRequired,
};

export function PredictPage() {
    const [customPrediction, setCustomPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleCustomPredict = async (features) => {
        setError(null);
        setCustomPrediction(null);
        try {
            const response = await getPrediction(features);
            setCustomPrediction(response.data.predicted_weather);
        } catch (err) {
            setError(err.response?.data?.error || "Gagal mendapatkan prediksi dari model.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold">Predict Weather</h1>
            
            <CustomPredictionForm onPredict={handleCustomPredict} setCustomPrediction={setCustomPrediction} />
            
            {customPrediction && (
                <div className="p-8 bg-sky-50 rounded-lg text-center border border-sky-200 shadow-inner">
                    <CloudSun className="w-16 h-16 text-sky-500 mx-auto animate-pulse mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-700">Your Model Prediction Result:</h3>
                    <p className="text-4xl font-bold text-sky-600 mt-2">{customPrediction}</p>
                </div>
            )}
            
            <ToastContainer>
                {error && <Toast message={error} variant="error" onClose={() => setError(null)} />}
            </ToastContainer>
        </div>
    );
}