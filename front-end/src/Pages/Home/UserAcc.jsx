import { useState, useRef, useEffect } from "react";
import defaultProfile from "../../assets/admin-dashboard-images/profile.png";
import { BiImageAdd } from "react-icons/bi";
import { useSelector } from "react-redux";
import { userAPI, handleAPIError } from "../../services/api.service";
import toast from "react-hot-toast";

export const UserAcc = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileImg, setProfileImg] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef(null);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      
      if (response.success) {
        const user = response.data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "",
          confirmPassword: "",
        });
        
        if (user.avatar) {
          setProfileImg(user.avatar);
        }
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    setSaving(true);

    try {
      const updates = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updates.password = formData.password;
      }

      if (profileImg !== defaultProfile) {
        updates.avatar = profileImg;
      }

      const response = await userAPI.updateProfile(updates);

      if (response.success) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setFormData((prev) => ({...prev, password: "", confirmPassword: ""}));
        fetchUserProfile();
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      toast.error(errorInfo.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchUserProfile();
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[91vh] bg-[#F4F8FD]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-[91vh] overflow-auto bg-[#F4F8FD] px-6">
      <div className="flex flex-col justify-center items-center gap-1 relative">
        <div className="relative w-20 h-20">
          <img src={profileImg} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          {editMode && (
            <>
              <button
                type="button"
                className="absolute bottom-1 right-1 bg-primary rounded-full p-1 shadow hover:bg-gray-100"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                aria-label="Edit profile image"
              >
                <BiImageAdd size={14} className="text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfileImgChange} className="hidden" />
            </>
          )}
        </div>
        <h1 className="text-xl mt-2">{formData.name || "User"}</h1>
        <p className="text-sm text-[#6B6B6B]">{auth.isAdmin ? "Admin" : "Member"}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Name</label>
          <input type="text" name="name" value={formData.name} disabled={!editMode} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2 disabled:opacity-100 disabled:text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Your Email</label>
          <input type="email" name="email" value={formData.email} disabled={!editMode} onChange={handleChange} className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2 disabled:opacity-100 disabled:text-black" />
        </div>

        {editMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your new password" className="mt-1 block w-full rounded-md border border-[#B7B7B7] bg-white shadow-sm p-2" />
            </div>
          </>
        )}

        {editMode ? (
          <div className="flex gap-3">
            <button onClick={handleCancel} disabled={saving} className="flex-1 py-2 rounded-md text-gray-700 font-medium bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#189EFE] to-[#0E5F98] hover:opacity-90 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)} className="w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#189EFE] to-[#0E5F98] hover:opacity-90">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};
