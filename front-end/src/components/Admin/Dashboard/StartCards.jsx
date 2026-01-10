import Dashboard from "./MainDashboard";
import { useState, useEffect } from "react";
import { adminAPI } from "../../../services/api.service";

export const StartCards = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalSubscriptions: 0,
    loading: true,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true }));
      const response = await adminAPI.getDashboardStats();

      if (response.success && response.data) {
        setDashboardData({
          totalRevenue: response.data.overview?.totalRevenue || 0,
          totalUsers: response.data.overview?.totalUsers || 0,
          totalSubscriptions: response.data.overview?.totalSubscriptions || 0,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const dollarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 16 16"
    >
      <path
        fill="none"
        stroke="#4CAF50"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        d="M6 10h2.5c.55 0 1-.45 1-1s-.45-1-1-1h-1c-.55 0-1-.45-1-1s.45-1 1-1H10M8 4.5v1.167M8 9.5v2M14.5 8a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Z"
        strokeWidth={1}
      ></path>
    </svg>
  );
  const userIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 16 16"
    >
      <path
        fill="#2F89CA"
        d="M11 7c0 1.66-1.34 3-3 3S5 8.66 5 7s1.34-3 3-3s3 1.34 3 3"
      ></path>
      <path
        fill="#2F89CA"
        fillRule="evenodd"
        d="M16 8c0 4.42-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8M4 13.75C4.16 13.484 5.71 11 7.99 11c2.27 0 3.83 2.49 3.99 2.75A6.98 6.98 0 0 0 14.99 8c0-3.87-3.13-7-7-7s-7 3.13-7 7c0 2.38 1.19 4.49 3.01 5.75"
        clipRule="evenodd"
      ></path>
    </svg>
  );
  const membershipIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={36}
      viewBox="0 0 24 24"
    >
      <path
        fill="#FBBC04"
        d="M23 3v18H1V3zm-2 2H3v4h18zm0 6h-2v6.766l-3.5-2.1l-3.5 2.1V11H3v8h18zm-4 0h-3v3.234l1.5-.9l1.5.9z"
      ></path>
    </svg>
  );
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 mb-6 sm:mx-0 md:mx-20">
        {/* Revenue */}
        <div className="flex items-center justify-between gap-5 p-4 md:p-6 bg-[#EDF6ED] border border-white rounded-xl shadow-2xl">
          <div className="flex flex-col gap-3">
            <p className="bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] bg-clip-text text-transparent font-medium text-2xl">
              Total Revenue
            </p>
            <p className="text-black font-medium text-xl">
              {dashboardData.loading
                ? "Loading..."
                : formatCurrency(dashboardData.totalRevenue)}
            </p>
          </div>
          <div className="p-4 bg-[#D5FED7] rounded-xl shadow-md">
            {dollarIcon()}
          </div>
        </div>
        {/* Users */}
        <div className="flex items-center justify-between gap-5 p-6 bg-[#D5E9F8] border border-white rounded-xl shadow-2xl">
          <div className="flex flex-col gap-3">
            <p className="bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] bg-clip-text text-transparent font-medium text-2xl">
              Total User
            </p>
            <p className="text-black font-medium text-xl">
              {dashboardData.loading
                ? "Loading..."
                : dashboardData.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-[#92CFFB] rounded-xl shadow-md">
            {userIcon()}
          </div>
        </div>
        {/* Membership */}
        <div className="flex items-center justify-between gap-5 p-3 xl:p-6 bg-[#F1EDDF] border border-white rounded-xl shadow-2xl">
          <div className="flex flex-col gap-3">
            <p className="bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] bg-clip-text text-transparent font-medium text-2xl">
              Total Membership
            </p>
            <p className="text-black font-medium text-xl">
              {dashboardData.loading
                ? "Loading..."
                : dashboardData.totalSubscriptions.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-[#FFF0C4] rounded-xl shadow-md">
            {membershipIcon()}
          </div>
        </div>
      </div>
      <div>
        <Dashboard dashboardData={dashboardData} />
      </div>
    </div>
  );
};
