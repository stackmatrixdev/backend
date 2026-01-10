import { useState } from "react";
import profile from "../../../assets/admin-dashboard-images/profile.png";

export const Account = () => {
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "John Black",
    email: "example@gmail.com",
    password: "",
    confirmPassword: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle save
  const handleSave = () => {
    console.log("Saved Data:", formData);
    setEditMode(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-1">
        <img src={profile} alt="Profile" className="w-20 h-20 rounded-full" />
        <h1 className="text-xl mt-2">{formData.name}</h1>
        <p className="text-sm text-[#6B6B6B]">Admin</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled={!editMode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2 disabled:opacity-100 disabled:text-black"

          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={!editMode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2 disabled:opacity-100 disabled:text-black"

          />
        </div>

        {/* Passwords (only in edit mode) */}
        {editMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2 disabled:opacity-100 disabled:text-black"

              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2 disabled:opacity-100 disabled:text-black"

              />
            </div>
          </>
        )}

        {/* Button */}
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#189EFE] to-[#0E5F98]"
        >
          {editMode ? "Save" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};
