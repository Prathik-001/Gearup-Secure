import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Car, Fuel, CreditCard, IndianRupee, Check, Receipt } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import service from '../../appright/conf.js';
import authService from '../../appright/auth';
import PaymentRecipt from './PaymentRecipt.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const locations = [
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Bangalore, Karnataka',
  'Mangalore, Karnataka',
  'Moodubidre, Karnataka',
  'Manipal, Karnataka',
  'Udupi, Karnataka',
  'Mysore, Karnataka',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat'
];

const locationShops = {
  'Mumbai, Maharashtra': {
    center: [19.0760, 72.8777],
    zoom: 12,
    shops: [
      { name: "GearUp Mumbai Central", address: "Opposite Station, Mumbai Central Road", phone: "+91 98765 43210", coords: [19.0790, 72.8820] },
      { name: "GearUp Bandra Depot", address: "Linking Road, Bandra West", phone: "+91 98765 43211", coords: [19.0596, 72.8295] }
    ]
  },
  'Delhi, NCR': {
    center: [28.6139, 77.2090],
    zoom: 11,
    shops: [
      { name: "GearUp Connaught Place", address: "Outer Circle, Block E, Connaught Place", phone: "+91 98765 43212", coords: [28.6304, 77.2177] },
      { name: "GearUp Dwarka Hub", address: "Sector 10 Metro Station Market, Dwarka", phone: "+91 98765 43213", coords: [28.5850, 77.0498] }
    ]
  },
  'Bangalore, Karnataka': {
    center: [12.9716, 77.5946],
    zoom: 12,
    shops: [
      { name: "GearUp Koramangala Shop", address: "80 Feet Rd, 4th Block, Koramangala", phone: "+91 98765 43214", coords: [12.9352, 77.6244] },
      { name: "GearUp Indiranagar Depot", address: "100 Feet Rd, Indiranagar", phone: "+91 98765 43215", coords: [12.9719, 77.6412] }
    ]
  },
  'Mangalore, Karnataka': {
    center: [12.9141, 74.8560],
    zoom: 13,
    shops: [
      { name: "GearUp Lalbagh Station", address: "Lalbagh Towers, MG Road", phone: "+91 98765 43216", coords: [12.9250, 74.8450] },
      { name: "GearUp Hampankatta Office", address: "Light House Hill Road, Hampankatta", phone: "+91 98765 43217", coords: [12.8700, 74.8430] }
    ]
  },
  'Moodubidre, Karnataka': {
    center: [13.0725, 74.9928],
    zoom: 14,
    shops: [
      { name: "GearUp Vidyagiri Hub", address: "Alvas College Road, Vidyagiri", phone: "+91 98765 43218", coords: [13.0760, 74.9850] },
      { name: "GearUp Bus Stand Depot", address: "Main Road Near KSRTC Bus Stand", phone: "+91 98765 43219", coords: [13.0690, 74.9980] }
    ]
  },
  'Manipal, Karnataka': {
    center: [13.3409, 74.7943],
    zoom: 14,
    shops: [
      { name: "GearUp MIT Campus Shop", address: "Student Plaza Area, MIT Campus", phone: "+91 98765 43220", coords: [13.3425, 74.7970] },
      { name: "GearUp Tiger Circle Office", address: "End Point Road Near Tiger Circle", phone: "+91 98765 43221", coords: [13.3490, 74.7890] }
    ]
  },
  'Udupi, Karnataka': {
    center: [13.3409, 74.7421],
    zoom: 14,
    shops: [
      { name: "GearUp Krishna Temple Plaza", address: "Car Street Near Sri Krishna Matha", phone: "+91 98765 43222", coords: [13.3415, 74.7485] },
      { name: "GearUp City Bus Stand", address: "Maruthi Veethika, Opp. City Bus Stand", phone: "+91 98765 43223", coords: [13.3365, 74.7390] }
    ]
  },
  'Mysore, Karnataka': {
    center: [12.2958, 76.6394],
    zoom: 13,
    shops: [
      { name: "GearUp Mysore Palace Outlet", address: "Sayyaji Rao Road Near Palace South Gate", phone: "+91 98765 43224", coords: [12.3020, 76.6530] },
      { name: "GearUp Gokulam Hub", address: "3rd Stage Gokulam near Yoga Center", phone: "+91 98765 43225", coords: [12.3210, 76.6210] }
    ]
  },
  'Chennai, Tamil Nadu': {
    center: [13.0827, 80.2707],
    zoom: 12,
    shops: [
      { name: "GearUp Nungambakkam Station", address: "Mahalingapuram Main Road", phone: "+91 98765 43226", coords: [13.0610, 80.2370] },
      { name: "GearUp Adyar Depot", address: "Sardar Patel Road, Adyar", phone: "+91 98765 43227", coords: [13.0063, 80.2570] }
    ]
  },
  'Hyderabad, Telangana': {
    center: [17.3850, 78.4867],
    zoom: 12,
    shops: [
      { name: "GearUp Gachibowli Hub", address: "IT Corridor Road, Gachibowli", phone: "+91 98765 43228", coords: [17.4400, 78.3480] },
      { name: "GearUp Secunderabad Station", address: "Station Road, Secunderabad", phone: "+91 98765 43229", coords: [17.4340, 78.5010] }
    ]
  },
  'Kolkata, West Bengal': {
    center: [22.5726, 88.3639],
    zoom: 12,
    shops: [
      { name: "GearUp Salt Lake Depot", address: "Sector V, Salt Lake City", phone: "+91 98765 43230", coords: [22.5735, 88.4330] },
      { name: "GearUp Park Street Outlet", address: "Mother Teresa Sarani, Park Street", phone: "+91 98765 43231", coords: [22.5480, 88.3560] }
    ]
  },
  'Pune, Maharashtra': {
    center: [18.5204, 73.8567],
    zoom: 12,
    shops: [
      { name: "GearUp Koregaon Park Shop", address: "North Main Road, Koregaon Park", phone: "+91 98765 43232", coords: [18.5362, 73.8930] },
      { name: "GearUp Kothrud Depot", address: "Karve Road, Kothrud", phone: "+91 98765 43233", coords: [18.5074, 73.8077] }
    ]
  },
  'Ahmedabad, Gujarat': {
    center: [23.0225, 72.5714],
    zoom: 12,
    shops: [
      { name: "GearUp SG Highway Hub", address: "Sarkhej - Gandhinagar Highway", phone: "+91 98765 43234", coords: [23.0120, 72.5050] },
      { name: "GearUp CG Road Outlet", address: "Chimanlal Girdharlal Road, Navrangpura", phone: "+91 98765 43235", coords: [23.0260, 72.5580] }
    ]
  }
};

const Booking = () => {
  const locationRouter = useLocation();
  const selectedBike = locationRouter.state?.bike;
  const selectedCar = locationRouter.state?.car;
  const selectedVehicle = selectedCar || selectedBike;
  const navigate = useNavigate();
  const reduxUserId = useSelector((state) => state.auth.userId); // Redux state

  const vehicleId = selectedVehicle?.$id;

  const [vehicleData, setVehicleData] = useState({
    vehicleName: '',
    vehicleType: '',
    fuelType: '',
    rentPrice: 0,
  });

  const [selectedShop, setSelectedShop] = useState(null);
  const mapRef = React.useRef(null);
  const markersRef = React.useRef([]);

  const [bookingData, setBookingData] = useState({
    fromDate: '',
    toDate: '',
    location: '',
    paymentMethod: 'credit',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    termsAccepted: false,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedVehicle) {
      setVehicleData({
        vehicleName: selectedVehicle.vehicleName,
        vehicleType: selectedVehicle.vehicleType,
        fuelType: selectedVehicle.fuelType,
        rentPrice: selectedVehicle.rentPrice,
      });
    }
  }, [selectedVehicle]);

  useEffect(() => {
    if (bookingData.fromDate && bookingData.toDate && vehicleData.rentPrice) {
      const start = new Date(bookingData.fromDate);
      const end = new Date(bookingData.toDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalPrice(days > 0 ? days * vehicleData.rentPrice : 0);
    }
  }, [bookingData.fromDate, bookingData.toDate, vehicleData.rentPrice]);

  useEffect(() => {
    // Give Vite / React DOM a split second to mount the #map element before initializing Leaflet
    const timer = setTimeout(() => {
      const L = window.L;
      if (!L) {
        console.error("Leaflet library is not available on window.L");
        return;
      }

      // Configure Leaflet marker icon asset fallbacks from CDN
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const mapEl = document.getElementById("map");
      if (!mapEl) return;

      // Determine center, zoom, and shops to show
      let shopsToShow = [];
      let center = [20.5937, 78.9629]; // India center
      let zoom = 5;

      if (bookingData.location && locationShops[bookingData.location]) {
        const shopInfo = locationShops[bookingData.location];
        center = shopInfo.center;
        zoom = shopInfo.zoom;
        shopsToShow = shopInfo.shops;
      } else {
        // Show all shops across all locations
        Object.keys(locationShops).forEach(key => {
          shopsToShow.push(...locationShops[key].shops);
        });
      }

      // Clean up previous map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Initialize map
      const map = L.map('map').setView(center, zoom);
      mapRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Add markers
      markersRef.current = [];
      shopsToShow.forEach((shop, index) => {
        const marker = L.marker(shop.coords).addTo(map);
        marker.bindPopup(`
          <div class="p-1">
            <h5 class="font-bold text-gray-900 text-sm">${shop.name}</h5>
            <p class="text-xs text-gray-600 mt-1">${shop.address}</p>
            <p class="text-xs text-blue-600 font-semibold mt-1">${shop.phone}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedShop(shop);
        });

        markersRef.current.push(marker);

        // Open the popup of the first shop by default if we are filtered to one location
        if (bookingData.location && index === 0) {
          marker.openPopup();
          setSelectedShop(shop);
        }
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [bookingData.location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setBookingData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleTermsChange = (e) => {
    setBookingData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      fromDate,
      toDate,
      location,
      paymentMethod,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
    } = bookingData;

    if (!fromDate || !toDate || !location || !paymentMethod) {
      alert('Please fill all fields');
      return;
    }

    if (!bookingData.termsAccepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }

    if (
      (paymentMethod === 'credit' || paymentMethod === 'debit') &&
      (!cardNumber || !expiryMonth || !expiryYear || !cvv)
    ) {
      alert('Please complete your card details.');
      return;
    }

    setLoading(true);

    let userId = reduxUserId;
    if (!userId) {
      try {
        const currentUser = await authService.getCurrentUser();
        userId = currentUser?.$id;
        if (!userId) throw new Error("User not authenticated");
      } catch {
        alert("User session expired. Please log in again.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await service.bookingData(
        vehicleData.vehicleName,
        vehicleData.vehicleType,
        vehicleData.fuelType,
        vehicleData.rentPrice,
        totalPrice,
        fromDate,
        toDate,
        location,
        vehicleId,
        cardNumber,
        expiryMonth,
        expiryYear,
        "pending",
        userId
      );

      if (response) {
        console.log("Booking successful", response);
        toast.success("Booking successful!", {
          position: "top-center",
          className: "bg-green-600 text-white font-bold rounded-lg shadow-lg",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
          theme: "light",
        });
        navigate("/receipt", {
          state: {
            vehicleName: vehicleData.vehicleName,
            fromDate,
            toDate,
            location,
            totalAmount: totalPrice,
            paymentMethod,
          },
        });
      }
    } catch (err) {
      console.error("Booking error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-8 bg-fixed"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay'
      }}>
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline font-medium">← Back</button>
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Booking</h1>

        {/* Selected Vehicle Display */}
        <div className="bg-blue-50 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Selected Vehicle</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Car className="text-blue-600" size={24} />
              <div>
                <p className="font-medium text-gray-900">{vehicleData.vehicleName}</p>
                <p className="text-sm text-gray-600">{vehicleData.vehicleType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Fuel className="text-blue-600" size={24} />
              <div>
                <p className="font-medium text-gray-900">Fuel Type</p>
                <p className="text-sm text-gray-600">{vehicleData.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IndianRupee className="text-blue-600" size={24} />
              <div>
                <p className="font-medium text-gray-900">Daily Rent</p>
                <p className="text-sm text-gray-600">₹{vehicleData.rentPrice}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                    type="date"
                    name="fromDate"
                    value={bookingData.fromDate}
                    min={new Date().toLocaleDateString('en-CA')} // ✅ correct for local timezone
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                type="date"
                name="toDate"
                value={bookingData.toDate}
                min={bookingData.fromDate || new Date().toISOString().split("T")[0]} // ✅ prevent going before fromDate
                onChange={handleInputChange}
                className="w-full border rounded-lg p-3"
                required
                />
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
            <select name="location" value={bookingData.location}
              onChange={handleInputChange} className="w-full border rounded-lg p-3" required>
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Interactive Map of Nearest Rental Shops */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="text-blue-600 animate-pulse" size={20} />
                {bookingData.location 
                  ? `Nearest Rental Shops in ${bookingData.location.split(',')[0]}`
                  : 'Our Rental Shop Locations'}
              </h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {bookingData.location 
                  ? (locationShops[bookingData.location]?.shops.length || 0)
                  : Object.values(locationShops).reduce((acc, loc) => acc + loc.shops.length, 0)} Shops Available
              </span>
            </div>
            
            <div 
              id="map" 
              className="h-64 w-full rounded-lg border border-gray-300 shadow-inner z-10"
              style={{ minHeight: '260px' }}
            ></div>

            {selectedShop ? (
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <Check className="text-green-600" size={16} /> {selectedShop.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{selectedShop.address}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Contact: {selectedShop.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Automatically select the corresponding pickup location if user confirms a shop from the map
                    const locationKey = Object.keys(locationShops).find(key => 
                      locationShops[key].shops.some(s => s.name === selectedShop.name)
                    );
                    if (locationKey && bookingData.location !== locationKey) {
                      setBookingData(prev => ({ ...prev, location: locationKey }));
                    }
                    toast.success(`Pickup point confirmed at ${selectedShop.name}!`, {
                      position: "bottom-right",
                      autoClose: 2000
                    });
                  }}
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  Confirm Pickup Point
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic text-center py-2">Click on any shop marker on the map to view details.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-6 rounded-xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="paymentMethod"
                  value={bookingData.paymentMethod}
                  onChange={handleInputChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                </select>
              </div>
            </div>

            {(bookingData.paymentMethod === 'credit' || bookingData.paymentMethod === 'debit') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={bookingData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={bookingData.paymentMethod !== 'cash'}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <input
                      type="text"
                      name="expiryMonth"
                      maxLength={2}
                      value={bookingData.expiryMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        if (parseInt(value) <= 12 || value === '') {
                          handleInputChange(e);
                        }
                      }}
                      placeholder="MM"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={bookingData.paymentMethod !== 'cash'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="text"
                      name="expiryYear"
                      value={bookingData.expiryYear}
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        handleInputChange(e);
                      }}
                      placeholder="YY"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={bookingData.paymentMethod !== 'cash'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={bookingData.cvv}
                      maxLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        handleInputChange(e);
                      }}
                      placeholder="XXX"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={bookingData.paymentMethod !== 'cash'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
           
           {/* Total Price Display */}
            {totalPrice > 0 && (
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="text-2xl font-bold text-blue-900 text-center">
                Total Price: ₹{totalPrice.toLocaleString()}
              </p>
              <p className="text-center text-sm text-blue-600 mt-1">
                for {Math.ceil((new Date(bookingData.toDate).getTime() - new Date(bookingData.fromDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          )}
        
            {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              name="termsAccepted"
              checked={bookingData.termsAccepted}
              onChange={handleTermsChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the <Link to={"/terms-and-conditions"} className="text-blue-600 hover:underline">Terms and Conditions</Link>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
          <button
              type="submit"
              disabled={loading || !bookingData.termsAccepted}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg focus:outline-none hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
