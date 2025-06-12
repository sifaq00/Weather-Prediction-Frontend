import { motion } from 'framer-motion';
import { MapPin, BarChart2, Shield, Database, Cpu, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Cpu,
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
        <div className="bg-gray-50">
            {/* Section Header */}
            <motion.div 
                className="text-center py-16 sm:py-24 px-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-600 tracking-tight">About Zenith Weather</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                    Harnessing AI to deliver precise, real-time weather forecasts.
                </p>
            </motion.div>

            {/* Section Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-6 text-center border hover:border-sky-300 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 mb-4">
                                <feature.icon className="h-8 w-8 text-sky-600" aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-500">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Section "How It Works" */}
            <div className="bg-white py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
                           Our system processes vast amounts of meteorological data to generate accurate predictions using a sophisticated machine learning model.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <Database className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">1. Data Aggregation</h3>
                            <p className="mt-2 text-gray-500">We collect historical weather data, current atmospheric conditions, and satellite imagery from multiple global sources.</p>
                        </motion.div>
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <Cpu className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">2. AI-Powered Analysis</h3>
                            <p className="mt-2 text-gray-500">Our TensorFlow model analyzes complex patterns in the data, identifying key factors that influence weather changes.</p>
                        </motion.div>
                         <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <Wind className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">3. Prediction Generation</h3>
                            <p className="mt-2 text-gray-500">The system generates a specific weather forecast (Cerah, Mendung, Hujan) based on the analyzed data for your chosen location.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

             {/* Section Call to Action */}
            <div className="bg-gray-50 py-16 sm:py-24">
                 <div className="text-center max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-gray-900">Ready to See the Future?</h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Experience the power of AI-driven weather forecasting. Get started now and make more informed decisions.
                    </p>
                    <Link
                        to="/predict"
                        className="mt-8 inline-block bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors shadow-lg hover:shadow-sky-300"
                    >
                        Try Weather Prediction
                    </Link>
                </div>
            </div>
        </div>
    );
}