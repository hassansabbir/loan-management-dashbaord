import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LuSettings,
  LuLock,
  LuCamera,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import toast from "react-hot-toast";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/redux/apiSlices/authSlice";
import { imageUrl } from "@/redux/api/baseApi";

interface SettingsProps {
  defaultTab?: "profile" | "password";
}

const Settings: React.FC<SettingsProps> = ({ defaultTab = "profile" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state: "profile" | "password"
  const [activeTab, setActiveTab] = useState<"profile" | "password">(
    location.pathname === "/change-password" ? "password" : defaultTab
  );

  // Sync tab with URL if user navigates
  useEffect(() => {
    if (location.pathname === "/change-password") {
      setActiveTab("password");
    } else if (
      location.pathname === "/settings" ||
      location.pathname === "/personal-information"
    ) {
      setActiveTab("profile");
    }
  }, [location.pathname]);

  // Profile API
  const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const profile = profileResponse?.data;

  // Profile Form States
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate profile fields when fetched
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAddress(profile.address || "");
      setPhone(profile.phone || profile.contact || "");
      setEmail(profile.email || "");
      if (profile.image) {
        setPreviewUrl(
          profile.image.startsWith("http")
            ? profile.image
            : `${imageUrl}${profile.image}`
        );
      }
    }
  }, [profile]);

  // Handle avatar selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full Name is required");
      return;
    }

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      formData.append(
        "data",
        JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
        })
      );

      const res = await updateProfile(formData).unwrap();
      if (res.success || res.statusCode === 200) {
        toast.success("Personal information updated successfully!");
      } else {
        toast.success(res.message || "Profile updated!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  // Password Change Form States
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (res.success || res.statusCode === 200) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Review and manage revenue-based financing requests from growing enterprises.
        </p>
      </div>

      {/* Main Settings Layout: Left Sub-navigation Tabs + Right Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sub-navigation Tabs */}
        <div className="md:col-span-3 space-y-4">
          {/* Tab 1: Personal Information */}
          <div>
            <button
              type="button"
              onClick={() => {
                setActiveTab("profile");
                navigate("/settings");
              }}
              className={`flex items-center gap-2.5 text-sm font-semibold transition-colors cursor-pointer text-left w-full py-1 ${
                activeTab === "profile"
                  ? "text-[#1B64F2]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <LuSettings size={18} className={activeTab === "profile" ? "text-[#1B64F2]" : "text-gray-400"} />
              <span>Personal Information</span>
            </button>
            {activeTab === "profile" && (
              <div className="h-0.5 bg-[#1B64F2] w-28 mt-1.5 rounded-full" />
            )}
          </div>

          {/* Tab 2: Password Change */}
          <div>
            <button
              type="button"
              onClick={() => {
                setActiveTab("password");
                navigate("/change-password");
              }}
              className={`flex items-center gap-2.5 text-sm font-semibold transition-colors cursor-pointer text-left w-full py-1 ${
                activeTab === "password"
                  ? "text-[#1B64F2]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <LuLock size={18} className={activeTab === "password" ? "text-[#1B64F2]" : "text-gray-400"} />
              <span>Password Change</span>
            </button>
            {activeTab === "password" && (
              <div className="h-0.5 bg-[#1B64F2] w-28 mt-1.5 rounded-full" />
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9">
          {/* ========================================================================= */}
          {/* TAB 1: PERSONAL INFORMATION                                              */}
          {/* ========================================================================= */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Personal Information
              </h2>

              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-2xl">
                {isProfileLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-gray-200" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Avatar Upload */}
                    <div className="relative inline-block mb-2">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={name || "Profile"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-[#1B64F2]">
                            {name ? name.slice(0, 2).toUpperCase() : "AD"}
                          </span>
                        )}
                      </div>

                      {/* Camera Overlay Badge */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-rose-300 text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer shadow-xs transition-colors"
                        title="Upload Photo"
                      >
                        <LuCamera size={13} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Full Name Field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Address / Location Field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="71-75 Shelton Street, London"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 px-4 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Email Field (Read-only) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={email}
                        className="w-full h-11 px-4 bg-gray-100/70 border border-gray-200/60 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="px-8 py-2.5 rounded-xl bg-[#1B64F2] hover:bg-[#1451C9] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUpdatingProfile ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PASSWORD CHANGE                                                    */}
          {/* ========================================================================= */}
          {activeTab === "password" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Password Change
              </h2>

              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-2xl">
                <div className="mb-5">
                  <h3 className="text-base font-bold text-gray-900">
                    Choose a New Password
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Enter and confirm your new password to regain access
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <LuLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        placeholder="Enter your old password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showCurrentPass ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <LuLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <input
                        type={showNewPass ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showNewPass ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <LuLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 bg-[#F8FAFC] border border-gray-200/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1B64F2] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showConfirmPass ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-8 py-2.5 rounded-xl bg-[#1B64F2] hover:bg-[#1451C9] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isChangingPassword ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
