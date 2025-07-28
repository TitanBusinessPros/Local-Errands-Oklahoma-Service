import React from 'react';
import { Phone } from 'lucide-react';

const Header = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn-ai.onspace.ai/onspace/project/image/NC8Y3QkWMSQpfqhpoCKuF7/ChatGPT_Image_Jul_27,_2025,_07_40_25_PM.png"
              alt="Local Errands Logo"
              className="h-12 w-12 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Local Errands
              </h1>
              <span className="text-sm text-gray-600 font-light">
                by Traxis Pathfinder
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>405-998-8232</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  Hours: 8 AM - 8 PM - 7 Days A Week
                </span>
              </div>
            </div>

            <button
              onClick={scrollToContact}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;