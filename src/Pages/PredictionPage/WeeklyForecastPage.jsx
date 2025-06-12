import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, addDays } from 'date-fns';
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
import { CloudSun, ArrowLeft, Sun, Cloud, CloudRain, CloudLightning, CloudFog } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WeatherIcon = ({ condition }) => {
  const iconProps = { className: "h-12 w-12" };
  
  switch(condition) {
    case 'sunny':
      return <Sun {...iconProps} className="text-yellow-400" />;
    case 'cloudy':
      return <Cloud {...iconProps} className="text-gray-400" />;
    case 'rainy':
      return <CloudRain {...iconProps} className="text-blue-400" />;
    case 'thunderstorm':
      return <CloudLightning {...iconProps} className="text-purple-500" />;
    case 'foggy':
      return <CloudFog {...iconProps} className="text-gray-300" />;
    default:
      return <CloudSun {...iconProps} className="text-sky-500" />;
  }
};

export function WeeklyForecastPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.weeklyData) {
      setWeeklyData(location.state.weeklyData);
      setIsLoading(false);
    } else {
      setError("No forecast data available. Please make a prediction first.");
      setIsLoading(false);
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading weekly forecast data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p className="mb-4">Error: {error}</p>
        <button 
          onClick={() => navigate('/predict')}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
        >
          Go to Prediction Page
        </button>
      </div>
    );
  }

  const dates = weeklyData.map(item => format(parseISO(item.date), 'EEE, MMM d'));
  const temps = weeklyData.map(item => parseFloat(item.temp_avg_c));
  const minTemps = weeklyData.map(item => parseFloat(item.temp_min_c));
  const maxTemps = weeklyData.map(item => parseFloat(item.temp_max_c));
  const precip = weeklyData.map(item => parseFloat(item.precip_mm));
  const humidity = weeklyData.map(item => parseFloat(item.humidity_avg_percent));

  // Chart options for temperature
  const tempChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '7-Day Temperature Forecast (°C)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      }
    },
    maintainAspectRatio: false
  };

  const tempChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Avg Temperature',
        data: temps,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderWidth: 3,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Min Temperature',
        data: minTemps,
        borderColor: 'rgb(103, 232, 249)',
        backgroundColor: 'rgba(103, 232, 249, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1
      },
      {
        label: 'Max Temperature',
        data: maxTemps,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  // Chart options for precipitation and humidity
  const precipHumidityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Precipitation & Humidity Forecast',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label === 'Precipitation' 
              ? `${context.raw} mm` 
              : `${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    maintainAspectRatio: false
  };

  const precipHumidityData = {
    labels: dates,
    datasets: [
      {
        label: 'Precipitation',
        data: precip,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Humidity',
        data: humidity,
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 1,
        type: 'line',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sky-600 hover:text-sky-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Prediction
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">7-Day Weather Forecast</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border h-80">
          <Line options={tempChartOptions} data={tempChartData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border h-80">
          <Bar options={precipHumidityOptions} data={precipHumidityData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeklyData.map((day, index) => (
          <div key={index} className={`bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow ${
            index === 0 ? 'border-2 border-sky-400' : 'border-gray-100'
          }`}>
            <h3 className="font-semibold text-lg text-sky-700 mb-2">
              {format(parseISO(day.date), 'EEEE, MMM d')}
            </h3>
            <div className="flex flex-col items-center justify-center mb-3">
              <WeatherIcon condition={day.weather_condition} />
              <span className="capitalize mt-2 text-gray-700">
                {day.weather_condition}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Avg Temp:</span> {day.temp_avg_c}°C</p>
              <p><span className="font-medium">Min/Max:</span> {day.temp_min_c}°C / {day.temp_max_c}°C</p>
              <p><span className="font-medium">Precip:</span> {day.precip_mm} mm</p>
              <p><span className="font-medium">Humidity:</span> {day.humidity_avg_percent}%</p>
              <p><span className="font-medium">Wind:</span> {day.wind_speed_avg_ms} m/s</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}