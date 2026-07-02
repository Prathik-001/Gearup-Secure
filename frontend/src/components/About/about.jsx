import React from 'react';
import { FaCar, FaMotorcycle, FaMoneyBillWave, FaCalendarAlt, FaTools, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

export const about = () => {

  const features = [
    {
      icon: <FaCar className="text-4xl mb-4" />,
      title: "Wide Vehicle Range",
      description: "From luxury cars to efficient bikes"
    },
    {
      icon: <FaMoneyBillWave className="text-4xl mb-4" />,
      title: "Best Pricing",
      description: "Competitive rates for all vehicles"
    },
    {
      icon: <FaCalendarAlt className="text-4xl mb-4" />,
      title: "Easy Booking",
      description: "Simple and quick reservation process"
    },
    {
      icon: <FaTools className="text-4xl mb-4" />,
      title: "Well Maintained",
      description: "Regular service and maintenance"
    },
    {
      icon: <FaClock className="text-4xl mb-4" />,
      title: "Flexible Duration",
      description: "Rent from hours to months"
    },
    {
      icon: <FaMotorcycle className="text-4xl mb-4" />,
      title: "2 & 4 Wheelers",
      description: "Options for every need"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('https://bagzpack.s3.amazonaws.com/logo/72353da3-1a8c-44ed-8a00-0e45c2914dbc/IMG/1659116516765.jpeg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto px-6 h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white max-w-2xl"
            >
              <h1 className="text-5xl font-bold mb-4">GearUp</h1>
              <p className="text-xl">Your trusted partner for premium vehicle rentals. Experience the freedom of mobility with our extensive fleet of 2 and 4 wheelers.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
              <p className="text-gray-600 mb-4">Founded in 2025, WheelsOnDemand began with a simple vision: to make quality vehicle rentals accessible to everyone. What started with just 5 vehicles has now grown into a fleet of over 500 vehicles serving thousands of satisfied customers.</p>
              <p className="text-gray-600">Our commitment to customer satisfaction and vehicle quality has made us the most trusted name in the rental industry.</p>
            </div>
            <div className="flex-1">
              <img 
                src="https://etimg.etb2bimg.com/photo/98889074.cms" 
                alt="Company History" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-12">Our Mission & Vision</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 mb-8">To provide convenient, reliable, and affordable mobility solutions while ensuring customer satisfaction and environmental responsibility.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Quality</h3>
                  <p className="text-gray-600">Premium vehicles maintained to the highest standards</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Reliability</h3>
                  <p className="text-gray-600">Consistent service you can always count on</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                  <p className="text-gray-600">Embracing technology for better service</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-gray-50 rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-blue-600">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8">Browse our collection and find your perfect ride today.</p>
          <Link to={"/shedule"}>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
            View Our Fleet
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default about;