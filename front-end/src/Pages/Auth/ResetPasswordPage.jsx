import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import logo from "../../assets/images/logo.png";
import Button from "../../components/Shared/Button";
import login from "../../assets/images/login.png";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Password Changed!",
      text: "Your password has been changed successfully.",
      icon: "success",
      draggable: true,
    });
    navigate("/login");
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log("Login successful:", formData);
      // 🔥 Here you can call API or redirect user
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex bg-login font-Poppins">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center mt-20">
        <div className="w-full max-w-md">
          <Link to={"/"}>
            <div className="flex items-center justify-center space-x-2 mb-20">
              <img src={logo} className="w-16" alt="logo" />
              <p className="text-[#011F47] font-bold text-3xl">
                Learnin<span className="text-primary">GPT</span>
              </p>
            </div>
          </Link>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-[#3B76B7] mb-4">
                Reset Password
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <Button
              padding="w-full py-2 px-2"
              rounded="lg"
              onClick={() => setCurrentPage("otp")}
            >
              Reset
            </Button>

            {/* <div className="text-center mx-auto border">
              <button
                onClick={() => setCurrentPage("login")}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </div> */}
          </form>
        </div>
      </div>

      {/* Right Side - Image Placeholder */}
      <div className="hidden border lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A9FFE] to-primary text-primary relative overflow-hidden">
        <img src={login} className="object-cover mx-auto" alt="" />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
