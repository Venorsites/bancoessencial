import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Filter,
  User,
  Calendar,
  Globe,
  Bug,
  Lightbulb,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  message: string;
  type: string;
  page_url: string | null;
  user_agent: string | null;
  resolved: boolean;
  created_at: string;
  user: {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
  } | null;
}

const typeLabels: Record<string, { label: string; icon: any; color: string }> = {
  bug: { label: "Bug", icon: Bug, color: "bg-red-100 text-red-800" },
  suggestion: { label: "Sugestão", icon: Lightbulb, color: "bg-yellow-100 text-yellow-800" },
  question: { label: "Dúvida", icon: HelpCircle, color: "bg-blue-100 text-blue-800" },
  other: { label: "Outro", icon: MoreHorizontal, color: "bg-gray-100 text-gray-800" },
};

export function AdminFeedbacks() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterResolved, setFilterResolved] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (filterType !== "all") {
        params.append("type", filterType);
      }

      if (filterResolved !== "all") {
        params.append("resolved", filterResolved);
      }

      const response = await api.get(`/feedback?${params.toString()}`);
      setFeedbacks(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar feedbacks",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, filterType, filterResolved]);

  const handleResolve = async (id: string) => {
    try {
      await api.patch(`/feedback/${id}/resolve`);
      toast({
        title: "Feedback marcado como resolvido",
      });
      fetchFeedbacks();
    } catch (error: any) {
      toast({
        title: "Erro ao marcar como resolvido",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este feedback?")) {
      return;
    }

    try {
      await api.delete(`/feedback/${id}`);
      toast({
        title: "Feedback excluído",
      });
      fetchFeedbacks();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir feedback",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user?.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando feedbacks...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedbacks e Relatos</h1>
        <p className="text-gray-600">
          Gerencie os feedbacks, bugs e sugestões enviados pelos usuários
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {feedbacks.filter((f) => !f.resolved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {feedbacks.filter((f) => f.resolved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugs</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter((f) => f.type === "bug").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por mensagem, email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="suggestion">Sugestão</SelectItem>
                <SelectItem value="question">Dúvida</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterResolved} onValueChange={setFilterResolved}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="false">Pendentes</SelectItem>
                <SelectItem value="true">Resolvidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum feedback encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredFeedbacks.map((feedback, index) => {
            const typeInfo = typeLabels[feedback.type] || typeLabels.other;
            const TypeIcon = typeInfo.icon;

            return (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={feedback.resolved ? "opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                            {feedback.resolved && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Resolvido
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-900 whitespace-pre-wrap">{feedback.message}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!feedback.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolve(feedback.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Resolver
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(feedback.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          {feedback.user
                            ? `${feedback.user.nome} ${feedback.user.sobrenome} (${feedback.user.email})`
                            : "Usuário não identificado"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(feedback.created_at)}</span>
                      </div>
                      {feedback.page_url && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <a
                            href={feedback.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline truncate"
                          >
                            {new URL(feedback.page_url).pathname}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}

