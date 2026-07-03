import React, { useState } from 'react';
import { CreditCard, Shield, Lock, IndianRupee, ArrowLeft, Calendar, MapPin, Car } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import service from '../../appright/conf.js';
import authService from '../../appright/auth';

const Payment = () => {
  const { state: bookingDetails } = useLocation();
  const navigate = useNavigate();
  const reduxUserId = useSelector((state) => state.auth.userId);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <p className="text-lg font-medium text-gray-700">No booking details found. Please select a vehicle first.</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setPaymentData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleTermsChange = (e) => {
    setPaymentData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const { paymentMethod, cardNumber, expiryMonth, expiryYear, cvv, termsAccepted } = paymentData;

    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions.');
      return;
    }

    if (
      (paymentMethod === 'credit' || paymentMethod === 'debit') &&
      (!cardNumber || !expiryMonth || !expiryYear || !cvv)
    ) {
      toast.error('Please fill in all card details.');
      return;
    }

    setLoading(true);

    let userId = reduxUserId;
    if (!userId) {
      try {
        const currentUser = await authService.getCurrentUser();
        userId = currentUser?.$id;
        if (!userId) throw new Error("User session expired");
      } catch {
        toast.error("User session expired. Please log in again.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await service.bookingData(
        bookingDetails.vehicleName,
        bookingDetails.vehicleType,
        bookingDetails.fuelType,
        bookingDetails.rentPrice,
        bookingDetails.totalPrice,
        bookingDetails.fromDate,
        bookingDetails.toDate,
        bookingDetails.location,
        bookingDetails.vehicleId,
        cardNumber,
        expiryMonth,
        expiryYear,
        "pending",
        userId
      );

      if (response) {
        toast.success("Payment Successful & Booking Confirmed!", {
          position: "top-center",
          className: "bg-green-600 text-white font-bold rounded-lg shadow-lg",
          bodyClassName: "text-sm",
          progressClassName: "bg-white",
          theme: "light",
        });
        navigate("/receipt", {
          state: {
            vehicleName: bookingDetails.vehicleName,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            location: bookingDetails.location,
            totalAmount: bookingDetails.totalPrice,
            paymentMethod,
          },
        });
      } else {
        throw new Error("Server rejected booking creation.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment transaction failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-8 bg-fixed flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backgroundBlendMode: 'overlay'
      }}>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Summary Panel */}
        <div className="md:col-span-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-white/20">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium mb-6">
              <ArrowLeft size={16} /> Back to Booking
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Booking Summary</h2>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <Car className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Vehicle</p>
                  <p className="font-semibold text-gray-800 text-sm">{bookingDetails.vehicleName}</p>
                  <p className="text-xs text-gray-500">{bookingDetails.vehicleType} • {bookingDetails.fuelType}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Rental Period</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {bookingDetails.fromDate} to {bookingDetails.toDate}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pickup Location</p>
                  <p className="font-semibold text-gray-800 text-sm">{bookingDetails.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
              <span className="font-semibold text-blue-900 text-sm">Total Due</span>
              <span className="text-xl font-extrabold text-blue-900 flex items-center">
                <IndianRupee size={18} />
                {bookingDetails.totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Shield size={12} className="text-green-600" /> Fully secure SSL encrypted gateway
            </p>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="md:col-span-7 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Secure Checkout</h1>
          <p className="text-xs text-gray-500 mb-6">Fill out your details to finalize the security booking transaction.</p>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handleInputChange}
                  className="pl-11 w-full rounded-xl border border-gray-300 p-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  required
                >
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                </select>
              </div>
            </div>

            {/* Card details panel */}
            {(paymentData.paymentMethod === 'credit' || paymentData.paymentMethod === 'debit') && (
              <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Month</label>
                    <input
                      type="text"
                      name="expiryMonth"
                      maxLength={2}
                      value={paymentData.expiryMonth}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        if (parseInt(value) <= 12 || value === '') {
                          handleInputChange(e);
                        }
                      }}
                      placeholder="MM"
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expiry Year</label>
                    <input
                      type="text"
                      name="expiryYear"
                      value={paymentData.expiryYear}
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange(e);
                      }}
                      placeholder="YYYY"
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={paymentData.cvv}
                      maxLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                        handleInputChange(e);
                      }}
                      placeholder="XXX"
                      className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-center"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={paymentData.termsAccepted}
                onChange={handleTermsChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-600 leading-normal">
                By ticking, I authorize GearUp Secure to process this transaction and agree to the guidelines in the{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  Terms and Conditions
                </a>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !paymentData.termsAccepted}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg focus:outline-none hover:bg-blue-700 disabled:bg-gray-300 transition duration-150 text-sm cursor-pointer"
            >
              {loading ? (
                'Processing Transaction...'
              ) : (
                <>
                  <Lock size={16} /> Pay ₹{bookingDetails.totalPrice.toLocaleString()}
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Payment;
