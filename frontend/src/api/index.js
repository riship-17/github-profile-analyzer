import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// Ensure it always ends with a slash so relative request paths append correctly
export const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

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

export const scanJobs = async () => {
    const { data } = await api.get('jobs/scan');
    return data;
};
