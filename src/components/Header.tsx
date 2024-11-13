import React from 'react';
import { FileText, Home, Info, Star } from 'lucide-react';

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FileShare</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'info', icon: Info, label: 'Information' },
              { id: 'reviews', icon: Star, label: 'Reviews' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}