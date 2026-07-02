import React from "react";
import { format, differenceInCalendarDays, isAfter } from "date-fns";
import { FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const ActiveRental = ({ rental, onDelete }) => {
  const today = new Date();
  const endDate = new Date(rental.endDate);
  const isActive = isAfter(endDate, today);

  const remainingDays = isActive
    ? differenceInCalendarDays(endDate, today)
    : 0;

  return (
    <div className="p-6 rounded-lg bg-white shadow-lg mb-6 max-w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <p className="text-gray-600  text-sm">Vehicle Name</p>
          <h3 className="text-2xl font-bold mb-1">{rental.vehicleName}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-semibold">
                {format(new Date(rental.startDate), "PP")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">End Date</p>
              <p className="font-semibold">{format(endDate, "PP")}</p>
            </div>
            <div>
              <p className="text-gray-500">Specifications</p>
              <p className="font-semibold">
                {rental.vehicleType || "Unknown"} || {rental.fuelType || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Remaining Days</p>
              <p className="font-semibold">
                {remainingDays > 0 ? `${remainingDays} days` : "Expired"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => onDelete(rental.$id)}
              aria-label="Cancel this rental"
              title="Cancel this rental"
            >
              Cancel Rental
            </button>
            <Link to={"/helpline"}>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              aria-label="Contact support"
              title="Contact support"
            >
              <FaPhone className="inline mr-2" />
              Contact Support
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRental;
