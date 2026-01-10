import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import logo from "../../assets/images/logo.png";
import Button from "../../components/Shared/Button";
import login from "../../assets/images/login.png";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Input */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#3B76B7] mb-4">
                Forget Password
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-10 border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@gmail.com"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                ></button>
              </div>
            </div>

            <div>
              <Link to={"/otp"}>
                <Button
                  padding="w-full py-2 px-2"
                  rounded="lg"
                  onClick={() => setCurrentPage("otp")}
                >
                  Get OTP
                </Button>
              </Link>
            </div>

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

export default LoginForm;
