import React, { useState, useEffect } from "react";
import { FiUsers, FiTruck, FiBookOpen, FiDollarSign, FiMenu } from "react-icons/fi";
import { FaCar, FaMotorcycle, FaUser } from "react-icons/fa";
import { FaHeadset } from "react-icons/fa6";
import { MdDirectionsBike, MdDirectionsCar } from "react-icons/md";
import { Link } from "react-router-dom";
import service from "../../appright/conf";
import CarCardList from "./CarCardList";
import BikeCardList from "./BikeCardList";
import UserSubmissionList from "./UserHelpline";

import UserData from "./UserData";
import VehicleRentalBookingRow from "./AdminBooking";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bike, setBikeVehicles] = useState([]);
  const [car, setCarVehicles] = useState([]);
  const [user, setUserData] = useState([]);
  const [booking, setBooking] = useState([]);
  const [helpline, setHelpline] = useState([]);

  // Editing vehicle states
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editImageFile, setEditImageFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all data
  useEffect(() => {
    service.getAllUsersData().then(data => setUserData(data || [])).catch(console.error);
    service.getAllBikesData().then(data => setBikeVehicles(data || [])).catch(console.error);
    service.getAllCarsData().then(data => setCarVehicles(data || [])).catch(console.error);
    service.getAllBookingsData().then(data => setBooking(data || [])).catch(console.error);
    service.getAllHelpline().then(data => setHelpline(data || [])).catch(console.error);
  }, []);

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditForm({ ...vehicle });
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      let imageId = editForm.imageId;
      
      if (editImageFile) {
        const uploadRes = await service.uploadFile(editImageFile);
        if (uploadRes && uploadRes.fileId) {
          imageId = uploadRes.fileId;
        } else {
          throw new Error("Failed to upload new vehicle image.");
        }
      }

      const updateData = {
        ...editForm,
        imageId,
        rentPrice: Number(editForm.rentPrice),
        seats: editForm.seats ? Number(editForm.seats) : null,
        numberOfDoors: editForm.numberOfDoors ? Number(editForm.numberOfDoors) : null,
        cc: editForm.cc ? Number(editForm.cc) : null,
      };

      const updated = await service.updateVehicle(editingVehicle.$id, updateData);
      if (updated) {
        Swal.fire("Success", "Vehicle details updated successfully!", "success");
        
        if (editingVehicle.isBike) {
          setBikeVehicles(prev => prev.map(v => v.$id === editingVehicle.$id ? updated : v));
        } else {
          setCarVehicles(prev => prev.map(v => v.$id === editingVehicle.$id ? updated : v));
        }
        setIsEditModalOpen(false);
        setEditingVehicle(null);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message || "Failed to update vehicle.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Dashboard
  const DashboardCards = () => (  
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold text-blue-600">{(user || []).length}</h3>
          </div>
          <FiUsers className="text-3xl text-blue-500" />
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Vehicles</p>
            <div className="flex gap-4">
              <span className="flex items-center"><MdDirectionsBike className="mr-1" />{(bike || []).length}</span>
              <span className="flex items-center"><MdDirectionsCar className="mr-1" />{(car || []).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Bookings</p>
            <h3 className="text-2xl font-bold text-purple-600">{(booking || []).length}</h3>
          </div>
          <FiBookOpen className="text-3xl text-purple-500" />
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-yellow-600">
              ₹{(booking || []).reduce((acc, b) => acc + (b.totalPrice || 0), 0)}
            </h3>
          </div>
          <span className="text-3xl text-yellow-500">₹</span> {/* Directly using the ₹ symbol */}
        </div>
      </div>
    </div>
  );

  // User Section

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This User will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue button
      cancelButtonColor: "#d33",     // Red cancel button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await service.deleteUser(id);
        await Swal.fire(
          "Deleted!",
          "The User has been deleted successfully.",
          "success"
        );
        setUserData((prev) => prev.filter((item) => item.$id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error!",
          "There was a problem deleting the User.",
          "error"
        );
      }
    }
  };

  const UsersTable = () => (
    <div>
      {user.length === 0 ? (
        <div className="text-center py-12">
          <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-xl">No User Found</p>
        </div>
      ) : (
        <div>
          {user.map((u) => (
            <div key={u.$id} className="mt-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-100">
              <UserData user={u} onDelete={handleDeleteUser} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Bike Section
  const handleDeleteBike = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Bike will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue button
      cancelButtonColor: "#d33",     // Red cancel button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await service.deleteBike(id);
        await Swal.fire(
          "Deleted!",
          "The bike has been deleted successfully.",
          "success"
        );
        setBikeVehicles((prev) => prev.filter((item) => item.$id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error!",
          "There was a problem deleting the car.",
          "error"
        );
      }
    }
  };

  const BikeSection = () => (
    <div className="grid">
      <Link to="badd">
        <button className="text-xl font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">Add New Bike</button>
      </Link>
      <div className="space-y-8 bg-gray-200">
        {bike.length === 0 ? (
          <div className="text-center py-12">
            <FaCar className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-xl">No vehicles available</p>
          </div>
        ) : (
          <div className="space-y-1">
            {bike.map((vehicle) => (
              <div key={vehicle.$id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 hover:scale-100">
                <BikeCardList  vehicle={vehicle} onDelete={handleDeleteBike} onEdit={handleEditClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Car Section  

  const handleDeleteCar = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This car will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue button
      cancelButtonColor: "#d33",     // Red cancel button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await service.deleteCar(id);
        await Swal.fire(
          "Deleted!",
          "The car has been deleted successfully.",
          "success"
        );
        setCarVehicles((prev) => prev.filter((item) => item.$id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error!",
          "There was a problem deleting the car.",
          "error"
        );
      }
    }
  };
  

  const CarSection = () => (
    <div>
      <Link to="add">
        <button className="text-xl font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">Add New Car</button>
      </Link>
      <div className="space-y-8 bg-gray-200">
        {car.length === 0 ? (
          <div className="text-center py-12">
            <FaCar className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-xl">No vehicles available</p>
          </div>
        ) : (
          <div className="space-y-1">
            {car.map((vehicle) => (
              <div key={vehicle.$id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 hover:scale-100">
                <CarCardList vehicle={vehicle} onDelete={handleDeleteCar} onEdit={handleEditClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Bookings Section


  const handleDeleteBooking = async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this booking!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await service.deleteBooking(id);
          Swal.fire(
            "Deleted!",
            "Your booking has been deleted.",
            "success"
          );
          setBooking((prev) => prev.filter((item) => item.$id !== id));
        } catch (err) {
          console.error(err);
          Swal.fire(
            "Error!",
            "There was a problem deleting the booking.",
            "error"
          );
        }
      }
    };

  
  const BookingsTable = ({ booking, users, handleDeleteBooking }) => (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(booking || []).map((b) => (
              <VehicleRentalBookingRow
                key={b.$id}
                booking={b}
                users={users}
                onDelete={handleDeleteBooking}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Helpline Section
  const handleDeleltehelpline = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Helpline will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue button
      cancelButtonColor: "#d33",     // Red cancel button
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await service.deleteHelpline(id);
        await Swal.fire(
          "Deleted!",
          "The Helpline has been deleted successfully.",
          "success"
        );
        setCarVehicles((prev) => prev.filter((item) => item.$id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error!",
          "There was a problem deleting the Helpline.",
          "error"
        );
      }
    }
  };
  

  const HelplineSection = () => (
    <div>
  
                <UserSubmissionList onDelete={handleDeleltehelpline} />
    </div>
  );

  
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300`}
        >
          <div className="p-4 flex items-center justify-between">
            <h2 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>Admin Panel</h2>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu className="text-gray-600" />
            </button>
          </div>
          <nav className="mt-8">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full p-4 flex items-center ${activeSection === "dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-blue-50 hover:text-blue-600`}
            >
              <FiUsers className="text-xl" />
              {isSidebarOpen && <span className="ml-4">Dashboard</span>}
            </button>
            <button
              onClick={() => setActiveSection("users")}
              className={`w-full p-4 flex items-center ${activeSection === "users" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-blue-50 hover:text-blue-600`}
            >
              <FiUsers className="text-xl" />
              {isSidebarOpen && <span className="ml-4">Users</span>}
            </button>
            <button
              onClick={() => setActiveSection("car")}
              className={`w-full p-4 flex items-center ${activeSection === "car" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-blue-50 hover:text-blue-600`}
            >
              <FaCar className="text-xl" />
              {isSidebarOpen && <span className="ml-4">Cars</span>}
            </button>
            <button
              onClick={() => setActiveSection("bike")}
              className={`w-full p-4 flex items-center ${activeSection === "bike" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-blue-50 hover:text-blue-600`}
            >
              <FaMotorcycle className="text-xl" /> 
              {isSidebarOpen && <span className="ml-4">Bikes</span>}
            </button>
            <button
              onClick={() => setActiveSection("bookings")}
              className={`w-full p-4 flex items-center ${activeSection === "bookings" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-blue-50 hover:text-blue-600`}
            >
              <FiBookOpen className="text-xl" />
              {isSidebarOpen && <span className="ml-4">Bookings</span>}
            </button>
            <button
              onClick={() => setActiveSection("helpline")}
              className={`w-full p-4 flex items-center ${activeSection === "helpline" ? "bg-blue-50 text-blue-600" : "text-gray-600"} hover:bg-blue-50 hover:text-blue-600`}
            >
              <FaHeadset className="text-xl" />
              {isSidebarOpen && <span className="ml-4">Helpline</span>}
            </button>
            
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <h1 className="text-2xl font-bold mb-8">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
  
          {activeSection === "dashboard" && <DashboardCards />}
          {activeSection === "users" && <UsersTable />}
          {activeSection === "car" && <CarSection />}
          {activeSection === "bike" && <BikeSection />}
          {activeSection === "bookings" &&  <BookingsTable 
            booking={booking}
            users={user}
            handleDeleteBooking={handleDeleteBooking}/>}
          {activeSection === "helpline" && <HelplineSection />}

          {/* Edit Vehicle Modal */}
          {isEditModalOpen && editingVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    Edit {editingVehicle.isBike ? "Bike" : "Car"} Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setEditingVehicle(null); }}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4 text-sm text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Vehicle Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded p-2"
                        value={editForm.vehicleName || ""}
                        onChange={(e) => setEditForm({ ...editForm, vehicleName: e.target.value })}
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Rent Price (Per Day - ₹) *</label>
                      <input
                        type="number"
                        required
                        min={100}
                        className="w-full border border-gray-300 rounded p-2"
                        value={editForm.rentPrice || ""}
                        onChange={(e) => setEditForm({ ...editForm, rentPrice: e.target.value })}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Category *</label>
                      {editingVehicle.isBike ? (
                        <select
                          className="w-full border border-gray-300 rounded p-2"
                          value={editForm.vehicleType || ""}
                          onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                        >
                          <option value="Sports">Sports Bike</option>
                          <option value="Cruiser">Cruiser</option>
                          <option value="Adventure">Adventure Tourer</option>
                          <option value="Scooter">Scooter</option>
                        </select>
                      ) : (
                        <select
                          className="w-full border border-gray-300 rounded p-2"
                          value={editForm.vehicleType || ""}
                          onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                        >
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Hatchback">Hatchback</option>
                          <option value="Convertible">Convertible</option>
                          <option value="Coupe">Coupe</option>
                        </select>
                      )}
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Fuel Type *</label>
                      <select
                        className="w-full border border-gray-300 rounded p-2"
                        value={editForm.fuelType || ""}
                        onChange={(e) => setEditForm({ ...editForm, fuelType: e.target.value })}
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* Range */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Range</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={editForm.range || ""}
                        onChange={(e) => setEditForm({ ...editForm, range: e.target.value })}
                      />
                    </div>

                    {/* Mileage */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Mileage</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={editForm.mileage || ""}
                        onChange={(e) => setEditForm({ ...editForm, mileage: e.target.value })}
                      />
                    </div>

                    {/* Car/Bike specific fields */}
                    {!editingVehicle.isBike ? (
                      <>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">Seats</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded p-2"
                            value={editForm.seats || ""}
                            onChange={(e) => setEditForm({ ...editForm, seats: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">Doors</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded p-2"
                            value={editForm.numberOfDoors || ""}
                            onChange={(e) => setEditForm({ ...editForm, numberOfDoors: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">Transmission</label>
                          <select
                            className="w-full border border-gray-300 rounded p-2"
                            value={editForm.transmissionType || ""}
                            onChange={(e) => setEditForm({ ...editForm, transmissionType: e.target.value })}
                          >
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-1">Luggage Capacity</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-2"
                            value={editForm.luggageCapacity || ""}
                            onChange={(e) => setEditForm({ ...editForm, luggageCapacity: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Engine displacement (cc)</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2"
                          value={editForm.cc || ""}
                          onChange={(e) => setEditForm({ ...editForm, cc: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Conditions */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Condition</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={editForm.conditions || ""}
                        onChange={(e) => setEditForm({ ...editForm, conditions: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Feature Checkboxes */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="font-semibold text-gray-700">Included Features</p>
                    {!editingVehicle.isBike ? (
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            checked={editForm.airConditioning || false}
                            onChange={(e) => setEditForm({ ...editForm, airConditioning: e.target.checked })}
                          />
                          Air Conditioning
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            checked={editForm.gpsNavigation || false}
                            onChange={(e) => setEditForm({ ...editForm, gpsNavigation: e.target.checked })}
                          />
                          GPS Navigation
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            checked={editForm.bluetooth || false}
                            onChange={(e) => setEditForm({ ...editForm, bluetooth: e.target.checked })}
                          />
                          Bluetooth
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            checked={editForm.sunroof || false}
                            onChange={(e) => setEditForm({ ...editForm, sunroof: e.target.checked })}
                          />
                          Sunroof
                        </label>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            checked={editForm.abs || false}
                            onChange={(e) => setEditForm({ ...editForm, abs: e.target.checked })}
                          />
                          ABS
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            checked={editForm.gpsNavigation || false}
                            onChange={(e) => setEditForm({ ...editForm, gpsNavigation: e.target.checked })}
                          />
                          GPS Mount
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            checked={editForm.topBox || false}
                            onChange={(e) => setEditForm({ ...editForm, topBox: e.target.checked })}
                          />
                          Top Box
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Photo Edit */}
                  <div className="border-t pt-4">
                    <label className="block text-gray-700 font-medium mb-1">Change Vehicle Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={(e) => setEditImageFile(e.target.files[0])}
                    />
                    {editingVehicle.imageId && !editImageFile && (
                      <p className="mt-2 text-xs text-gray-500">
                        Current Image ID: <span className="font-mono text-xs">{editingVehicle.imageId}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit / Cancel */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => { setIsEditModalOpen(false); setEditingVehicle(null); }}
                      className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default AdminPanel;
