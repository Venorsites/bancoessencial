import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastLogin: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar dados do usuário do localStorage na inicialização
  useEffect(() => {
    console.log('UserContext: Carregando dados do localStorage');
    const savedUser = localStorage.getItem('user');
    console.log('UserContext: savedUser from localStorage:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('UserContext: userData parsed:', userData);
        setUser({
          id: 'user-001', // ID padrão para usuários locais
          ...userData
        });
        setIsAuthenticated(true);
        console.log('UserContext: User definido e autenticado');
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('UserContext: Nenhum usuário encontrado no localStorage');
    }
  }, []);

  const login = (userData: Omit<User, 'id'>) => {
    const newUser = {
      id: 'user-001',
      ...userData
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    
    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Limpar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('favorites');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Atualizar localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}
