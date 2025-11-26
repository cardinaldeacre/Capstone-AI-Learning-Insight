import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// interceptor request
axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error) //jika error
);

// handle refresh token
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Jika error 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // post refresh token
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.post(`${BASE_URL}/users/refresh-token`, {
          refreshToken: refreshToken
        });

        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);

        // Update original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return axiosClient(originalRequest);
      } catch (err) {
        console.error('Session expired', err);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
