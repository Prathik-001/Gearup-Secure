import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import service from "../../appright/conf";
import { useSelector } from "react-redux";
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
    cc: "",
    rentPrice: "",
    abs: false,
    gpsNavigation: false,
    topbox: false,
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
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

  const uploadImg = async (image) => {
    try {
      const res = await service.uploadFile(image);
      if (res) {
        return res.$id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const file = formData.image;
      const imgId = await uploadImg(file);

      if (imgId) {
        const res = await service.uploadBikeData(
          imgId,
          formData.vehicleName,
          formData.vehicleType,
          formData.fuelType,
          formData.range,
          formData.mileage,
          formData.cc,
          formData.rentPrice,
          formData.abs,
          formData.gpsNavigation,
          formData.topbox,
          formData.conditions,
          formData.rating,
          userId
        );

        if (res) {
          console.log(res);
            toast.success("Bike added successfully!", {
              position: "top-center",
              className: "bg-green-600 text-white font-bold rounded-lg shadow-lg",
              bodyClassName: "text-sm",
              progressClassName: "bg-white",
              theme: "light",
            });
          console.log(userId);
          
          setFormData({
            imageId: null,
            image: null,
            imagePreview: null,
            vehicleName: "",
            vehicleType: "",
            fuelType: "",
            transmissionType: "",
            range: "",
            mileage: "",
            cc: "",
            rentPrice: "",
            abs: false,
            gpsNavigation: false,
            topbox: false,
            conditions: "",
            rating: "",
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding vehicle. Please try again.", {
        position: "top-center",
        className: "bg-red-600 text-white font-bold rounded-lg shadow-lg",
        bodyClassName: "text-sm",
        progressClassName: "bg-white",
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Information and Rental Card</h2>

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
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
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
              {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Name *</label>
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.vehicleName && <p className="text-sm text-red-600">{errors.vehicleName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Type *</label>
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.vehicleType && <p className="text-sm text-red-600">{errors.vehicleType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fuel Type *</label>
                <input
                  type="text"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.fuelType && <p className="text-sm text-red-600">{errors.fuelType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Range</label>
                <input
                  type="number"
                  name="range"
                  value={formData.range}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700">CC</label>
                <input
                  type="number"
                  name="cc"
                  value={formData.cc}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mileage (km/l)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rent Price</label>
                <input
                  type="number"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

            <div className="space-y-4 pt-4">
              {["abs", "gpsNavigation", "topbox"].map((feature) => (
                <div key={feature} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{feature.replace(/([A-Z])/g, " $1")}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, [feature]: !prev[feature] }))
                    }
                  >
                    {formData[feature] ? (
                      <BsToggleOn className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <BsToggleOff className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700">Conditions</label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              {renderStarRating()}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRentalForm;
