// frontend/src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios"; // Import axios

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_API_URL;

export const UserContextProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [userId, setUserId] = useState(null); // This will be the MongoDB _id
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        let currentDeviceId = localStorage.getItem(
          "personal_finance_device_id"
        );

        if (!currentDeviceId) {
          currentDeviceId = uuidv4();
          localStorage.setItem("personal_finance_device_id", currentDeviceId);
        }
        setDeviceId(currentDeviceId);

        // Use axios to send deviceId to the backend
        // Use the API_BASE_URL for your requests
        const response = await axios.post(`${API_BASE_URL}/api/users`, {
          deviceId: currentDeviceId,
        });

        const data = response.data; // Axios automatically parses JSON
        setUserId(data.userId); // Store the MongoDB _id
        console.log("Fetched/Created User ID (MongoDB _id):", data.userId);
        console.log("Device ID in context:", data.deviceId);
      } catch (err) {
        console.error("Failed to initialize user:", err);
        // Axios errors have a response.data field for backend messages
        setError(
          err.response?.data?.message ||
            "Failed to load user data. Please try again."
        );
      } finally {
        setLoadingUser(false);
      }
    };

    initializeUser();
  }, []);

  const value = {
    deviceId,
    // Add API_BASE_URL to context value if other components need it, otherwise omit
    // API_BASE_URL,
    userId,
    loadingUser,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
