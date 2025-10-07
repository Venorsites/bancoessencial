import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/api';
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

  useEffect(() => {
    const loadStorageData = async () => {
      const storedToken = localStorage.getItem('@BancoEssencial:token');
      const storedUser = localStorage.getItem('@BancoEssencial:user');

      if (storedToken && storedUser) {
        try {
          const isValid = await authApi.validateToken(storedToken);
          if (isValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('@BancoEssencial:token');
            localStorage.removeItem('@BancoEssencial:user');
          }
        } catch (error) {
          localStorage.removeItem('@BancoEssencial:token');
          localStorage.removeItem('@BancoEssencial:user');
        }
      }

      setLoading(false);
    };

    loadStorageData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      setUser(response.user);
      setToken(response.access_token);
      
      localStorage.setItem('@BancoEssencial:token', response.access_token);
      localStorage.setItem('@BancoEssencial:user', JSON.stringify(response.user));

      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo, ${response.user.nome}!`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      
      setUser(response.user);
      setToken(response.access_token);
      
      localStorage.setItem('@BancoEssencial:token', response.access_token);
      localStorage.setItem('@BancoEssencial:user', JSON.stringify(response.user));

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: `Bem-vindo, ${response.user.nome}!`,
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
    localStorage.removeItem('@BancoEssencial:token');
    localStorage.removeItem('@BancoEssencial:user');
    
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
