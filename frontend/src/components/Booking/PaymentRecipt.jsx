import { useEffect, useState } from "react";
import { CheckCircle, Car, Calendar, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentRecipt() {
  const [showCheck, setShowCheck] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { state: bookingInfo } = useLocation();

  useEffect(() => {
    setTimeout(() => setShowCheck(true), 300);
    setTimeout(() => setShowDetails(true), 700);
  }, []);

  if (!bookingInfo) {
    return <p className="text-center mt-20 text-lg">No booking data available.</p>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center p-8 bg-fixed flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backgroundBlendMode: "overlay",
      }}>
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-700 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className={`transition-all duration-500 ${showCheck ? "scale-100 opacity-100 animate-pulse" : "scale-50 opacity-0"}`}>
            <CheckCircle className="w-20 h-20 text-green-600 drop-shadow-lg" strokeWidth={1.5} />
          </div>
        </div>

        {/* Details */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-wide">Payment Successful!</h1>
          <p className="text-gray-600">Your vehicle rental has been confirmed.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <Car className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-semibold text-gray-800">{bookingInfo.vehicleName}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Rental Period</p>
              <p className="font-semibold text-gray-800">{bookingInfo.fromDate} - {bookingInfo.toDate}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <MapPin className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Pickup Location</p>
              <p className="font-semibold text-gray-800">{bookingInfo.location}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-gray-800">
                ₹{bookingInfo.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
          <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => navigate(-2)}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
