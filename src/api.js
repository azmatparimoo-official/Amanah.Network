import axios from 'axios';

// This automatically picks up the URL from your environment settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
withCredentials: true, // Include cookies for session management
});

export default api;