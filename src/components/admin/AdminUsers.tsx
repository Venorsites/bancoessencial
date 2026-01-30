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
  EyeOff,
  UserX,
  UserCheck,
  Webhook,
  RefreshCw,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageCircle,
  DollarSign,
  Tag,
  Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { CreateManualUserModal } from "./CreateManualUserModal";
import { EditManualUserDatesModal } from "./EditManualUserDatesModal";

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  contato: string;
  role: string;
  is_suspended?: boolean;
  subscription_status?: string;
  subscription_code?: string;
  current_plan_id?: number;
  current_plan_name?: string;
  plan_history?: any;
  user_source?: string;
  access_start_date?: string;
  access_end_date?: string;
  auto_suspend_on_expire?: boolean;
  manual_notes?: string;
  created_at: string | Date;
  updated_at: string | Date;
  avatar?: string;
}

interface WebhookData {
  id: string;
  webhook_id: string;
  event: string;
  transaction_id: string;
  user_email: string;
  status: 'pending' | 'processed' | 'error';
  error_message?: string;
  created_at: string;
  // Dados financeiros
  valor_pago?: number;
  moeda?: string;
  forma_pagamento?: string;
  parcelas?: number;
  codigo_oferta?: string;
  codigo_cupom?: string;
  plano_nome?: string;
  plano_id?: number;
  pais_origem?: string;
  pais_iso?: string;
  comissao_afiliado?: number;
  comissao_produtor?: number;
  valor_liquido?: number;
}

export function AdminUsers() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userWebhooks, setUserWebhooks] = useState<WebhookData[]>([]);
  const [loadingWebhooks, setLoadingWebhooks] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
  const [showUnsuspendDialog, setShowUnsuspendDialog] = useState(false);
  const [userToUnsuspend, setUserToUnsuspend] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditDatesModalOpen, setIsEditDatesModalOpen] = useState(false);
  const [userToEditDates, setUserToEditDates] = useState<User | null>(null);

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
      
      const usersData = await adminApi.getAllUsers(token);
      
      console.log('✅ Dados recebidos:', usersData);
      
      const normalizedUsers = Array.isArray(usersData) 
        ? usersData.map(user => ({
            ...user,
            is_suspended: user.is_suspended === true ? true : false
          }))
        : [];
      
      setUsers(normalizedUsers);
      console.log('✅ Usuários normalizados:', normalizedUsers.length);
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
    } finally {
      setLoading(false);
    }
  };

  const loadUserWebhooks = async (email: string) => {
    setLoadingWebhooks(true);
    try {
      const response = await fetch(`${API_URL}/webhooks/user/${email}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar webhooks do usuário');
      }

      const data = await response.json();
      setUserWebhooks(data.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar webhooks:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar webhooks do usuário",
        variant: "destructive",
      });
    } finally {
      setLoadingWebhooks(false);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    await loadUserWebhooks(user.email);
  };

  const handleSuspend = (user: User) => {
    setUserToSuspend(user);
    setShowSuspendDialog(true);
  };

  const confirmSuspend = async () => {
    if (!userToSuspend) return;

    try {
      setProcessingId(userToSuspend.id);
      setShowSuspendDialog(false);
      console.log('🔄 Tentando suspender usuário:', userToSuspend.id);

      const response = await fetch(`${API_URL}/users/${userToSuspend.id}/suspend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    
      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Erro ao suspender usuário';
        let errorDetails: any = null;
        
        try {
          const errorData = await response.json();
          errorDetails = errorData;
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('❌ Erro detalhado:', errorData);
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
          console.error('❌ Erro como texto:', errorText);
        }
        
        // Mensagens específicas por status
        if (response.status === 403) {
          errorMessage = 'Você não tem permissão para suspender usuários';
        } else if (response.status === 401) {
          errorMessage = 'Você precisa estar autenticado';
        } else if (response.status === 404) {
          errorMessage = 'Usuário não encontrado';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Usuário suspendido com sucesso:', data);

      toast({
        title: "Sucesso",
        description: data.message || "Usuário suspendido com sucesso",
      });

      await loadUsers();
      setUserToSuspend(null);
    } catch (error: any) {
      console.error('❌ Erro completo ao suspender usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao suspender usuário. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnsuspend = (user: User) => {
    setUserToUnsuspend(user);
    setShowUnsuspendDialog(true);
  };

  const confirmUnsuspend = async () => {
    if (!userToUnsuspend) return;

    try {
      setProcessingId(userToUnsuspend.id);
      setShowUnsuspendDialog(false);

      const response = await fetch(`${API_URL}/users/${userToUnsuspend.id}/unsuspend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao reativar usuário';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      toast({
        title: "Sucesso",
        description: data.message || "Usuário reativado com sucesso",
      });

      await loadUsers();
      setUserToUnsuspend(null);
    } catch (error: any) {
      console.error('Erro ao reativar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao reativar usuário",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleMigrateWebhooks = async () => {
    try {
      setMigrating(true);
      
      const response = await fetch(`${API_URL}/webhooks/migrate-old-webhooks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao migrar webhooks');
      }

      const data = await response.json();

      toast({
        title: "Sucesso",
        description: `Migração concluída! ${data.data?.atualizados || 0} webhooks atualizados.`,
      });

      // Recarregar usuários para mostrar dados atualizados
      await loadUsers();
    } catch (error: any) {
      console.error('Erro ao migrar webhooks:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao migrar webhooks antigos",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  const getEventLabel = (event: string) => {
    const labels: { [key: string]: string } = {
      'PURCHASE_APPROVED': 'Compra Aprovada',
      'PURCHASE_CANCELED': 'Compra Cancelada',
      'PURCHASE_REFUNDED': 'Reembolsado',
      'PURCHASE_CHARGEBACK': 'Chargeback',
    };
    return labels[event] || event;
  };

  const getEventColor = (event: string) => {
    const colors: { [key: string]: string } = {
      'PURCHASE_APPROVED': 'bg-green-100 text-green-800',
      'PURCHASE_CANCELED': 'bg-red-100 text-red-800',
      'PURCHASE_REFUNDED': 'bg-orange-100 text-orange-800',
      'PURCHASE_CHARGEBACK': 'bg-red-100 text-red-800',
    };
    return colors[event] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contato.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.is_suspended) ||
      (statusFilter === "suspended" && user.is_suspended);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const suspendedCount = users.filter((u) => u.is_suspended).length;
  const activeCount = users.filter((u) => !u.is_suspended).length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              Gerenciar Usuários
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie usuários, suspensões e visualize webhooks relacionados
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Criar Usuário Manual
            </Button>
            <Button 
              onClick={loadUsers} 
              disabled={loading}
              className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <Button 
            onClick={handleMigrateWebhooks} 
            disabled={migrating}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${migrating ? 'animate-spin' : ''}`} />
            {migrating ? 'Migrando...' : 'Atualizar Webhooks Antigos'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspensos</p>
                <p className="text-2xl font-bold text-red-600">{suspendedCount}</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{adminCount}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
          </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
                placeholder="Buscar por nome, email ou contato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
          />
        </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas as roles</option>
              <option value="USER">Usuários</option>
              <option value="ADMIN">Administradores</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os status</option>
              <option value="active">Apenas ativos</option>
              <option value="suspended">Apenas suspensos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando usuários...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-2">Erro ao carregar usuários</p>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum usuário encontrado</p>
          </CardContent>
        </Card>
            ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 
                          className="text-base sm:text-lg font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={() => handleViewUser(user)}
                        >
                          {user.nome} {user.sobrenome}
                        </h3>
                        {user.is_suspended ? (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <UserX className="w-3 h-3 mr-1" />
                            Suspenso
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                        )}
                        {user.role === 'ADMIN' && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.user_source === 'MANUAL' && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <UserPlus className="w-3 h-3 mr-1" />
                            Manual
                          </Badge>
                        )}
                        {user.current_plan_name ? (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            <Package className="w-3 h-3 mr-1" />
                            {user.current_plan_name}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 text-xs">
                            <Package className="w-3 h-3 mr-1" />
                            Sem plano
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate text-xs sm:text-sm">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/55${user.contato.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors text-xs sm:text-sm"
                          >
                            <MessageCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{user.contato}</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:ml-4">
                      {/* Botão Editar Datas (apenas para usuários MANUAL) */}
                      {user.user_source === 'MANUAL' && (
                        <Button
                          onClick={() => {
                            setUserToEditDates(user);
                            setIsEditDatesModalOpen(true);
                          }}
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Editar Datas
                        </Button>
                      )}
                      
                      {/* Botão Suspender/Reativar */}
                      {user.is_suspended ? (
                        <Button
                          onClick={() => handleUnsuspend(user)}
                          disabled={processingId === user.id}
                          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                          size="sm"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          {processingId === user.id ? 'Reativando...' : 'Reativar'}
                      </Button>
                      ) : (
                        <Button
                          onClick={() => handleSuspend(user)}
                          disabled={processingId === user.id || user.role === 'ADMIN'}
                          variant="destructive"
                          className="w-full sm:w-auto"
                          size="sm"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          {processingId === user.id ? 'Suspendendo...' : 'Suspender'}
                      </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
                  </motion.div>
                ))}
              </div>
            )}

      {/* Modal de Webhooks do Usuário */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedUser.nome} {selectedUser.sobrenome}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
                <Button onClick={() => setSelectedUser(null)} variant="outline">
                  Fechar
                </Button>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-purple-600" />
                  Webhooks Relacionados ({userWebhooks.length})
                </h4>
              </div>

              {loadingWebhooks ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Carregando webhooks...</p>
                </div>
              ) : userWebhooks.length === 0 ? (
                <div className="text-center py-12">
                  <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum webhook encontrado para este usuário</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userWebhooks.map((webhook) => (
                    <Card key={webhook.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getEventColor(webhook.event)}>
                                {getEventLabel(webhook.event)}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(webhook.status)}
                                <span className="text-sm text-gray-600 capitalize">
                                  {webhook.status}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <span className="truncate">{webhook.transaction_id}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(webhook.created_at).toLocaleString('pt-BR')}</span>
                              </div>
                            </div>

                            {/* Informações Financeiras */}
                            {webhook.valor_pago && (
                              <div className="mt-3 p-3 bg-purple-50 border border-purple-100 rounded">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">Valor:</span>
                                    <div className="font-semibold text-purple-700">
                                      {webhook.moeda} {Math.abs(webhook.valor_pago).toFixed(2)}
                                      {webhook.parcelas && webhook.parcelas > 1 && ` (${webhook.parcelas}x)`}
                                    </div>
                                  </div>
                                  
                                  {webhook.forma_pagamento && (
                                    <div>
                                      <span className="text-gray-500">Pagamento:</span>
                                      <div className="font-medium">
                                        {webhook.forma_pagamento.replace('_', ' ')}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {webhook.plano_nome && (
                                    <div>
                                      <span className="text-gray-500">Plano:</span>
                                      <div className="font-medium flex items-center gap-1">
                                        <Package className="w-3 h-3" />
                                        {webhook.plano_nome}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {webhook.codigo_cupom && (
                                    <div>
                                      <span className="text-gray-500">Cupom:</span>
                                      <div className="font-medium flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {webhook.codigo_cupom}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {webhook.codigo_oferta && (
                                    <div>
                                      <span className="text-gray-500">Oferta:</span>
                                      <div className="font-medium">{webhook.codigo_oferta}</div>
                                    </div>
                                  )}

                                  {webhook.pais_origem && (
                                    <div>
                                      <span className="text-gray-500">País:</span>
                                      <div className="font-medium">
                                        {webhook.pais_origem} {webhook.pais_iso && `(${webhook.pais_iso})`}
                                      </div>
                                    </div>
                                  )}

                                  {webhook.valor_liquido && (
                                    <div>
                                      <span className="text-gray-500">Líquido:</span>
                                      <div className="font-semibold text-green-700">
                                        {webhook.moeda} {Math.abs(webhook.valor_liquido).toFixed(2)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {webhook.error_message && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                                <strong>Erro:</strong> {webhook.error_message}
                              </div>
                            )}
                          </div>
                        </div>
          </CardContent>
        </Card>
                  ))}
                </div>
              )}
            </div>
      </motion.div>
        </div>
      )}

      {/* Dialog de Confirmação de Suspensão */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <UserX className="w-5 h-5" />
              Confirmar Suspensão
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja suspender o acesso deste usuário?
            </DialogDescription>
          </DialogHeader>
          
          {userToSuspend && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Nome:</span>
                  <span className="text-gray-900">
                    {userToSuspend.nome} {userToSuspend.sobrenome}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900">{userToSuspend.email}</span>
                </div>
                {userToSuspend.role === 'ADMIN' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrador
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Atenção:</strong> O usuário não conseguirá fazer login enquanto estiver suspenso. 
                  A suspensão pode ser revertida a qualquer momento.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuspendDialog(false);
                setUserToSuspend(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSuspend}
              disabled={processingId === userToSuspend?.id}
            >
              {processingId === userToSuspend?.id ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Suspendendo...
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Sim, Suspender
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Reativação */}
      <Dialog open={showUnsuspendDialog} onOpenChange={setShowUnsuspendDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <UserCheck className="w-5 h-5" />
              Confirmar Reativação
            </DialogTitle>
            <DialogDescription className="pt-2">
              Tem certeza que deseja reativar o acesso deste usuário?
            </DialogDescription>
          </DialogHeader>
          
          {userToUnsuspend && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Nome:</span>
                  <span className="text-gray-900">
                    {userToUnsuspend.nome} {userToUnsuspend.sobrenome}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900">{userToUnsuspend.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-red-100 text-red-800">
                    <UserX className="w-3 h-3 mr-1" />
                    Atualmente Suspenso
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>✅ Confirmação:</strong> O usuário terá acesso restaurado ao sistema e poderá fazer login novamente.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnsuspendDialog(false);
                setUserToUnsuspend(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmUnsuspend}
              disabled={processingId === userToUnsuspend?.id}
            >
              {processingId === userToUnsuspend?.id ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Reativando...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Sim, Reativar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Usuário Manual */}
      <CreateManualUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadUsers}
      />

      {/* Modal de Edição de Datas */}
      <EditManualUserDatesModal
        isOpen={isEditDatesModalOpen}
        onClose={() => {
          setIsEditDatesModalOpen(false);
          setUserToEditDates(null);
        }}
        onSuccess={loadUsers}
        user={userToEditDates}
      />
    </div>
  );
}
