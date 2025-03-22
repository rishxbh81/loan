import React, { useState, useEffect } from "react";
import axios from "axios";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.data || !response.data.profile) {
        throw new Error("No data received from server");
      }

      // Transform the profile data to match our form fields
      const transformedData = {
        ...response.data.profile,
        mobile_number: response.data.profile.phone,
        email_id: response.data.profile.email,
        current_address: response.data.profile.address,
        full_name: response.data.profile.name
      };

      console.log('Transformed Profile Data:', transformedData);
      setProfileData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch profile data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role"); // Get role from localStorage
      
      // Transform the data back to server format
      const submitData = {
        name: profileData.full_name || profileData.name,
        email: profileData.email_id || profileData.email,
        phone: profileData.mobile_number || profileData.phone,
        address: profileData.current_address || profileData.address,
        user_id: profileData.user_id,
        role: role // Add role to the request
      };

      console.log('Submitting data:', submitData);

      const response = await axios.patch(`${API_BASE_URL}auth/update-profile`, submitData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log('Update response:', response.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error('Update error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const steps = [
    { title: "Personal Information", fields: inputFieldConfig(false, true, profileData).slice(0, 8) },
    { title: "Employment & Income Details", fields: inputFieldConfig(false, true, profileData).slice(8, 18) },
    { title: "Banking & Financial Information", fields: inputFieldConfig(false, true, profileData).slice(18, 25) },
    { title: "KYC Details", fields: inputFieldConfig(false, true, profileData).slice(25) }
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {steps.map((stepData, index) =>
            step === index + 1 ? (
              <div key={index} className="space-y-6">
                <h3 className="text-xl font-semibold text-center mb-4">
                  {stepData.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stepData.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="block text-sm font-medium">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          id={field.id}
                          value={profileData[field.id] || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          id={field.id}
                          value={profileData[field.id] || ""}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full p-2 border rounded-md"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                    >
                      Previous
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                  {step < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            ) : null
          )}
        </form>
      )}
    </div>
  );
};

export default ProfileUpdate;
