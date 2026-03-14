import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchUserProfile = async (username) => {
    const { data } = await api.get(`user/${username}`);
    return data;
};

export const fetchUserAnalysis = async (username) => {
    const { data } = await api.get(`analyze/${username}`);
    return data;
};
