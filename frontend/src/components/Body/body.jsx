import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaCar, FaMotorcycle, FaCalendarAlt, FaMoneyBillWave, FaCarSide, FaBookmark } from "react-icons/fa";
import { BsStarFill } from "react-icons/bs";
import service from "../../appright/conf";

const HomePage = () => {
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 19) % testimonials.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  9
  const testimonials = [
    {
      name: "John Davis",
      vehicle: "BMW 3 Series",
      quote: "Best rental experience I've ever had. The car was immaculate and the service was exceptional."
    },
    {
      name: "Sarah Wilson",
      vehicle: "Ducati Monster",
      quote: "Fantastic selection of bikes and very competitive prices. Will definitely use again!"
    },
    {
      name: "Roshan",
      vehicle: "Royal Enfield",
      quote: "Driving with GearUp was smooth, reliable, and stress-free — from booking to return, the experience was top-tier. I will definitely gear up again for my next adventure!"
    },
    {
      name: "Avin",
      vehicle: "Tvs Ntorq",
      quote: "I was impressed with the quality of the vehicle and the professionalism of the staff. GearUp is my go-to for rentals!"
    },
    {
      name: "Harsha",
      vehicle: "Swift",
      quote: "GearUp made my trip unforgettable. The car was in perfect condition, and the staff was incredibly helpful. Highly recommend!"
    },
    {
      name: "Ashrith",
      vehicle: "Duster",
      quote: "Seamless booking, well-maintained car, and exceptional support — GearUp turned travel into a pleasure."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Gear Up, Drive Your Adventure</h1>
            <p className="text-xl md:text-2xl mb-8">Mobility Unleashed, Your Journey Starts Here</p>
            <Link to={"/shedule"} ><button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
             Rent Now
            </button></Link>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Fleet</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* {Cars} */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                  <FaCar className="text-4xl" />
                    <h3 className="text-2xl font-bold ml-4">Cars</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Luxury and comfort for your journey</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-xl"/>
                    <Link to={"/car"}><button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                      Explore
                    </button></Link>
                  </div>
                </div>
              </div>
              {/* {Bikes} */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <img
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                  <FaMotorcycle className="text-4xl" />
                    <h3 className="text-2xl font-bold ml-4">Bikes</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Freedom on two wheels</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-xl"/>
                    <Link to={"/bike"}><button className="bg-blue-600 text-white px-6 py-2 rounded-full  hover:bg-blue-700 transition-colors">
                      Explore
                    </button></Link>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <FaCalendarAlt />, title: "Flexible Rentals", description: "Book for a day or a month" },
              { icon: <FaMoneyBillWave />, title: "Competitive Pricing", description: "Best rates guaranteed" },
              { icon: <FaCarSide />, title: "Wide Selection", description: "Find your perfect ride" },
              { icon: <FaBookmark />, title: "Easy Booking", description: "Simple 3-step process" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Customers Say</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{testimonials[currentTestimonial].name}</h3>
                  <p className="text-gray-600">{testimonials[currentTestimonial].vehicle}</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg italic">"{testimonials[currentTestimonial].quote}"</p>
              <div className="flex justify-center mt-6">
                <BsStarFill className="text-yellow-400" />
                <BsStarFill className="text-yellow-400 ml-1" />
                <BsStarFill className="text-yellow-400 ml-1" />
                <BsStarFill className="text-yellow-400 ml-1" />
                <BsStarFill className="text-yellow-400 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">GearUp</h3>
              <p className="text-gray-400">Your trusted partner for vehicle rentals</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <Link to={"/about"} className="text-gray-400 hover:text-white">About Us</Link>
                <li><Link to={'/shedule'} className="text-gray-400 hover:text-white">Vehicles</Link></li>
                <li><Link to={'/terms-and-conditions'} className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
                <li><Link to={'/helpline'} className="text-gray-400 hover:text-white">HelpLine</Link>  </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Rental Street</li>
                <li>Moodubidre, Karnataka</li>
                <li>Phone:+91 8867022166</li>
                <li>Email: info@gearup.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#=https://www.facebook.com/" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="https://x.com/?lang=en-in" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="https://www.instagram.com/?hl=en" className="text-gray-400 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 GearUp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;