// src/components/Auth/AuthDebugger.jsx
// This component helps you see the current authentication state
// Remove this in production!

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Stores/authSlice";

const AuthDebugger = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  // Don't show in production
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm">🔐 Auth Status (Dev Only)</h3>
        <button
          onClick={() =>
            document.getElementById("auth-debugger").classList.toggle("hidden")
          }
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="text-xs space-y-2" id="auth-debugger">
        <div>
          <span className="font-semibold">Authenticated:</span>{" "}
          <span
            className={auth.isAuthenticated ? "text-green-400" : "text-red-400"}
          >
            {auth.isAuthenticated ? "✓ Yes" : "✗ No"}
          </span>
        </div>

        <div>
          <span className="font-semibold">Is Admin:</span>{" "}
          <span className={auth.isAdmin ? "text-green-400" : "text-gray-400"}>
            {auth.isAdmin ? "✓ Yes" : "✗ No"}
          </span>
        </div>

        {auth.user && (
          <div>
            <span className="font-semibold">User:</span>
            <div className="bg-gray-800 p-2 rounded mt-1 text-xs overflow-auto max-h-32">
              <pre>{JSON.stringify(auth.user, null, 2)}</pre>
            </div>
          </div>
        )}

        {auth.accessToken && (
          <div>
            <span className="font-semibold">Access Token:</span>
            <div className="bg-gray-800 p-2 rounded mt-1 text-xs truncate">
              {auth.accessToken.substring(0, 50)}...
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;
