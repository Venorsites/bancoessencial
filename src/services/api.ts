import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('🌐 API Base URL configurada:', apiBaseURL);

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
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
  (res) => {
    console.log('✅ Resposta bem-sucedida:', {
      url: res.config.url,
      status: res.status,
      data: res.data
    });
    return res;
  },
  async (error) => {
    console.error('❌ Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    const original = error.config;

    // NÃO tentar refresh em rotas de autenticação (login, register, refresh)
    const isAuthRoute = original?.url?.includes('/auth/login') || 
                        original?.url?.includes('/auth/register') ||
                        original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
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
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/refresh`,
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

// Admin API functions
export const adminApi = {
  // Buscar todos os usuários
  getAllUsers: async (token?: string) => {
    try {
      // O interceptor do axios já adiciona o token automaticamente
      // Mas podemos garantir que o token está sendo enviado
      const response = await api.get('/users');
      console.log('✅ Usuários carregados:', response.data?.length || 0);
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Erro ao buscar usuários:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Buscar estatísticas de usuários
  getUsersStats: async (token?: string) => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      // Se o endpoint não existir, calcular estatísticas localmente
      const users = await adminApi.getAllUsers(token);
      return {
        totalUsers: users.length,
        activeUsers: users.length,
        usersByRole: {
          USER: users.filter((u: any) => u.role?.toUpperCase() === 'USER').length,
          ADMIN: users.filter((u: any) => u.role?.toUpperCase() === 'ADMIN').length,
        },
      };
    }
  },
};