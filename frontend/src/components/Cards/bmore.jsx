import { useState ,useEffect} from "react";
import { FaBox, FaDrumSteelpan, FaCar, FaGasPump, FaCogs, FaUsers, FaSuitcase, FaSnowflake, FaMapMarkedAlt, FaFilm, FaDoorOpen, FaTachometerAlt,FaSun } from "react-icons/fa";
import service from "../../appright/conf";
import { useNavigate, useParams } from "react-router-dom";

const BikeInfo = ({id}) => {
  const [bike, setBike] = useState();
  const [fileId, setFileId] = useState(null);
  const [url,seturl]=useState(service.getFilePreiview(fileId))
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking', { state: { bike } });
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );

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
    if (bike?.imageId) {
      setFileId(bike.imageId);
    }
  }, [bike]);

  useEffect(() => {
    if (fileId) {
      const previewUrl = service.getFilePreiview(fileId);
      seturl(previewUrl.replace("preview", "view"));
    }
  }, [fileId]);

  useEffect(() => {
    service.getBikeInfo(id).then(setBike);
  }, [id]);

  if (!bike) 
    return <div className="p-6 text-center">Loading car details...</div>;
    
    console.log(service.getFilePreiview(fileId));
  

  return (
    // <div className="max-w-4xl mx-auto p-4 mt">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-lg">
          <img src={url} alt={`Image of ${bike.vehicleName}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"/>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white">{bike.vehicleName}</h2>
            <p className="text-white/90 flex items-center gap-2 mt-1">
            <FaCar /> {bike.vehicleType}
            </p>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <InfoItem icon={<FaGasPump />} label="Fuel" value={bike.fuelType} />
            <InfoItem icon={<FaTachometerAlt />} label="Mileage" value={bike.mileage} />
            <InfoItem icon={<FaUsers />} label="Seats" value="2" />
            <InfoItem icon={<FaSuitcase />} label="CC" value={bike.cc} />
          </div>

          {/* Rental Price Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Rental Price</p>
                <p className="text-3xl font-bold text-blue-600">₹{bike.rentPrice}</p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
              <div className="text-right">
                <button
                  className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    handleExpandClick();
                    handleBookNow();
                  }}
                  aria-expanded={isExpanded}
                >
                  
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Features Section */}
          <div className={`transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0 overflow-hidden"}`}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              <Feature icon={<FaDrumSteelpan />} label="ABS" available={bike.abs} />
              <Feature icon={<FaMapMarkedAlt />} label="GPS Navigation" available={bike.gpsNavigation} />
              <Feature icon={<FaBox />} label="Top Box" available={bike.topBox} />
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Rental Conditions</h3>
              <p className="text-gray-600">{bike.conditions}</p>
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
  )
};


export default BikeInfo;