import React, { useState, useEffect, useCallback } from "react";
import { X, Lock, Check, Loader2 } from "lucide-react";
import { paymentAPI } from "../services/api.service";
import toast from "react-hot-toast";

const SubscriptionPopup = ({ programId, onClose }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const fetchPricingData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getPricing(programId);
      if (response.success) {
        setPricing(response.data);
      } else {
        toast.error("Failed to load pricing information");
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
      toast.error("Failed to load pricing information");
    } finally {
      setLoading(false);
    }
  }, [programId]);

  useEffect(() => {
    if (programId) {
      fetchPricingData();
    }
  }, [programId, fetchPricingData]);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      const response = await paymentAPI.createCheckoutSession(programId);

      if (response.success && response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        toast.error(response.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);

      if (error.response?.status === 401) {
        toast.error("Please login to purchase this course");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to process payment"
        );
      }
    } finally {
      setPurchasing(false);
    }
  };

  const features = [
    "Full access to all premium documentation",
    "Downloadable PDF resources",
    "Exclusive video tutorials",
    "Lifetime access to course updates",
    "Priority email support",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
          <Lock className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">Unlock Premium Content</h2>
          <p className="text-blue-100 text-sm">
            Get full access to this course&apos;s premium documentation
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Price Display */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900">
                  {pricing?.currency === "CAD" ? "CA$" : "$"}
                  {pricing?.price || pricing?.documentationPrice || "29.99"}
                </div>
                <p className="text-gray-500 text-sm mt-1">One-time payment</p>
                {pricing?.title && (
                  <p className="text-gray-600 mt-2 font-medium">
                    {pricing.title}
                  </p>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-900">
                  What&apos;s included:
                </h3>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Unlock Now
                  </>
                )}
              </button>

              {/* Maybe Later */}
              <button
                onClick={onClose}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
              >
                Maybe Later
              </button>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 Secure payment powered by Stripe
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
