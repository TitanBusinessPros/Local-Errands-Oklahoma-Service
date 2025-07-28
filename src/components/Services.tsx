import React from 'react';

const Services = () => {
  const services = [
    {
      emoji: '🛒',
      title: 'Grocery Shopping in Oklahoma',
      description:
        'Weekly grocery runs, specialty item pickup, and fresh produce selection in Wynnewood, Davis, Pauls Valley, and Sulphur',
    },
    {
      emoji: '🚗',
      title: 'Transportation Services',
      description:
        'Airport runs, appointment transportation, and special event rides across Garvin and Murray Counties',
    },
    {
      emoji: '📦',
      title: 'Package Delivery Oklahoma',
      description:
        'Mail pickup, package delivery, and return processing throughout our Oklahoma service areas',
    },
    {
      emoji: '📅',
      title: 'Appointment Scheduling',
      description:
        'Medical appointments, service calls, and meeting coordination in Oklahoma communities',
    },
    {
      emoji: '🏠',
      title: 'Home Services Oklahoma',
      description:
        'Pet care, plant watering, and basic home maintenance tasks in your local Oklahoma area',
    },
    {
      emoji: '💼',
      title: 'Business Tasks',
      description:
        'Document delivery, office supplies, and administrative support for Oklahoma businesses',
    },
    {
      emoji: '🦆',
      title: 'Animal Transportation',
      description:
        'Safe transport of chickens, rabbits, goats, and other small animals across Oklahoma service areas',
    },
    {
      emoji: '🚛',
      title: 'Building Supply Hauling',
      description:
        'Transportation of concrete, lumber, and construction materials for your Oklahoma building projects',
    },
    {
      emoji: '👔',
      title: 'Dry Cleaning Services',
      description:
        'Pick up and delivery of clothing to dry cleaners across Wynnewood, Davis, Pauls Valley, and Sulphur',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Oklahoma Errand Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From daily necessities to special requests, we're here to help with
            all your errands in Wynnewood, Davis, Pauls Valley, and Sulphur
            Oklahoma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm service-card-enhanced cursor-pointer group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-50 p-3 rounded-lg mr-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl">{service.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;