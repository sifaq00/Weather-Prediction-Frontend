import React from 'react';
import { GaugeCircle, BarChart3, History, GitFork } from 'lucide-react';

const featureIcons = {
  "Real-time Prediction": <GaugeCircle className="w-10 h-10 text-sky-500" />,
  "Data Visualization": <BarChart3 className="w-10 h-10 text-sky-500" />,
  "Prediction History": <History className="w-10 h-10 text-sky-500" />,
  "Open Source": <GitFork className="w-10 h-10 text-sky-500" />,
};

function FeatureCard({ title, description, icon }) {
  return (
    <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-sky-100 rounded-lg">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

export function Features() {
  const features = [
    { title: "Real-time Prediction", description: "Get up-to-the-minute weather forecasts for your specific location." },
    { title: "Data Visualization", description: "Explore weather patterns and trends with interactive charts and graphs." },
    { title: "Prediction History", description: "Access past forecasts and analyze the accuracy of our predictions." },
    { title: "Open Source", description: "Contribute to our project and help improve weather prediction models." }
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-sky-600 tracking-wider uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Everything You Need for Weather Insights
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Our platform is packed with powerful tools to help you understand weather like never before.
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={featureIcons[feature.title]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}