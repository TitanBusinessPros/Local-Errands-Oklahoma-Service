import React from 'react';
import { ArrowRight, Clock, CheckCircle, Smile } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(https://cdn-ai.onspace.ai/onspace/project/image/LB4Hnrug9c6WjZFLZWzKEX/ChatGPT_Image_Jul_27,_2025,_06_44_11_PM.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.5)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Personal Errand Runner in Oklahoma
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Save time and reduce stress in Wynnewood, Davis, Pauls Valley, and
            Sulphur Oklahoma. Traxis Pathfinder handles your daily tasks so you
            can focus on what truly matters.
          </p>
          <p className="text-lg mb-8 text-blue-100">
            Professional errand services across Garvin County and Murray County
            - your trusted local assistant in Oklahoma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={scrollToContact}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 rounded font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
            >
              Book Service Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
              <Clock className="h-12 w-12 mb-4 text-blue-200 group-hover:text-white transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-blue-100 group-hover:text-white transition-colors duration-300">
                Get hours back in your day while we handle your errands across
                Oklahoma
              </p>
            </div>
            <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
              <CheckCircle className="h-12 w-12 mb-4 text-blue-200 group-hover:text-white transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-2">
                Trusted Local Service
              </h3>
              <p className="text-blue-100 group-hover:text-white transition-colors duration-300">
                Reliable drivers with insurance & valid licensing serving
                Oklahoma communities
              </p>
            </div>
            <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
              <Smile className="h-12 w-12 mb-4 text-blue-200 group-hover:text-white transition-colors duration-300" />
              <h3 className="text-xl font-semibold mb-2">Peace of Mind</h3>
              <p className="text-blue-100 group-hover:text-white transition-colors duration-300">
                Professional service with a personal touch in your local
                Oklahoma area
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;