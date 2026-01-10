import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import logo from "../../assets/images/logo.png";
import Button from "../../components/Shared/Button";
import login from "../../assets/images/login.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../Stores/authSlice";
import { authAPI, handleAPIError } from "../../services/api.service";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user types
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        // Call API to login
        const response = await authAPI.login(formData.email, formData.password);

        if (response.success) {
          const userData = response.data;

          // Dispatch to Redux store
          dispatch(
            loginSuccess({
              user: userData.user,
              accessToken: userData.accessToken,
              refreshToken: userData.refreshToken,
            })
          );

          // Show success toast
          toast.success("Login successful!");

          // Check if user is admin and redirect accordingly
          if (userData.user?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        const errorInfo = handleAPIError(error);
        toast.error(errorInfo.message || "Login failed. Please try again.");
        console.error("Login error:", errorInfo);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
      // Show first error toast
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    toast("Google login coming soon!", { icon: "🔒" });
  };

  return (
    <div className="min-h-screen flex bg-login">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-gray"
                  }`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.password ? "border-red-500" : "border-gray"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
              <Link to={"/forgot-password"}>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary transition-colors"
                >
                  Forgot Password?
                </button>
              </Link>
            </div>

            {/* Login Button */}
            <div>
              <Button
                type="submit"
                rounded="lg"
                padding="px-4 py-2 w-full"
                disabled={loading}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-gray hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Login with Google</span>
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?
                <Link to={"/register"}>
                  <button
                    type="button"
                    className="text-primary hover:text-primary font-medium transition-colors ml-1"
                  >
                    Create a free account
                  </button>
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image Placeholder */}
      <div className="hidden border lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A9FFE] to-primary text-primary relative overflow-hidden">
        <img src={login} className="object-cover mx-auto" alt="login" />
      </div>
    </div>
  );
};

export default LoginForm;
