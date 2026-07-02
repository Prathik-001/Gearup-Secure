import React from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VehicleRentalBookingRow = ({ booking, users, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      upcoming: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-gray-100 text-gray-800"
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getUserDetails = (userId) => {
    return users?.find((user) => user.$id === userId) || {};
  };

  const determineBookingStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    if (now > end) return "completed";
    return "unknown";
  };

  const user = getUserDetails(booking.userId);
  const status = determineBookingStatus(booking.startDate, booking.endDate);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user?.name || "Unknown"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user?.phone || "N/A"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking?.userId || "N/A"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking?.vehicleName || "N/A"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {booking.startDate ? format(new Date(booking.startDate), "MMM dd, yyyy") : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {booking.endDate ? format(new Date(booking.endDate), "MMM dd, yyyy") : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ₹{booking.totalPrice?.toFixed(2) || "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          aria-label={`Delete booking for ${booking.vehicleName}`}
          className="text-red-600 hover:text-red-800 transition-colors"
          onClick={() => onDelete(booking.$id)}
        >
          <FaTrash className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default VehicleRentalBookingRow;
