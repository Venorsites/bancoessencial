import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

function onRefreshed(newToken: string) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((t) => {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${t}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) throw new Error('no refresh');

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh_token }
        );

        const newAccess = data.access_token;
        localStorage.setItem('access_token', newAccess);

        isRefreshing = false;
        onRefreshed(newAccess);

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (err) {
        isRefreshing = false;
        pendingQueue = [];
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // opcional: redirecionar para /login
        // window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;