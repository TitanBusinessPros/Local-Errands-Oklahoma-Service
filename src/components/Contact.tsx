import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    serviceType: '',
    preferredDate: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Handle chain of custody note for delivery service
    if (name === 'serviceType' && value === 'delivery-chain-custody') {
      console.log('Chain of custody delivery service selected');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started', formData);
    
    setIsSubmitting(true);

    try {
      // Store form submission in database
      console.log('Storing form data in database...');
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: `${formData.serviceType} - ${formData.location}`,
            preferred_date: formData.preferredDate ? new Date(formData.preferredDate).toISOString().split('T')[0] : null,
            preferred_time: formData.preferredDate ? new Date(formData.preferredDate).toISOString().split('T')[1].split('.')[0] : null,
            message: formData.message,
          }
        ]);

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save form data');
      }

      console.log('Form data saved to database successfully');

      // Send email notifications via Brevo
      console.log('Sending email notifications...');
      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        'send-email-notification',
        {
          body: {
            formData: formData
          }
        }
      );

      if (emailError) {
        console.error('Email function error:', emailError);
        throw new Error('Failed to send email notifications');
      }

      console.log('Email notifications sent successfully:', emailData);
      
      // Show clean success message only
      toast({
        title: "Request Submitted Successfully!",
        description: "We've received your request and sent you a confirmation email. We'll contact you within 2 hours during business hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        serviceType: '',
        preferredDate: '',
        message: '',
      });

    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again or call us directly at (405) 998-8232.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Book Your Oklahoma Errand Service
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Tell us what you need help with in Wynnewood, Davis, Pauls Valley,
              or Sulphur and we'll get back to you quickly
            </p>
            <p className="text-lg text-gray-600">
              We also offer errand services outside our primary service area!
              Fill out the form below for a custom quote.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Service Request Form
                </h3>
                <p className="text-gray-600">
                  Fill out the details below and we'll contact you within 2
                  hours during business hours. You'll receive a confirmation email
                  immediately after submitting. Feel free to text us or email us 24
                  hours a day for questions or quotes!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(405) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service Location *
                  </label>
                  <select
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select your location</option>
                    <option value="wynnewood">Wynnewood, OK</option>
                    <option value="davis">Davis, OK</option>
                    <option value="pauls-valley">Pauls Valley, OK</option>
                    <option value="sulphur">Sulphur, OK</option>
                    <option value="other">Other (please specify in message)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="serviceType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type of Service *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select service type</option>
                    <option value="grocery-shopping">Grocery Shopping</option>
                    <option value="transportation">Transportation</option>
                    <option value="package-delivery">Package Delivery</option>
                    <option value="delivery-chain-custody">Delivery with Chain of Custody</option>
                    <option value="appointments">Appointment Scheduling</option>
                    <option value="home-services">Home Services</option>
                    <option value="business-tasks">Business Tasks</option>
                    <option value="animal-transport">Animal Transportation</option>
                    <option value="building-supplies">Building Supply Hauling</option>
                    <option value="dry-cleaning">Dry Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                  
                  {formData.serviceType === 'delivery-chain-custody' && (
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200 mt-2">
                      <strong>Chain of Custody:</strong> Please list what is in the package and who the owner of the property is.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="preferredDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Preferred Date/Time
                  </label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="datetime-local"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe what you need help with, any special instructions, and your address/pickup location..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
                </button>
              </form>
            </div>

            {/* Right Side Cards */}
            <div className="space-y-6">
              {/* Service Hours */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Service Hours
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Sunday:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Oklahoma Service Area */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Oklahoma Service Area
                </h3>
                <p className="text-gray-600 mb-4">
                  We proudly serve the local communities of <strong>Sulphur, Davis, Pauls Valley and Wynnewood Oklahoma</strong>! We do offer errands outside our service area! Fill out our contact form for a quote today!
                </p>
                <div className="text-sm text-gray-600">
                  <p><strong>Primary Service Areas:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Wynnewood, OK (Garvin County)</li>
                    <li>Davis, OK (Murray County)</li>
                    <li>Pauls Valley, OK (Garvin County)</li>
                    <li>Sulphur, OK (Murray County)</li>
                  </ul>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Quick Contact
                </h3>
                <p className="text-gray-600 mb-4">Need to speak with someone right away? Text us 24 hours a day!</p>
                <a 
                  href="tel:+14059988232" 
                  className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-2 px-4 rounded-md text-center font-medium hover:scale-105 transition-transform duration-300"
                >
                  Call (405)-998-8232
                </a>
              </div>

              {/* Email Contact */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Contact
                </h3>
                <a 
                  href="mailto:traxispathfinder@gmail.com" 
                  className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-2 px-4 rounded-md text-center font-medium hover:scale-105 transition-transform duration-300"
                >
                  traxispathfinder@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;