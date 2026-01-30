import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true, // IMPORTANTE: Enviar cookies automaticamente
});

let isRefreshing = false;
let pendingQueue: Array<(success: boolean) => void> = [];

function onRefreshed(success: boolean) {
  pendingQueue.forEach((cb) => cb(success));
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // NÃO tentar refresh em rotas de autenticação ou verificação inicial (para evitar loops)
    const isAuthRoute = original?.url?.includes('/auth/login') || 
                        original?.url?.includes('/auth/register') ||
                        original?.url?.includes('/auth/refresh') ||
                        original?.url?.includes('/auth/me'); // Não tentar refresh na verificação inicial

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((success: boolean) => {
            if (success) {
              resolve(api(original));
            } else {
              reject(error);
            }
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Tentar renovar token (refresh_token está no cookie)
        await api.post('/auth/refresh');
        
        isRefreshing = false;
        onRefreshed(true);
        
        // Retentar requisição original
        return api(original);
      } catch (err: any) {
        isRefreshing = false;
        onRefreshed(false);
        
        // Se o refresh também retornou 401, não há sessão válida
        // Não redirecionar se já estiver na página de login para evitar loops
        if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
          // Limpar cookies e redirecionar apenas uma vez
          if (!original._redirected) {
            original._redirected = true;
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Admin API functions
export const adminApi = {
  getAllUsers: async (token?: string) => {
    try {
      const response = await api.get('/users');
      return response.data || [];
    } catch (error: any) {
      throw error;
    }
  },

  getUsersStats: async (token?: string) => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
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