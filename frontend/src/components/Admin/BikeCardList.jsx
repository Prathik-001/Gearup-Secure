import React, { useState } from "react";
import { FaTrash, FaGasPump, FaCar, FaEdit } from "react-icons/fa";
import { MdElectricCar } from "react-icons/md";

const BikeCardList = ({ vehicle, onDelete, onEdit }) => {
  const [showModal, setShowModal] = useState(false);


  const handleConfirmDelete = () => {
    onDelete(vehicle.$id);
    setShowModal(false);
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case "Electric":
        return <MdElectricCar className="text-blue-500" />;
      case "Petrol":
        return <FaGasPump className="text-green-500" />;
      case "Diesel":
        return <FaGasPump className="text-red-500" />;
    case "CNG":
        return <FaGasPump className="text-blue-300"/>;
    case "Hybrid":
        return <FaGasPump className="text-orange-500"/>
      default:
        return <FaCar className="text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white rounded shadow">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">{vehicle.vehicleName}</h2>
          <div className="flex items-center gap-20">
            <div className="flex items-center gap-2">
              {getFuelIcon(vehicle.fuelType)}
              <span className="text-sm text-gray-600">{vehicle.fuelType}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
            ₹{vehicle.rentPrice}
            </span>
            <span className="inline-block  px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full">
              {vehicle.vehicleType}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(vehicle)}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-2"
            aria-label="Edit vehicle"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={handleConfirmDelete}
            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2"
            aria-label="Delete vehicle"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default BikeCardList;
