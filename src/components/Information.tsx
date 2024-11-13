import React from 'react';
import { Shield, Clock, Globe } from 'lucide-react';

export default function Information() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Sharing',
      description: 'Files are encrypted and automatically deleted after download',
    },
    {
      icon: Clock,
      title: '24-Hour Access',
      description: 'Links remain active for 24 hours or until first download',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Share files with anyone, anywhere in the world',
    },
  ];

  return (
    <section id="info" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple, secure, and straightforward file sharing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 text-center">
                {title}
              </h3>
              <p className="mt-2 text-gray-600 text-center">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}