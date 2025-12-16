import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Droplet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Activity,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface OverviewData {
  totalUsers: number;
  totalOils: number;
  totalWebhooks: number;
  totalPurchases: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newOilsThisMonth: number;
  purchaseSuccessRate: number;
}

interface UserAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  usersByRole: { role: string; count: number }[];
  usersByMonth: { month: string; count: number }[];
}

interface PurchaseAnalytics {
  totalPurchases: number;
  totalRevenue: number;
  successfulPurchases: number;
  failedPurchases: number;
  successRate: number;
  purchasesByMonth: { month: string; count: number; revenue: number }[];
  averageOrderValue: number;
  topProducts: { product: string; sales: number; revenue: number }[];
}

interface WebhookAnalytics {
  totalWebhooks: number;
  webhooksByEvent: { event: string; count: number }[];
  webhooksByStatus: { status: string; count: number }[];
  webhooksByMonth: { month: string; count: number }[];
  successRate: number;
  errorRate: number;
}

export function AdminAnalytics() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [users, setUsers] = useState<UserAnalytics | null>(null);
  const [purchases, setPurchases] = useState<PurchaseAnalytics | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookAnalytics | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, purchasesRes, webhooksRes] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/users"),
        api.get("/analytics/purchases"),
        api.get("/analytics/webhooks"),
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data);
      setPurchases(purchasesRes.data);
      setWebhooks(webhooksRes.data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar analytics",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Nenhum dado disponível</p>
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
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Visão geral e métricas do sistema
        </p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{overview.newUsersThisMonth} este mês
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Óleos Essenciais</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalOils}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{overview.newOilsThisMonth} este mês
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {overview.totalPurchases} compras
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(overview.purchaseSuccessRate)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Compras processadas
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        {users && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Análise de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Novos esta semana</p>
                      <p className="text-2xl font-bold text-green-600">
                        {users.newUsersThisWeek}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Novos este mês</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {users.newUsersThisMonth}
                      </p>
                    </div>
                  </div>

                  {users.usersByRole.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Por Função</p>
                      <div className="space-y-2">
                        {users.usersByRole.map((item) => (
                          <div
                            key={item.role}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm">{item.role || "Sem função"}</span>
                            <span className="font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Purchase Analytics */}
        {purchases && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Análise de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ticket Médio</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(purchases.averageOrderValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPercent(purchases.successRate)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Sucesso</p>
                        <p className="font-semibold">{purchases.successfulPurchases}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-600">Falhas</p>
                        <p className="font-semibold">{purchases.failedPurchases}</p>
                      </div>
                    </div>
                  </div>

                  {purchases.topProducts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Produtos Mais Vendidos</p>
                      <div className="space-y-2">
                        {purchases.topProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.product}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm truncate flex-1">
                              {product.product}
                            </span>
                            <div className="text-right ml-2">
                              <p className="text-xs text-gray-600">{product.sales} vendas</p>
                              <p className="text-sm font-semibold">
                                {formatCurrency(product.revenue)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Webhook Analytics */}
        {webhooks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Análise de Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPercent(webhooks.successRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Erro</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatPercent(webhooks.errorRate)}
                      </p>
                    </div>
                  </div>

                  {webhooks.webhooksByEvent.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Por Evento</p>
                      <div className="space-y-2">
                        {webhooks.webhooksByEvent.slice(0, 5).map((item) => (
                          <div
                            key={item.event}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm">{item.event}</span>
                            <span className="font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {webhooks.webhooksByStatus.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Por Status</p>
                      <div className="space-y-2">
                        {webhooks.webhooksByStatus.map((item) => (
                          <div
                            key={item.status}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm capitalize">{item.status}</span>
                            <span className="font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Monthly Trends */}
        {purchases && purchases.purchasesByMonth.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vendas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {purchases.purchasesByMonth.slice(-6).map((item) => (
                    <div
                      key={item.month}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{item.month}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(item.revenue)}
                        </p>
                        <p className="text-xs text-gray-600">{item.count} vendas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
