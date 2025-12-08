import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  contato: string;
  avatar?: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  nome: string;
  sobrenome: string;
  email: string;
  contato: string;
  senha: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Modo de desenvolvimento - criar usuário admin automaticamente
  const isDevMode = false; // DESATIVADO - usar login real

  useEffect(() => {
    const loadStorageData = async () => {
      // Modo de desenvolvimento - criar usuário admin automaticamente
      if (isDevMode) {
        const devUser: User = {
          id: 'dev-admin-id',
          nome: 'Admin',
          sobrenome: 'Sistema',
          email: 'admin@bancoessencial.com',
          contato: '11999999999',
          role: 'ADMIN'
        };
        const devToken = 'dev-admin-token';
        
        setUser(devUser);
        setToken(devToken);
        setLoading(false);
        return;
      }

      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('@BancoEssencial:user');

      if (storedAccessToken && storedRefreshToken && storedUser) {
        try {
          // Testar se o token ainda é válido
          const response = await api.get('/auth/me');
          setToken(storedAccessToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Se falhar, limpar tokens e redirecionar para login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('@BancoEssencial:user');
        }
      }

      setLoading(false);
    };

    loadStorageData();
  }, [isDevMode]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    
    setUser(data.user);
    setToken(data.access_token);
    
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('@BancoEssencial:user', JSON.stringify(data.user));

    toast({
      title: 'Login realizado com sucesso!',
      description: `Bem-vindo, ${data.user?.nome || 'usuário'}!`,
    });
  };

  const register = async (data: RegisterData) => {
    try {
      const { data: response } = await api.post('/auth/register', data);
      
      setUser(response.user);
      setToken(response.access_token);
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('@BancoEssencial:user', JSON.stringify(response.user));

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: `Bem-vindo, ${response.user?.nome || 'usuário'}!`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao registrar',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('@BancoEssencial:user');
    
    // Limpar cache de aceite de política
    if (user?.id) {
      localStorage.removeItem(`policy_accepted_${user.id}_2.0`);
    }
    
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da sua conta',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
