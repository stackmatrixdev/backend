import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { ScrollRestoration } from "react-router-dom";
import Swal from "sweetalert2";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    areaOfExpertise: "",
    bio: "",
    portfolio: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      portfolio: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      areaOfExpertise: "",
      bio: "",
      portfolio: null,
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    Swal.fire({
      title: "Thank you for joining LearninGPT as an instructor. ",
      text: "Your registration has been received successfully. We look forward to working with you to empower learners worldwide.",
      icon: "success",
      draggable: true,
    });
    resetForm()
  }

  return (
    <div className=" mx-auto p-8 bg-[#EFF4FF] rounded-lg shadow-sm">
      <ScrollRestoration />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto my-10"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#585757] mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#585757] mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="areaOfExpertise"
            className="block text-sm font-medium text-[#585757] mb-2"
          >
            Area Of Expertise
          </label>
          <input
            type="text"
            id="areaOfExpertise"
            name="areaOfExpertise"
            value={formData.areaOfExpertise}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-[#585757] mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="portfolio"
            className="block text-sm font-medium text-[#585757] mb-2"
          >
            Upload your Portfolio
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="file"
                id="portfolio"
                name="portfolio"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              <label
                htmlFor="portfolio"
                className="flex items-center justify-between bg-white w-full px-3 py-2 border border-gray/50 rounded-md cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
              >
                <div className="flex items-center gap-2">
                  <MdOutlineFileUpload className="text-xl text-[#A9ACB4]" />
                  <span className="text-[#A9ACB4]">
                    {formData.portfolio
                      ? formData.portfolio.name
                      : "Select and upload file"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("portfolio")?.click()}
                  className="bg-primary text-white px-4 py-1 rounded-2xl text-sm transition-colors"
                >
                  Choose File
                </button>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue/50 text-white py-3 rounded-md font-medium transition-colors"
        >
          {isSubmitting ? "Registering..." : "Registration"}
        </button>
      </form>
    </div>
  );
}
