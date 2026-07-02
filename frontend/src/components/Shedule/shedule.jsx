import React, { useState } from "react";
import { FaCar, FaMotorcycle } from "react-icons/fa";
import { Link } from "react-router-dom";

const VehicleRentalSchedule = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Full Screen Background */}
      <div
        className="absolute inset-0 z-0 "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8 md:mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  Find Your Perfect Ride
                </h1>
                <p className="text-base sm:text-lg text-gray-400 ">
                  Choose between our premium selection of vehicles
                </p>
              </div>

              {/* Vehicle Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Car Card */}
                <Link
                  to="/car"
                  aria-label="Rent a car"
                  className="group relative block overflow-hidden rounded-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl md:hover:shadow-2xl"
                  onMouseEnter={() => setSelectedVehicle("car")}
                  onMouseLeave={() => setSelectedVehicle(null)}
                  onTouchStart={() => setSelectedVehicle("car")}
                  onTouchEnd={() => setSelectedVehicle(null)}
                  onClick={() => setSelectedVehicle("car")}
                >
                  <div className="w-full h-64 sm:h-72 md:h-80">
                    <img
                      src="https://images.unsplash.com/photo-1550355291-bbee04a92027"
                      alt="Luxury Car"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-center transition-all duration-300 ${
                      selectedVehicle === "car" ? "opacity-90" : "opacity-80"
                    }`}
                  >
                    <div className="text-center p-4 sm:p-6 transform transition-all duration-300 group-hover:-translate-y-2">
                      <FaCar className="text-white text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 group-hover:text-blue-400 transition-all duration-300" />
                      <h2 className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                        Rent a Car
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore our luxury car collection
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Bike Card */}
                <Link
                  to="/bike"
                  aria-label="Rent a bike"
                  className="group relative block overflow-hidden rounded-xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl md:hover:shadow-2xl"
                  onMouseEnter={() => setSelectedVehicle("bike")}
                  onMouseLeave={() => setSelectedVehicle(null)}
                  onTouchStart={() => setSelectedVehicle("bike")}
                  onTouchEnd={() => setSelectedVehicle(null)}
                  onClick={() => setSelectedVehicle("bike")}
                >
                  <div className="w-full h-64 sm:h-72 md:h-80">
                    <img
                      src="https://images.unsplash.com/photo-1558981806-ec527fa84c39"
                      alt="Sport Motorcycle"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-center transition-all duration-300 ${
                      selectedVehicle === "bike" ? "opacity-90" : "opacity-80"
                    }`}
                  >
                    <div className="text-center p-4 sm:p-6 transform transition-all duration-300 group-hover:-translate-y-2">
                      <FaMotorcycle className="text-white text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4 group-hover:text-blue-400 transition-all duration-300" />
                      <h2 className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                        Rent a Bike
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Experience the thrill of the ride
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleRentalSchedule;
