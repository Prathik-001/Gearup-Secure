import { useState, useCallback } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import service from "../../appright/conf";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";


const VehicleRentalForm = () => {
  const userId = useSelector((state) => state.auth.userId); 
  const [formData, setFormData] = useState({
    imageId: null,
    image: null,
    imagePreview: null,
    vehicleName: "",
    vehicleType: "",
    fuelType: "",
    range: "",
    mileage: "",
    seats: "",
    luggageCapacity: "",
    rentPrice: "",
    airConditioning: false,
    gpsNavigation: false,
    bluetooth: false,
    sunroof: false,
    transmissionType: "",
    numberOfDoors: "",
    conditions: "",
    rating: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "File size should be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleName) newErrors.vehicleName = "Vehicle name is required";
    if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!formData.fuelType) newErrors.fuelType = "Fuel type is required";
    if (!formData.transmissionType) newErrors.transmissionType = "Transmission type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isHalfStar = formData.rating + 0.5 === star;
          const isFilledStar = formData.rating >= star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="text-yellow-400 text-xl focus:outline-none"
            >
              {isFilledStar ? (
                <FaStar />
              ) : isHalfStar ? (
                <FaStarHalfAlt />
              ) : (
                <FaRegStar />
              )}
            </button>
          );
        })}
      </div>
    );
  };
  
  const uploadImg = async(image) =>{
    try {
      const res = await service.uploadFile(image);
      if(res){
        console.log(res);
        return res.$id;
      }
     } catch (error) {
      console.log(error);
      
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const file = formData.image;
      const imgId = await uploadImg(file);
      if (imgId) {
        const res = await service.uploadData(
          imgId,
          formData.vehicleName,
          formData.vehicleType,
          formData.fuelType,
          formData.range,
          formData.mileage,
          formData.seats,
          formData.luggageCapacity,
          formData.rentPrice,
          formData.airConditioning,
          formData.gpsNavigation,
          formData.bluetooth,
          formData.sunroof,
          formData.transmissionType,
          formData.numberOfDoors,
          formData.conditions,
          formData.rating,
          userId // Pass the logged-in user ID
        )
          if(res){
            console.log(res);
            toast.success("Car added successfully!", {
              position: "top-center",
              className: "bg-green-600 text-white font-bold rounded-lg shadow-lg",
              bodyClassName: "text-sm",
              progressClassName: "bg-white",
              theme: "light",
            });
            setFormData({
              imageId: null,
              image:null,
              imagePreview: null,
              vehicleName: "",
              vehicleType: "",
              fuelType: "",
              range: "",
              mileage: "",
              seats: "",
              luggageCapacity: "",
              rentPrice: "",
              airConditioning: false,
              gpsNavigation: false,
              bluetooth: false,
              sunroof: false,
              transmissionType: "",
              numberOfDoors: "",
              conditions: "",
              rating: "",
            })
          }
        }
 
      } catch (error) {
      toast.error("Error adding vehicle. Please try again.", {
        position: "top-center",
        className: "bg-red-600 text-white font-bold rounded-lg shadow-lg",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
        theme: "light",
      });
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    };
    
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form  className="space-y-8 divide-y divide-gray-200" onSubmit={(e)=>handleSubmit(e)}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Information and Rental Card</h2>
              <p className="mt-1 text-sm text-gray-500">Please fill in the vehicle details below.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Image *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="mx-auto h-64 w-auto rounded-md"
                      />
                    ) : (
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                  </div>
                </div>
                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Name *</label>
                  <input
                    type="text"
                    name="vehicleName"
                    value={formData.vehicleName}
                    onChange={handleInputChange}
                    maxLength={50}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.vehicleName && (
                    <p className="mt-2 text-sm text-red-600">{errors.vehicleName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Type *</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.vehicleType && (
                    <p className="mt-2 text-sm text-red-600">{errors.vehicleType}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Luggage Capacity (Liters)</label>
                  <input
                    type="number"
                    name="luggageCapacity"
                    value={formData.luggageCapacity}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mileage (km/l)</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Doors</label>
                  <input
                    type="number"
                    name="numberOfDoors"
                    value={formData.numberOfDoors}
                    onChange={handleInputChange}
                    min="2"
                    max="5"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuel Type *</label>
                  <input
                  type="text"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.fuelType && (
                    <p className="mt-2 text-sm text-red-600">{errors.fuelType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Transmission Type *</label>
                  <input
                  type="text"
                    name="transmissionType"
                    value={formData.transmissionType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Range</label>
                  <input
                    type="number"
                    name="range"
                    value={formData.range}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Rent Price (per day)</label>
                <input
                  type="number"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Air Conditioning</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, airConditioning: !formData.airConditioning })
                    }
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {formData.airConditioning ? (
                      <BsToggleOn className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <BsToggleOff className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-gray-700">GPS Navigation</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, gpsNavigation: !formData.gpsNavigation })
                    }
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {formData.gpsNavigation ? (
                      <BsToggleOn className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <BsToggleOff className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Entertiment</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, bluetooth: !formData.bluetooth })
                    }
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {formData.bluetooth ? (
                      <BsToggleOn className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <BsToggleOff className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Sunroof</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, sunroof: !formData.sunroof })
                    }
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {formData.sunroof ? (
                      <BsToggleOn className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <BsToggleOff className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Conditions</label>
                <textarea
                  name="conditions"
                  value={formData.conditions}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter any additional rental conditions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                {renderStarRating()}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRentalForm;