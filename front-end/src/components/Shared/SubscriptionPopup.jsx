import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Lock,
  Sparkles,
  BookOpen,
  Bot,
  FileText,
  Award,
} from "lucide-react";
import { paymentAPI } from "../../services/api.service";
import toast from "react-hot-toast";

const SubscriptionPopup = ({
  isOpen,
  onClose,
  programId,
  programTitle,
  accessType = "documentation", // 'documentation', 'ai_coach', 'exam_simulator', 'full_access'
  onSuccess,
}) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(accessType);

  // Fetch pricing when popup opens
  useEffect(() => {
    const fetchPricingData = async () => {
      setLoading(true);
      try {
        const response = await paymentAPI.getPricing(programId);
        if (response.success) {
          setPricing(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
        toast.error("Failed to load pricing");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && programId) {
      fetchPricingData();
    }
  }, [isOpen, programId]);

  const handlePurchase = async (planAccessType) => {
    setProcessingPayment(true);
    try {
      const response = await paymentAPI.createCheckoutSession(
        programId,
        planAccessType
      );

      if (response.success && response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        toast.error(response.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
            "You already have access to this course"
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to process payment. Please try again.");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const getAccessIcon = (type) => {
    switch (type) {
      case "documentation":
        return <FileText className="w-6 h-6" />;
      case "ai_coach":
        return <Bot className="w-6 h-6" />;
      case "exam_simulator":
        return <BookOpen className="w-6 h-6" />;
      case "full_access":
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Lock className="w-6 h-6" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Premium Content</h2>
          </div>
          <p className="text-blue-100">
            Unlock access to {programTitle || "this course"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : pricing?.isFree ? (
            <div className="text-center py-12">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                This Course is Free!
              </h3>
              <p className="text-gray-600">
                You have full access to all content.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Continue Learning
              </button>
            </div>
          ) : (
            <>
              {/* Pricing Title */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose Your Plan
                </h3>
                <p className="text-gray-600">
                  One-time payment • Lifetime access • No recurring fees
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pricing?.options?.map((option) => (
                  <div
                    key={option.accessType}
                    className={`relative rounded-xl border-2 p-5 transition-all cursor-pointer ${
                      option.popular
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    } ${
                      selectedPlan === option.accessType
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedPlan(option.accessType)}
                  >
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Best Value
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                        option.popular
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getAccessIcon(option.accessType)}
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-1">
                      {option.name}
                    </h4>

                    <p className="text-sm text-gray-500 mb-3 min-h-[40px]">
                      {option.description}
                    </p>

                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ${option.price}
                      </span>
                      <span className="text-gray-500 ml-1">CAD</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {option.features?.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(option.accessType);
                      }}
                      disabled={processingPayment}
                      className={`w-full py-2.5 rounded-lg font-medium transition ${
                        option.popular
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {processingPayment ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        `Buy Now`
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Security Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    Secure Payment
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Lifetime Access
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    30-Day Money Back
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Powered by Stripe • Your payment info is never stored on our
                  servers
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
