import { useState } from "react";
import { FaHome, FaCar, FaPhone, FaSearch } from "react-icons/fa";
import { SiFoursquarecityguide } from "react-icons/si";
import { MdDirectionsCar } from "react-icons/md";
import{Link} from "react-router-dom"

const NotFound = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute transform -rotate-12 left-1/4 top-1/4">
          <MdDirectionsCar className="w-96 h-96" />
        </div>
      </div>

      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-8xl font-bold text-gray-800 animate-pulse">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700">Oops! Page Not Found</h2>
          <p className="text-gray-600 text-lg">
            The road you're looking for seems to have taken a detour
          </p>
        </div>

        <div className="flex justify-center">
         <Link to={'/'}> <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`transform transition-all duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            } bg-blue-600 text-white px-8 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <FaHome className="text-xl" />
            <span>Return to Homepage</span>
          </button></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link to={"/terms-and-conditions"}> 
          <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700">
            <SiFoursquarecityguide  className="text-lg" />
            <span>Terms And Condition</span>
          </button>
          </Link>
          <Link to={'/shedule'}>
          <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700">
            <FaSearch className="text-lg" />
            <span>Browse Vehicles</span>
          </button>
          </Link>
          <Link to={'/helpline'}>
          <button className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700">
            <FaPhone className="text-lg" />
            <span>Contact Support</span>
          </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;