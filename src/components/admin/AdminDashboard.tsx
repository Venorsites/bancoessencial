import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Droplets, 
  Users, 
  UserCheck, 
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  CheckCircle2,
  Stethoscope,
  Mail,
  MessageSquare,
  Webhook,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { oilsApi } from "@/services/oilsApi";
import { adminApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface DashboardStats {
  totalOils: number;
  activeOils: number;
  totalUsers: number;
  activeUsers: number;
  totalDiseases: number;
  totalEmailTemplates: number;
  activeEmailTemplates: number;
  totalFeedbacks: number;
  pendingFeedbacks: number;
  totalWebhooks: number;
  totalOfertas: number;
}

export function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOils: 0,
    activeOils: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalDiseases: 0,
    totalEmailTemplates: 0,
    activeEmailTemplates: 0,
    totalFeedbacks: 0,
    pendingFeedbacks: 0,
    totalWebhooks: 0,
    totalOfertas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar todos os óleos (incluindo inativos)
      const allOils = await oilsApi.getAll('', false);
      
      // Contar apenas óleos ativos
      const activeOilsCount = allOils.filter(oil => oil.ativo).length;
      
      // Carregar estatísticas de usuários
      let usersStats = { totalUsers: 0, activeUsers: 0 };
      try {
        if (token) {
          usersStats = await adminApi.getUsersStats(token);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas de usuários:", error);
        usersStats = { totalUsers: 0, activeUsers: 0 };
      }

      // Carregar doenças
      let totalDiseases = 0;
      try {
        const diseasesResponse = await api.get('/doencas');
        totalDiseases = diseasesResponse.data.length || 0;
      } catch (error) {
        console.error("Erro ao carregar doenças:", error);
      }

      // Carregar templates de email
      let emailTemplatesStats = { total: 0, active: 0 };
      try {
        const templatesResponse = await api.get('/email-templates');
        const templates = templatesResponse.data || [];
        emailTemplatesStats.total = templates.length;
        emailTemplatesStats.active = templates.filter((t: any) => t.is_active).length;
      } catch (error) {
        console.error("Erro ao carregar templates de email:", error);
      }

      // Carregar feedbacks
      let feedbacksStats = { total: 0, pending: 0 };
      try {
        const feedbacksResponse = await api.get('/feedback?page=1&limit=1000');
        const feedbacks = feedbacksResponse.data.data || [];
        feedbacksStats.total = feedbacksResponse.data.total || 0;
        feedbacksStats.pending = feedbacks.filter((f: any) => !f.resolved).length;
      } catch (error) {
        console.error("Erro ao carregar feedbacks:", error);
      }

      // Carregar webhooks
      let totalWebhooks = 0;
      try {
        const webhooksResponse = await api.get('/webhooks?page=1&limit=1');
        totalWebhooks = webhooksResponse.data.total || 0;
      } catch (error) {
        console.error("Erro ao carregar webhooks:", error);
      }

      // Carregar ofertas
      let totalOfertas = 0;
      try {
        const ofertasResponse = await api.get('/ofertas');
        totalOfertas = ofertasResponse.data.length || 0;
      } catch (error) {
        console.error("Erro ao carregar ofertas:", error);
      }
      
      setStats({
        totalOils: allOils.length,
        activeOils: activeOilsCount,
        totalUsers: usersStats.totalUsers,
        activeUsers: usersStats.activeUsers,
        totalDiseases,
        totalEmailTemplates: emailTemplatesStats.total,
        activeEmailTemplates: emailTemplatesStats.active,
        totalFeedbacks: feedbacksStats.total,
        pendingFeedbacks: feedbacksStats.pending,
        totalWebhooks,
        totalOfertas,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Usuários Cadastrados",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Total de usuários registrados"
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "Usuários não suspensos"
    },
    {
      title: "Óleos Essenciais",
      value: stats.totalOils,
      icon: Droplets,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: `${stats.activeOils} ativos`
    },
    {
      title: "Doenças",
      value: stats.totalDiseases,
      icon: Stethoscope,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Doenças cadastradas"
    },
    {
      title: "Templates de Email",
      value: stats.totalEmailTemplates,
      icon: Mail,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      description: `${stats.activeEmailTemplates} ativos`
    },
    {
      title: "Feedbacks",
      value: stats.totalFeedbacks,
      icon: MessageSquare,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      description: `${stats.pendingFeedbacks} pendentes`
    },
    {
      title: "Webhooks",
      value: stats.totalWebhooks,
      icon: Webhook,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
      description: "Webhooks recebidos"
    },
    {
      title: "Ofertas",
      value: stats.totalOfertas,
      icon: Tag,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Ofertas cadastradas"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral do sistema Banco Essencial</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {card.value}
                  </div>
                  <p className="text-xs text-gray-500">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Usuários Ativos</div>
                      <div className="text-xs text-gray-500">{stats.activeUsers} de {stats.totalUsers} usuários</div>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-sm font-medium">Óleos Ativos</div>
                      <div className="text-xs text-gray-500">{stats.activeOils} de {stats.totalOils} óleos</div>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {stats.totalOils > 0 ? Math.round((stats.activeOils / stats.totalOils) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-yellow-600" />
                    <div>
                      <div className="text-sm font-medium">Feedbacks Pendentes</div>
                      <div className="text-xs text-gray-500">{stats.pendingFeedbacks} de {stats.totalFeedbacks} feedbacks</div>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats.totalFeedbacks > 0 ? Math.round((stats.pendingFeedbacks / stats.totalFeedbacks) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Resumo Rápido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Templates Ativos</span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">
                    {stats.activeEmailTemplates}/{stats.totalEmailTemplates}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Webhook className="w-4 h-4 text-cyan-600" />
                    <span className="text-sm text-gray-600">Total de Webhooks</span>
                  </div>
                  <span className="text-sm font-semibold text-cyan-600">{stats.totalWebhooks}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Ofertas Cadastradas</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">{stats.totalOfertas}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-pink-600" />
                    <span className="text-sm text-gray-600">Doenças Cadastradas</span>
                  </div>
                  <span className="text-sm font-semibold text-pink-600">{stats.totalDiseases}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
