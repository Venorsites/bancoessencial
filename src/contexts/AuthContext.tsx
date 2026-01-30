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
  
  // O refresh automático é feito pelo interceptor do axios quando necessário
  // Não precisamos de timers ou verificações manuais aqui

  useEffect(() => {
    let isMounted = true; // Flag para evitar atualizações após desmontagem
    let timeoutId: NodeJS.Timeout;

    const loadStorageData = async () => {
      try {
        // Verificar se há sessão válida checando o endpoint /auth/me
        // O token está nos cookies, não precisa enviar nada
        const response = await api.get('/auth/me');
        
        if (isMounted) {
          setUser(response.data);
          setToken('cookie'); // Placeholder - token está no cookie httpOnly
        }
      } catch (error: any) {
        // Sem sessão válida - não é um erro crítico, apenas não há usuário logado
        // Não tentar fazer refresh aqui para evitar loops - o interceptor já cuida disso
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Timeout de segurança: garantir que o loading sempre termine após 5 segundos
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 5000);

    loadStorageData().finally(() => {
      // Limpar timeout se a requisição terminar antes
      clearTimeout(timeoutId);
    });

    // Cleanup: evitar atualizações se o componente for desmontado
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userData } = response.data;
    
    setUser(userData);
    setToken('cookie'); // Token está no cookie httpOnly

    toast({
      title: 'Login realizado com sucesso!',
      description: `Bem-vindo, ${userData?.nome || 'usuário'}!`,
    });
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data);
      const { user: userData } = response.data;
      
      setUser(userData);
      setToken('cookie'); // Token está no cookie httpOnly

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: `Bem-vindo, ${userData?.nome || 'usuário'}!`,
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

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignorar erro de logout
    }
    
    setUser(null);
    setToken(null);
    
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
