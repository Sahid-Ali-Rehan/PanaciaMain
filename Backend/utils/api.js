import axios from 'axios';

const API_URL = "http://localhost:5000"; // Change to your backend URL

// Signup request
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error during signup');
  }
};

// Signin request
export const signinUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, userData);
    return response.data; // token here
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error during signin');
  }
};

// Logout request (simply clears token)
export const logoutUser = () => {
  localStorage.removeItem('authToken'); // Clear stored token
};
