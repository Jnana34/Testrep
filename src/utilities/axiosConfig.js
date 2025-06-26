// src/utilities/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/", // or your API domain
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 👈 Required to send cookies with requests
});

// ✅ Do NOT attach tokens manually from localStorage
// ✅ Do NOT add Authorization headers (token is in the cookie)

export default instance;
