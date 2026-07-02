import { useState, useEffect } from "react";
import VehicleCard from "./CarCard";
import { IoCloseCircleOutline } from "react-icons/io5";
import service from "../../appright/conf";
import CarInfo from "../Cards/more";

const ViewAllCar = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    service.getAllCarsData()
      .then((data) => {
        setVehicles(data);
        setFilteredVehicles(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load vehicle data. Please try again later.");
      });
  }, []);

  const handleViewMore = (id) => {
    setSelectedCarId(id);
  };

  const closeCarInfo = () => {
    setSelectedCarId(null);
  };

  const handleSearch = () => {
    service.searchCars(searchQuery)
      .then((results) => {
        setFilteredVehicles(results);
      })
      .catch((err) => {
        console.error("Error searching cars:", err);
      });
  };

  return (
    <div className="relative w-full">
      {/* Search Bar */}
      <div className="flex items-center justify-center w-full p-2 mt-1 gap-2 bg-gray-50 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Search by name, type, or fuel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* 🚘 Cars List */}
      <div className={`${selectedCarId ? "blur-sm pointer-events-none select-none" : ""}`}>
        {filteredVehicles?.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-lg">
            No vehicles found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.$id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-transform hover:scale-95"
              >
                <VehicleCard vehicle={vehicle} onViewMore={handleViewMore} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔍 Modal for Car Info */}
      {selectedCarId && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-10 flex items-center justify-center z-50">
          <div className="relative   rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-white  text-3xl py-2 px-2 rounded-full z-10 hover:text-red-600"
              onClick={closeCarInfo}>
              <IoCloseCircleOutline/>
            </button>
            <CarInfo id={selectedCarId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllCar;
