import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import profileImg from "../../assets/admin-dashboard-images/profile.png";
import { subscriptionAPI, handleAPIError } from "../../services/api.service";
import toast from "react-hot-toast";

export default function Plan() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const user = auth.user;

  useEffect(() => {
    fetchUserSubscription();
  }, []);

  const fetchUserSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionAPI.getUserSubscription();
      
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      console.error("Failed to fetch subscription:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getPlanDisplayName = (planType) => {
    const planNames = {
      "exam-only": "Exam Preparation",
      "ai-only": "AI Study Coach",
      "full-access": "Full Access",
      "free": "Free Plan"
    };
    return planNames[planType] || planType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[91vh] bg-[#F4F8FD]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 xl:p-6 h-[91vh] overflow-auto bg-[#F4F8FD]">
      <div className="flex flex-col justify-center items-center gap-1 relative my-10">
        <div className="relative w-20 h-20">
          <img
            src={user?.avatar || profileImg}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <h1 className="text-xl mt-2">{user?.name || "User"}</h1>
        <p className="text-sm text-[#6B6B6B]">
          {subscription?.hasSubscription ? `${getPlanDisplayName(subscription.subscription?.plan?.type)} Member` : "Free Member"}
        </p>
      </div>

      {!subscription?.hasSubscription ? (
        <div className="w-full lg:max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">Free Plan</h2>
            <p className="text-gray-700 mb-4">You are currently on our free plan</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary mb-2">📝 Quizzes</h3>
                <p className="text-sm text-gray-600">3 free quizzes per month</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary mb-2">🤖 AI Chat</h3>
                <p className="text-sm text-gray-600">3 free AI chats per month</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-primary mb-2">📚 Programs</h3>
                <p className="text-sm text-gray-600">Basic programs only</p>
              </div>
            </div>
            <button 
              className="mt-6 px-6 py-2 bg-gradient-to-r from-[#189EFE] to-[#0E5F98] text-white rounded-lg hover:opacity-90"
              onClick={() => toast.info("Upgrade feature coming soon!")}
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="bg-blue-100 border border-blue-200 rounded-t-lg p-4 w-full lg:max-w-4xl mx-auto">
            <div className="grid grid-cols-5 gap-4 font-medium text-gray-700">
              <div>Plan Name</div>
              <div>Type</div>
              <div>Price</div>
              <div>Billing</div>
              <div>Status</div>
            </div>
          </div>

          <div className="bg-white border border-blue-200 border-t-0 rounded-b-lg p-4 lg:max-w-4xl mx-auto">
            <div className="grid grid-cols-5 gap-4 items-center">
              <div className="font-medium text-gray-900">
                {subscription.subscription?.plan?.name || "N/A"}
              </div>
              <div className="font-medium text-gray-900">
                {getPlanDisplayName(subscription.subscription?.plan?.type)}
              </div>
              <div className="text-gray-700">
                ${subscription.subscription?.plan?.price?.toFixed(2) || "0.00"} {subscription.subscription?.plan?.currency || "USD"}
              </div>
              <div className="text-gray-700 capitalize">
                {subscription.subscription?.plan?.billingCycle || "monthly"}
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  subscription.subscription?.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {subscription.subscription?.status?.toUpperCase() || "INACTIVE"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <p className="font-medium">{formatDate(subscription.subscription?.startDate)}</p>
                </div>
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <p className="font-medium">{formatDate(subscription.subscription?.endDate)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Auto Renew:</span>
                  <p className="font-medium">{subscription.subscription?.autoRenew ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <p className="font-medium capitalize">{subscription.subscription?.payment?.paymentMethod || "N/A"}</p>
                </div>
              </div>
            </div>

            {subscription.subscription?.features && subscription.subscription.features.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Plan Features:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subscription.subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
