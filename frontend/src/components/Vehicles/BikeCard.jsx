import React, { useEffect, useState } from "react";
import { FaCar, FaGasPump, FaRoad, FaStar } from "react-icons/fa";
import { BsLightningChargeFill, BsFuelPump } from "react-icons/bs";
import { Link } from "react-router-dom";
import service from "../../appright/conf.js";

const BikeCard = ({ vehicle, onViewMore }) => {
  const [fileId, setFileId] = useState(vehicle?.imageId);
  const [url, setUrl] = useState(service.getFilePreiview(fileId));

  useEffect(() => {
    setFileId(vehicle?.imageId);
  }, [vehicle?.imageId]);

  useEffect(() => {
    if (fileId) {
      setUrl(service.getFilePreiview(fileId).replace("preview", "view"));
    } else {
      setUrl('');
    }
  }, [fileId]);
 

  const getFuelTypeIcon = (fuelType) => {
    switch (fuelType) {
      case "Electric":
        return (
          <div className="flex items-center gap-1">
            <BsLightningChargeFill className="text-blue-700" />
            <span className="text-blue-700 text-sm">{fuelType}</span>
          </div>
        );
      case "Hybrid":
        return (
          <div className="flex items-center gap-1">
            <BsFuelPump className="text-orange-500" />
            <span className="text-orange-500 text-sm">{fuelType}</span>
          </div>
        );
      case "Petrol":
        return (
          <div className="flex items-center gap-1">
            <BsFuelPump className="text-green-500" />
            <span className="text-green-500 text-sm">{fuelType}</span>
          </div>
        );
      case "CNG":
        return (
          <div className="flex items-center gap-1">
            <BsFuelPump className="text-blue-300" />
            <span className="text-blue-300 text-sm">{fuelType}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1">
            <FaGasPump className="text-yellow-500" />
            <span className="text-yellow-500 text-sm">{fuelType}</span>
          </div>
        );
    }
  };

  const getLuxuryStars = (level) => {
    return [...Array(level)].map((_, index) => (
      <FaStar key={index} className="text-yellow-400 mb-2" />
    ));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "ELECTRIC":
        return "bg-blue-100 text-blue-800";
      case "CRUISER":
        return "bg-green-100 text-green-800";
      case "CAFE-RACER":
        return "bg-yellow-100 text-yellow-800";
      case "OFF-ROAD":
        return "bg-orange-100 text-orange-800";
      case "STANDARD":
        return "bg-slate-100 text-slate-800";
      case "SCOOTER":
        return "bg-purple-100 text-purple-800";
      case "SPORT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return vehicle ? (
    <div className="max-w-sm w-full">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img
            src={url}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="p-4 space-y-3">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
            {vehicle.vehicleName}
          </h2>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(vehicle.vehicleType)}`}>
              <FaCar className="inline mr-1" />
              {vehicle.vehicleType}
            </span>
            {getFuelTypeIcon(vehicle.fuelType)}
          </div>

          <div className="flex items-center space-x-1">
            <FaRoad className="text-gray-500" />
            <span className="text-gray-700">{vehicle.range} km range</span>
          </div>

          <div className="flex items-center space-x-1">
            {getLuxuryStars(vehicle.rating)}
          </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            onClick={() => onViewMore(vehicle.$id)}>
              View More
            </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default BikeCard;
