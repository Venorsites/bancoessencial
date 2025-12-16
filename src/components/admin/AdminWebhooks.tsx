import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Webhook,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  CreditCard,
  AlertCircle,
  Eye,
  Calendar,
  DollarSign,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WebhookData {
  id: string;
  webhook_id: string;
  event: string;
  transaction_id: string;
  user_email: string;
  status: 'pending' | 'processed' | 'error';
  error_message?: string;
  raw_data: any;
  created_at: string;
  processed_at?: string;
}

interface WebhookStats {
  total: number;
  by_event: { [key: string]: number };
  by_status: { [key: string]: number };
}

export function AdminWebhooks() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookData | null>(null);

  useEffect(() => {
    if (token) {
      loadWebhooks();
      loadStats();
    }
  }, [token]);

  const loadWebhooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/webhooks?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar webhooks');
      }

      const data = await response.json();
      setWebhooks(data.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar webhooks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/webhooks/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
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
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredWebhooks = webhooks.filter((webhook) => {
    const matchesSearch =
      searchTerm === "" ||
      webhook.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webhook.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEvent = eventFilter === "all" || webhook.event === eventFilter;
    const matchesStatus = statusFilter === "all" || webhook.status === statusFilter;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Webhook className="w-8 h-8 text-purple-600" />
            Webhooks
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie e monitore webhooks recebidos da Hotmart
          </p>
        </div>
        <Button 
          onClick={loadWebhooks} 
          disabled={loading}
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Webhook className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.by_status?.processed || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Com Erro</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.by_status?.error || 0}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compras Aprovadas</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.by_event?.PURCHASE_APPROVED || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por email ou transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os eventos</option>
              <option value="PURCHASE_APPROVED">Compra Aprovada</option>
              <option value="PURCHASE_CANCELED">Compra Cancelada</option>
              <option value="PURCHASE_REFUNDED">Reembolsado</option>
              <option value="PURCHASE_CHARGEBACK">Chargeback</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os status</option>
              <option value="processed">Processado</option>
              <option value="error">Com Erro</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando webhooks...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-2">Erro ao carregar webhooks</p>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      ) : filteredWebhooks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum webhook encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredWebhooks.map((webhook) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{webhook.user_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-4 h-4" />
                          <span>{webhook.transaction_id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(webhook.created_at).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      {webhook.error_message && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-800">
                            <strong>Erro:</strong> {webhook.error_message}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWebhook(webhook)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedWebhook && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWebhook(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Detalhes do Webhook</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">ID:</label>
                  <p className="text-sm text-gray-600 font-mono">{selectedWebhook.webhook_id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Dados Completos:</label>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedWebhook.raw_data, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setSelectedWebhook(null)}>Fechar</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

