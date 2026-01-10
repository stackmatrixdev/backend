import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import logo from "../../assets/images/logo.png";
import Button from "../../components/Shared/Button";
import login from "../../assets/images/login.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI, handleAPIError } from "../../services/api.service";

const OtpPage = () => {
  const [formData, setFormData] = useState({
    otp: ["", "", "", "", "", ""],
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("verifyEmail");
    if (!storedEmail) {
      toast.error("No email found. Please register first.");
      navigate("/register");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData((prev) => ({ ...prev, otp: newOtp }));

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine OTP digits
    const otpString = formData.otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);

    try {
      // Call API to verify OTP
      const response = await authAPI.verifyOtp(email, otpString);

      if (response.success) {
        toast.success("Email verified successfully!");

        // Clear stored email
        localStorage.removeItem("verifyEmail");

        // Redirect to login page
        navigate("/login");
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message || "Invalid OTP. Please try again.");
      console.error("OTP verification error:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-login font-Poppins">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center mt-20">
        <div className="w-full max-w-md">
          <Link to={"/"}>
            <div className="flex items-center justify-center space-x-2 mb-40">
              <img src={logo} className="w-16" alt="" />
              <p className="text-[#011F47] font-bold text-3xl">
                Learnin<span className="text-primary">GPT</span>
              </p>
            </div>
          </Link>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-[#3B76B7] mb-4">
                Enter OTP
              </h2>
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to {email}
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-14 h-14 text-center text-xl font-semibold border border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ))}
            </div>

            <div>
              <Button
                type="submit"
                padding="w-full py-2 px-2"
                rounded="lg"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
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

export default OtpPage;
