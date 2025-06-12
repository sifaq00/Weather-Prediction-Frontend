import { Github, Twitter, Linkedin } from 'lucide-react';
import logo from '../assets/LOGO.png'; 

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Predict', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'History', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
       
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                className="w-10 h-10 object-contain rounded-full"
                alt="WeatherWise logo"
              />
              <span className="text-xl font-bold text-sky-600">Zenith</span>
            </div>
            <p className="mt-4 text-sm text-gray-500 max-w-xs">
              Harnessing AI to deliver precise, real-time weather forecasts across the archipelago.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-gray-500 hover:text-sky-600 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; 2025 Zenith. All Rights Reserved.
          </p>
          <div className="flex space-x-6 order-1 sm:order-2">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-sky-500 transition-colors">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}