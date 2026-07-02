import React, { useEffect, useState } from "react";
import { FaCar, FaGasPump, FaCogs, FaUsers, FaSuitcase, FaSnowflake, FaMapMarkedAlt, FaFilm, FaDoorOpen, FaTachometerAlt,FaSun } from "react-icons/fa"; 
import service from "../../appright/conf";
import { useNavigate } from "react-router-dom";

const CarInfo = ({ id }) => {
  const [car, setCar] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [url,seturl]=useState(service.getFilePreiview(fileId))
  const navigate = useNavigate();

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );

  const handleBookNow = () => {
    navigate('/booking', { state: { car } });
  };

  useEffect(() => {
    if (car?.imageId) {
      setFileId(car.imageId);
    }
  }, [car]);
  
  useEffect(() => {
    if (fileId) {
      const previewUrl = service.getFilePreiview(fileId);
      seturl(previewUrl.replace("preview", "view"));
    }
  }, [fileId]);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const Feature = ({ icon, label, available, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <div>
        <p className="text-gray-600">{label}</p>
        {available !== undefined ? (
          <span className={available ? "text-green-500" : "text-red-500"}>
            {available ? "Available" : "Not Available"}
          </span>
        ) : (
          <span className="font-semibold">{value}</span>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    service.getCarInfo(id).then(setCar);
  }, [id]);

  if (!car) 
    return <div className="p-6 text-center">Loading car details...</div>;

  return (
    // <div className="max-w-4xl mx-auto p-4 ">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg">
          <img src={url} alt={`Image of ${car.vehicleName}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"/>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white">{car.vehicleName}</h2>
            <p className="text-white/90 flex items-center gap-2 mt-1">
            <FaCar /> {car.vehicleType}
            </p>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <InfoItem icon={<FaGasPump />} label="Fuel" value={car.fuelType} />
            <InfoItem icon={<FaTachometerAlt />} label="Mileage" value={car.mileage} />
            <InfoItem icon={<FaUsers />} label="Seats" value={car.seats} />
            <InfoItem icon={<FaSuitcase />} label="Luggage" value={car.luggageCapacity} />
          </div>

          {/* Rental Price Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Rental Price</p>
                <p className="text-3xl font-bold text-blue-600">₹{car.rentPrice}</p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
              <div className="text-right">
                <button
                  className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    handleExpandClick();
                    handleBookNow();
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Features Section */}
          <div className={`transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0 overflow-hidden"}`}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              <Feature icon={<FaSnowflake />} label="Air Conditioning" available={car.airConditioning} />
              <Feature icon={<FaMapMarkedAlt />} label="GPS Navigation" available={car.gpsNavigation} />
              <Feature icon={<FaFilm />} label="Entertainment" available={car.bluetooth} />
              <Feature icon={<FaDoorOpen />} label="Doors" value={car.numberOfDoors} />
              <Feature icon={<FaCogs />} label="Transmission" value={car.transmissionType} />
              <Feature icon={<FaSun />} label="Sunroof" available={car.sunroof} />

            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Rental Conditions</h3>
              <p className="text-gray-600">{car.conditions}</p>
            </div>
          </div>

          <button
            className="w-full mt-4 text-blue-600 hover:text-blue-700 transition-colors"
            onClick={handleExpandClick}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show Less" : "Show More Details"}
          </button>
        </div>
      </div>
    // </div>  
  );
};

export default CarInfo;
