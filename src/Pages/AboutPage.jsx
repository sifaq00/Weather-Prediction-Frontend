import React from 'react';
import { Cloud, MapPin, BarChart2, Shield } from 'lucide-react';

const features = [
    {
        icon: Cloud,
        title: 'Advanced Weather Prediction',
        description: 'Our system uses machine learning algorithms to provide accurate weather predictions based on historical data and current conditions.',
    },
    {
        icon: MapPin,
        title: 'Location-Based Insights',
        description: 'Get detailed weather forecasts for any location worldwide, with support for saving favorite locations and viewing historical data.',
    },
    {
        icon: BarChart2,
        title: 'Data Visualization',
        description: 'Interactive maps and charts help you understand weather patterns and make informed decisions based on the predictions.',
    },
    {
        icon: Shield,
        title: 'Reliable & Secure',
        description: 'Built with modern web technologies and best practices, ensuring a secure and reliable experience for all users.',
    },
];

export function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">About Weather Prediction</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Welcome to our advanced weather prediction platform. We combine cutting-edge
                    technology with meteorological expertise to provide accurate and reliable
                    weather forecasts.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow p-6"
                        >
                            <feature.icon className="h-8 w-8 text-sky-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Our weather prediction system uses a combination of machine learning
                            algorithms and traditional meteorological models to analyze various
                            factors that influence weather patterns.
                        </p>
                        <p className="text-gray-600">
                            The system processes data from multiple sources, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Historical weather data</li>
                            <li>Current atmospheric conditions</li>
                            <li>Satellite imagery</li>
                            <li>Weather station measurements</li>
                            <li>Climate models</li>
                        </ul>
                        <p className="text-gray-600">
                            This comprehensive approach allows us to provide accurate predictions
                            for various weather parameters, including temperature, precipitation,
                            wind speed, and more.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Get Started</h2>
                    <p className="text-gray-600 mb-6">
                        Ready to experience accurate weather predictions? Start by selecting a
                        location and exploring our features.
                    </p>
                    <a
                        href="/predict"
                        className="inline-block bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
                    >
                        Try Weather Prediction
                    </a>
                </div>
            </div>
        </div>
    );
} 