import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhone, FaEnvelope, FaClock, FaHeadset, FaCar } from "react-icons/fa";
import service from "../../appright/conf";
import { useSelector } from "react-redux";
import authService from "../../appright/auth";

const VehicleRentalSupport = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const reduxUserId = useSelector((state) => state.auth.userId);

  const getCurrentUser = async () => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      console.error("getCurrentUser error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData((prev) => ({
          ...prev,
          fullName: currentUser.name || prev.fullName,
          email: currentUser.email || prev.email,
        }));
      }
    };

    fetchUser();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Name must contain at least 2 characters, no numbers or special characters";
    }

    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.subject.trim().length < 5 || formData.subject.trim().length > 100) {
      newErrors.subject = "Subject must be between 5 and 100 characters";
    }

    if (formData.message.trim().length < 10 || formData.message.trim().length > 500) {
      newErrors.message = "Message must be between 10 and 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await service.helpline(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.subject,
        formData.message,
        user?.$id
      );

      if (res) {
        console.log(res);
        toast.success("Reported successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-red-100"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-gray-200">
        <div className="text-center mb-12 backdrop-blur-lg bg-white/70 rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Gearup Rental Support</h1>
          <p className="mt-4 text-lg text-gray-700">Have questions about your rental? We're here to help!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-200">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">Rental Support Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: "fullName", label: "Full Name *", type: "text", required: true },
                { id: "email", label: "Email Address *", type: "email", required: true },
                { id: "phone", label: "Phone Number (Optional)", type: "tel", required: false },
                { id: "subject", label: "Subject *", type: "text", required: true }
              ].map(({ id, label, type, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-800">{label}</label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 rounded-lg shadow-sm transition focus:ring-2 focus:ring-blue-500 ${
                      errors[id] ? 'border-red-500' : 'border-gray-300'
                    } border bg-white/90`}
                  />
                  {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-2 rounded-lg shadow-sm transition focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  } border bg-white/90`}
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold hover:from-blue-700 hover:to-blue-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-200">
            <div className="flex items-center mb-8">
              <FaCar className="text-4xl text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-blue-900">Rental Assistance</h2>
            </div>

            <div className="space-y-6 text-gray-800">
              <div className="flex items-start">
                <FaPhone className="text-xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <p>+91 8867022166</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaEnvelope className="text-xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p>info@gearup.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaClock className="text-xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaHeadset className="text-xl text-blue-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p>Chat with us for instant assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default VehicleRentalSupport;
