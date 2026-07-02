import { useState, useEffect } from "react";
import { format } from "date-fns";
import service from "../../appright/conf";
import authService from "../../appright/auth";
import ActiveRental from "./activeRentalCard";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// Let's correct the icon imports from "react-icons/fa":
import {
  FaCar as CarIcon,
  FaHistory as HistoryIcon,
  FaCalendarAlt as CalendarIcon,
  FaUser as UserIcon,
  FaPhone as PhoneIcon,
  FaClock as ClockIcon,
  FaUpload as UploadIcon,
  FaShieldAlt as ShieldIcon,
  FaSpinner as SpinnerIcon,
  FaCheckCircle as CheckIcon,
  FaExclamationTriangle as AlertIcon,
  FaLock as LockIcon,
  FaMotorcycle as BikeIcon,
  FaCoins as CoinsIcon,
  FaTrash
} from "react-icons/fa";

const CarRentalDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [booking, setBooking] = useState([]);
  const [userData, setUserData] = useState(null);
  const today = new Date();

  // User listings state
  const [myListings, setMyListings] = useState([]);
  const [isListingsLoading, setIsListingsLoading] = useState(false);

  // Blockchain states
  const [blocks, setBlocks] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState({ tested: false, isValid: true, reason: "" });

  // Share Vehicle Form states
  const [shareType, setShareType] = useState("car"); // 'car' or 'bike'
  const [isUploading, setIsUploading] = useState(false);
  
  // Car form values
  const [carForm, setCarForm] = useState({
    vehicleName: "",
    vehicleType: "Sedan",
    fuelType: "Petrol",
    range: "",
    mileage: "",
    seats: 5,
    luggageCapacity: "",
    rentPrice: "",
    transmissionType: "Manual",
    numberOfDoors: 4,
    conditions: "Excellent",
    airConditioning: true,
    gpsNavigation: true,
    bluetooth: true,
    sunroof: false,
    imageFile: null
  });

  // Bike form values
  const [bikeForm, setBikeForm] = useState({
    vehicleName: "",
    vehicleType: "Sports",
    fuelType: "Petrol",
    range: "",
    mileage: "",
    cc: "",
    rentPrice: "",
    conditions: "Excellent",
    abs: true,
    gpsNavigation: false,
    topBox: false,
    imageFile: null
  });

  const loadUserBookings = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;
      setUserData(user);

      const allBookings = await service.getAllBookingsData();
      if (allBookings) {
        const userBookings = allBookings.filter(
          (booking) => booking.userId === user.$id
        );
        setBooking(userBookings);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    loadUserBookings();
  }, []);

  // Fetch blockchain ledger
  const fetchLedger = async () => {
    try {
      const blockHistory = await service.getBlockchainBlocks();
      setBlocks(blockHistory);
    } catch (error) {
      console.error("Failed to fetch blockchain:", error);
    }
  };

  const fetchMyListings = async () => {
    setIsListingsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;
      const listings = await service.getUserVehicles(user.$id);
      setMyListings(listings || []);
    } catch (error) {
      console.error("Failed to fetch user listings:", error);
      toast.error("Failed to load your listed vehicles.");
    } finally {
      setIsListingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "mylistings") {
      fetchMyListings();
    }
  }, [activeTab]);

  const handleToggleStatus = async (vehicleId, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const updated = await service.toggleVehicleStatus(vehicleId, nextStatus);
      if (updated) {
        toast.success(`Vehicle listing is now ${nextStatus === "active" ? "ON (Public)" : "OFF (Private)"}.`);
        setMyListings(prev =>
          prev.map(v => (v.$id === vehicleId ? { ...v, status: nextStatus } : v))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update vehicle sharing status.");
    }
  };

  const handleDeleteListing = async (vehicleId, isBike) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This vehicle listing will be permanently deleted and removed from available rentals!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        if (isBike) {
          await service.deleteBike(vehicleId);
        } else {
          await service.deleteCar(vehicleId);
        }
        await Swal.fire("Deleted!", "Your vehicle listing has been deleted successfully.", "success");
        setMyListings(prev => prev.filter(v => v.$id !== vehicleId));
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete the vehicle listing.", "error");
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Booking will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await service.deleteBooking(id);
        await Swal.fire(
          "Deleted!",
          "The Booking has been deleted successfully. Refund will be processed within 24 hours.",
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

  const handleAuditChain = async () => {
    setIsValidating(true);
    try {
      const result = await service.validateBlockchain();
      setValidationResult({
        tested: true,
        isValid: result.isValid,
        reason: result.reason || ""
      });
      if (result.isValid) {
        Swal.fire({
          title: "Ledger Audited!",
          text: "All SHA-256 block hashes are intact. Zero tampering detected.",
          icon: "success",
          confirmButtonColor: "#10B981"
        });
      } else {
        Swal.fire({
          title: "Security Alert!",
          text: `Tampering detected at block #${result.errorIndex}! Details: ${result.reason}`,
          icon: "error",
          confirmButtonColor: "#EF4444"
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Cryptographic audit failed.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    const form = shareType === "car" ? carForm : bikeForm;
    
    if (!form.vehicleName || !form.rentPrice || !form.imageFile) {
      return Swal.fire("Error", "Please fill in all required fields and upload an image.", "error");
    }

    setIsUploading(true);
    try {
      // 1. Upload file
      const uploadRes = await service.uploadFile(form.imageFile);
      if (!uploadRes || !uploadRes.fileId) {
        throw new Error("Image file upload failed.");
      }

      // 2. Upload vehicle data
      let response;
      if (shareType === "car") {
        response = await service.uploadData(
          uploadRes.fileId,
          form.vehicleName,
          form.vehicleType,
          form.fuelType,
          form.range,
          form.mileage,
          form.seats,
          form.luggageCapacity,
          form.rentPrice,
          form.airConditioning,
          form.gpsNavigation,
          form.bluetooth,
          form.sunroof,
          form.transmissionType,
          form.numberOfDoors,
          form.conditions,
          5, // Default rating
          userData?.$id,
          "active"
        );
      } else {
        response = await service.uploadBikeData(
          uploadRes.fileId,
          form.vehicleName,
          form.vehicleType,
          form.fuelType,
          form.range,
          form.mileage,
          form.cc,
          form.rentPrice,
          form.abs,
          form.gpsNavigation,
          form.topBox,
          form.conditions,
          5,
          userData?.$id,
          "active"
        );
      }

      if (response) {
        Swal.fire("Success", "Your vehicle has been shared successfully!", "success");
        // Reset forms
        if (shareType === "car") {
          setCarForm({
            vehicleName: "",
            vehicleType: "Sedan",
            fuelType: "Petrol",
            range: "",
            mileage: "",
            seats: 5,
            luggageCapacity: "",
            rentPrice: "",
            transmissionType: "Manual",
            numberOfDoors: 4,
            conditions: "Excellent",
            airConditioning: true,
            gpsNavigation: true,
            bluetooth: true,
            sunroof: false,
            imageFile: null
          });
        } else {
          setBikeForm({
            vehicleName: "",
            vehicleType: "Sports",
            fuelType: "Petrol",
            range: "",
            mileage: "",
            cc: "",
            rentPrice: "",
            conditions: "Excellent",
            abs: true,
            gpsNavigation: false,
            topBox: false,
            imageFile: null
          });
        }
        document.getElementById("vehicleImage").value = "";
      } else {
        throw new Error("Vehicle registration failed on server.");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Registration Failed", error.message || "An error occurred.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const activeBookings = booking.filter(
    (rental) =>
      new Date(rental.startDate) <= today &&
      new Date(rental.endDate) >= today
  );

  const upcomingBookings = booking.filter(
    (rental) => new Date(rental.startDate) > today
  );

  const expiredBookings = booking.filter(
    (rental) => new Date(rental.endDate) < today
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-indigo-900 flex items-center gap-2">
            <ShieldIcon className="text-blue-600" /> GearUp Secure
          </h1>
          <div className="flex flex-col space-y-2">
            {[
              { id: "profile", icon: UserIcon, label: "Profile" },
              { id: "active", icon: CarIcon, label: "Active Rental" },
              { id: "upcoming", icon: CalendarIcon, label: "Upcoming" },
              { id: "history", icon: HistoryIcon, label: "History" },
              { id: "mylistings", icon: CoinsIcon, label: "My Listings" },
              { id: "share", icon: UploadIcon, label: "Share Vehicle" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 p-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-2 border-t border-gray-100 text-center">
          <span className="text-xs text-gray-400 font-mono">Secured with SHA-256</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {userData?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData?.name || "User"}
                    </h2>
                    <p className="text-gray-500">{userData?.email}</p>
                    <p className="text-sm mt-1 text-gray-400">
                      Session ID: <span className="font-mono text-xs">{userData?.$id}</span>
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      Verified Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <CarIcon className="text-2xl text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-700">Total Rentals</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{booking.length}</p>
                </div>
                <div className="p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <ClockIcon className="text-2xl text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-700">Active Rentals</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{activeBookings.length}</p>
                </div>
                <div className="p-6 rounded-lg bg-white shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <CalendarIcon className="text-2xl text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-700">Upcoming Rentals</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{upcomingBookings.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "active" && (
            <div>
              {activeBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                  <PhoneIcon className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-xl font-medium">No Active Booking Found</p>
                </div>
              ) : (
                activeBookings.map((u) => (
                  <div key={u.$id} className="mt-3 rounded-lg shadow-md hover:shadow-lg">
                    <ActiveRental rental={u} onDelete={handleDeleteBooking} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "upcoming" && (
            <div>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                  <CalendarIcon className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-xl font-medium">No Upcoming Bookings</p>
                </div>
              ) : (
                upcomingBookings.map((u) => (
                  <div key={u.$id} className="mt-3 rounded-lg shadow-md hover:shadow-lg">
                    <ActiveRental rental={u} onDelete={handleDeleteBooking} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="rounded-lg bg-white shadow-lg overflow-hidden border border-gray-100">
              <h2 className="text-xl font-bold p-6 border-b border-gray-100 text-gray-800">
                Rental History
              </h2>
              {expiredBookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <HistoryIcon className="mx-auto text-6xl text-gray-300 mb-4" />
                  No rental history found.
                </div>
              ) : (
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiredBookings.map((rental) => (
                      <tr key={rental.$id} className="border-t border-gray-200 hover:bg-gray-50 text-sm">
                        <td className="px-6 py-4">{format(new Date(rental.startDate), "PP")}</td>
                        <td className="px-6 py-4">{format(new Date(rental.endDate), "PP")}</td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{rental.vehicleName || "Unknown Vehicle"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Share Vehicle Tab */}
          {activeTab === "share" && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950 flex items-center gap-2">
                    <UploadIcon className="text-blue-600" /> Share Your Vehicle
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Upload your unused car or bike so other members can rent it out. Listings are verified and anchored in the trust ledger.
                  </p>
                </div>
                
                {/* Share Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setShareType("car")}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                      shareType === "car" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <CarIcon /> Car
                  </button>
                  <button
                    onClick={() => setShareType("bike")}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                      shareType === "bike" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <BikeIcon /> Bike
                  </button>
                </div>
              </div>

              <form onSubmit={handleShareSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Vehicle Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tesla Model 3 / Royal Enfield"
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm shadow-sm focus:ring focus:ring-blue-100"
                      value={shareType === "car" ? carForm.vehicleName : bikeForm.vehicleName}
                      onChange={(e) => shareType === "car" 
                        ? setCarForm({ ...carForm, vehicleName: e.target.value })
                        : setBikeForm({ ...bikeForm, vehicleName: e.target.value })
                      }
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    {shareType === "car" ? (
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={carForm.vehicleType}
                        onChange={(e) => setCarForm({ ...carForm, vehicleType: e.target.value })}
                      >
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Coupe">Coupe</option>
                      </select>
                    ) : (
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={bikeForm.vehicleType}
                        onChange={(e) => setBikeForm({ ...bikeForm, vehicleType: e.target.value })}
                      >
                        <option value="Sports">Sports Bike</option>
                        <option value="Cruiser">Cruiser</option>
                        <option value="Adventure">Adventure Tourer</option>
                        <option value="Scooter">Scooter</option>
                      </select>
                    )}
                  </div>

                  {/* Rent Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rent Price (Per Day - Rs.) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      placeholder="Price in Rs."
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={shareType === "car" ? carForm.rentPrice : bikeForm.rentPrice}
                      onChange={(e) => shareType === "car"
                        ? setCarForm({ ...carForm, rentPrice: e.target.value })
                        : setBikeForm({ ...bikeForm, rentPrice: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={shareType === "car" ? carForm.fuelType : bikeForm.fuelType}
                      onChange={(e) => shareType === "car"
                        ? setCarForm({ ...carForm, fuelType: e.target.value })
                        : setBikeForm({ ...bikeForm, fuelType: e.target.value })
                      }
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Range (e.g. 500 km)</label>
                    <input
                      type="text"
                      placeholder="Range"
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={shareType === "car" ? carForm.range : bikeForm.range}
                      onChange={(e) => shareType === "car"
                        ? setCarForm({ ...carForm, range: e.target.value })
                        : setBikeForm({ ...bikeForm, range: e.target.value })
                      }
                    />
                  </div>

                  {/* Mileage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mileage (e.g. 15 km/l)</label>
                    <input
                      type="text"
                      placeholder="Mileage"
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={shareType === "car" ? carForm.mileage : bikeForm.mileage}
                      onChange={(e) => shareType === "car"
                        ? setCarForm({ ...carForm, mileage: e.target.value })
                        : setBikeForm({ ...bikeForm, mileage: e.target.value })
                      }
                    />
                  </div>

                  {/* Car Seats or Bike CC */}
                  {shareType === "car" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Seats</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={carForm.seats}
                        onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Engine Displacement (cc)</label>
                      <input
                        type="number"
                        placeholder="e.g. 350"
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={bikeForm.cc}
                        onChange={(e) => setBikeForm({ ...bikeForm, cc: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Spec Fields for Cars */}
                {shareType === "car" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transmission</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={carForm.transmissionType}
                        onChange={(e) => setCarForm({ ...carForm, transmissionType: e.target.value })}
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Doors</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={carForm.numberOfDoors}
                        onChange={(e) => setCarForm({ ...carForm, numberOfDoors: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Luggage (e.g. 2 bags)</label>
                      <input
                        type="text"
                        placeholder="Luggage volume"
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={carForm.luggageCapacity}
                        onChange={(e) => setCarForm({ ...carForm, luggageCapacity: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* Features Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-semibold">Included Features</label>
                  {shareType === "car" ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          checked={carForm.airConditioning}
                          onChange={(e) => setCarForm({ ...carForm, airConditioning: e.target.checked })}
                        />
                        Air Conditioning
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 h-4 w-4"
                          checked={carForm.gpsNavigation}
                          onChange={(e) => setCarForm({ ...carForm, gpsNavigation: e.target.checked })}
                        />
                        GPS Navigation
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 h-4 w-4"
                          checked={carForm.bluetooth}
                          onChange={(e) => setCarForm({ ...carForm, bluetooth: e.target.checked })}
                        />
                        Bluetooth Connect
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 h-4 w-4"
                          checked={carForm.sunroof}
                          onChange={(e) => setCarForm({ ...carForm, sunroof: e.target.checked })}
                        />
                        Panoramic Sunroof
                      </label>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 h-4 w-4"
                          checked={bikeForm.abs}
                          onChange={(e) => setBikeForm({ ...bikeForm, abs: e.target.checked })}
                        />
                        Dual ABS
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 h-4 w-4"
                          checked={bikeForm.gpsNavigation}
                          onChange={(e) => setBikeForm({ ...bikeForm, gpsNavigation: e.target.checked })}
                        />
                        GPS Mount
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 h-4 w-4"
                          checked={bikeForm.topBox}
                          onChange={(e) => setBikeForm({ ...bikeForm, topBox: e.target.checked })}
                        />
                        Top Luggage Box
                      </label>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Image *</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="mb-2 text-sm text-gray-500 font-medium">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 font-mono">PNG, JPG, JPEG, WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        id="vehicleImage"
                        type="file"
                        required
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (shareType === "car") {
                            setCarForm({ ...carForm, imageFile: file });
                          } else {
                            setBikeForm({ ...bikeForm, imageFile: file });
                          }
                        }}
                      />
                    </label>
                  </div>
                  {(shareType === "car" ? carForm.imageFile : bikeForm.imageFile) && (
                    <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                      <CheckIcon /> Selected Image: {(shareType === "car" ? carForm.imageFile : bikeForm.imageFile).name}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <SpinnerIcon className="animate-spin text-lg" /> Uploading specifications and image...
                    </>
                  ) : (
                    <>
                      <LockIcon /> List and Lock Vehicle
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "mylistings" && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950 flex items-center gap-2">
                    <CoinsIcon className="text-blue-600" /> My Shared Listings
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage the cars and bikes you have listed for rent. Toggle them ON to share, or OFF to pause listings.
                  </p>
                </div>
              </div>

              {isListingsLoading ? (
                <div className="text-center py-12">
                  <SpinnerIcon className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">Loading your listed vehicles...</p>
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <CarIcon className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">You haven't shared any vehicles yet.</p>
                  <button
                    onClick={() => setActiveTab("share")}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Share your first vehicle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((vehicle) => (
                    <div
                      key={vehicle.$id}
                      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                    >
                      <div className="h-44 bg-gray-100 relative">
                        <img
                          src={service.getFilePreiview(vehicle.imageId)}
                          alt={vehicle.vehicleName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7";
                          }}
                        />
                        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-blue-700 border border-blue-100">
                          {vehicle.isBike ? "Bike" : "Car"}
                        </span>
                      </div>
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{vehicle.vehicleName}</h3>
                          <p className="text-sm text-gray-500">{vehicle.vehicleType} • {vehicle.fuelType}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-b border-gray-100 py-3">
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Price per day</p>
                            <p className="text-lg font-extrabold text-blue-700">₹{vehicle.rentPrice}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium text-right">Condition</p>
                            <p className="text-sm font-semibold text-gray-700 text-right">{vehicle.conditions}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          {/* Toggle Switch */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">Listed:</span>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(vehicle.$id, vehicle.status)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                vehicle.status === "active" ? "bg-green-500" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  vehicle.status === "active" ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-xs font-bold ${
                                vehicle.status === "active" ? "text-green-600" : "text-gray-400"
                              }`}
                            >
                              {vehicle.status === "active" ? "ON" : "OFF"}
                            </span>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteListing(vehicle.$id, vehicle.isBike)}
                            className="p-2 text-gray-400 hover:text-red-600 transition"
                            title="Delete Listing"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRentalDashboard;
