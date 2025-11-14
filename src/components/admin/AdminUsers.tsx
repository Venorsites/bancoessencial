import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  contato: string;
  role: string;
  is_suspended?: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  avatar?: string;
}

export function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (token) {
      loadUsers();
    } else {
      setError("Você precisa estar autenticado para acessar esta página.");
      setLoading(false);
    }
  }, [token]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando usuários...', { token: token ? 'Token presente' : 'Sem token' });
      
      // O token será adicionado automaticamente pelo interceptor do axios
      const usersData = await adminApi.getAllUsers(token);
      
      console.log('✅ Dados recebidos:', usersData);
      console.log('✅ Primeiro usuário exemplo:', usersData?.[0]);
      console.log('✅ is_suspended do primeiro:', usersData?.[0]?.is_suspended, 'tipo:', typeof usersData?.[0]?.is_suspended);
      
      // Normalizar is_suspended: null/undefined = false (ativo)
      const normalizedUsers = Array.isArray(usersData) 
        ? usersData.map(user => ({
            ...user,
            is_suspended: user.is_suspended === true ? true : false
          }))
        : [];
      
      setUsers(normalizedUsers);
      console.log('✅ Usuários normalizados:', normalizedUsers.length);
      console.log('✅ Exemplo de usuário normalizado:', normalizedUsers[0]);
      console.log('✅ Filtros ativos:', { statusFilter, roleFilter, searchTerm });
    } catch (error: any) {
      console.error("❌ Erro ao carregar usuários:", error);
      
      let errorMessage = "Erro ao carregar usuários. ";
      
      if (error.response?.status === 401) {
        errorMessage += "Você não está autenticado. Faça login novamente.";
      } else if (error.response?.status === 403) {
        errorMessage += "Você não tem permissão para acessar esta página. É necessário ser administrador.";
      } else if (error.response?.status === 404) {
        errorMessage += "Endpoint não encontrado. Verifique se o backend está rodando.";
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage += "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3000";
      } else {
        errorMessage += error.response?.data?.message || error.message || "Erro desconhecido.";
      }
      
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contato.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    // Normalizar is_suspended para comparação (null/undefined = false = ativo)
    const isSuspended = user.is_suspended === true;
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && !isSuspended) ||
      (statusFilter === "inactive" && isSuspended);
    
    const matches = matchesSearch && matchesRole && matchesStatus;
    
    // Debug apenas para o primeiro usuário
    if (users.indexOf(user) === 0) {
      console.log('🔍 Debug filtro:', {
        email: user.email,
        matchesSearch,
        matchesRole,
        matchesStatus,
        isSuspended,
        statusFilter,
        roleFilter,
        searchTerm,
        finalMatch: matches
      });
    }
    
    return matches;
  });

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os usuários cadastrados no sistema
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role.toLowerCase() === 'admin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Comuns</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role.toLowerCase() === 'user').length}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.is_suspended !== true).length}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Inativos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {users.filter(u => u.is_suspended === true).length}
                </p>
              </div>
              <User className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">Erro:</span>
            <span>{error}</span>
          </div>
          <Button
            onClick={loadUsers}
            variant="outline"
            size="sm"
            className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
          >
            Tentar Novamente
          </Button>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button
              variant={roleFilter === "all" ? "default" : "outline"}
              onClick={() => setRoleFilter("all")}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={roleFilter === "admin" ? "default" : "outline"}
              onClick={() => setRoleFilter("admin")}
              size="sm"
            >
              Admins
            </Button>
            <Button
              variant={roleFilter === "user" ? "default" : "outline"}
              onClick={() => setRoleFilter("user")}
              size="sm"
            >
              Usuários
            </Button>
          </div>
          <div className="flex gap-2 border-l pl-2 ml-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
              className={statusFilter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              Todos Status
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              onClick={() => setStatusFilter("active")}
              size="sm"
              className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              Ativos
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              onClick={() => setStatusFilter("inactive")}
              size="sm"
              className={statusFilter === "inactive" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
            >
              Inativos
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={`${user.nome} ${user.sobrenome}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-purple-600" />
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {user.nome} {user.sobrenome}
                          </h3>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role.toUpperCase()}
                          </Badge>
                          <Badge 
                            variant={user.is_suspended === true ? "secondary" : "default"}
                            className={user.is_suspended === true 
                              ? "bg-orange-100 text-orange-800 border-orange-200" 
                              : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {user.is_suspended === true ? "Inativo" : "Ativo"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.contato}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(user.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(user.id)}
                        title="Ver/ocultar senha"
                      >
                        {showPasswords[user.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" title="Editar usuário">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Excluir usuário">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
