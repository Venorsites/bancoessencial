import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileCheck, Search, Calendar, User, CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PolicyAcceptance {
  id: string;
  user_id: string;
  accepted: boolean;
  policy_version: string;
  ip_address?: string;
  user_agent?: string;
  accepted_at: string;
  user?: {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
  };
}

export function AdminPolicyAcceptances() {
  const { token } = useAuth();
  const [acceptances, setAcceptances] = useState<PolicyAcceptance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadAcceptances();
  }, [token, page]);

  const loadAcceptances = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get(`/policy-acceptance?page=${page}&limit=50`);
      
      if (response.data.data) {
        // Resposta paginada
        setAcceptances(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        // Resposta não paginada
        setAcceptances(response.data);
        setTotal(response.data.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Erro ao carregar aceites:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAcceptances = acceptances.filter((acceptance) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      acceptance.user?.nome?.toLowerCase().includes(search) ||
      acceptance.user?.sobrenome?.toLowerCase().includes(search) ||
      acceptance.user?.email?.toLowerCase().includes(search) ||
      acceptance.policy_version?.toLowerCase().includes(search) ||
      acceptance.ip_address?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Aceites de Política</h2>
          <p className="text-gray-600 mt-1">
            Visualize todos os aceites da Política de Privacidade e Termos de Uso
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FileCheck className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Aceites</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aceites Hoje</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {acceptances.filter(a => {
                    const today = new Date();
                    const acceptedDate = new Date(a.accepted_at);
                    return acceptedDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Versão Atual</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2.0</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome, e-mail, versão ou IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando aceites...</p>
            </div>
          ) : filteredAcceptances.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? "Nenhum aceite encontrado com os filtros aplicados." : "Nenhum aceite registrado ainda."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAcceptances.map((acceptance) => (
                <motion.div
                  key={acceptance.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {acceptance.user?.nome} {acceptance.user?.sobrenome}
                          </h3>
                          <p className="text-sm text-gray-600">{acceptance.user?.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {format(new Date(acceptance.accepted_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileCheck className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Versão: {acceptance.policy_version}</span>
                        </div>
                        {acceptance.ip_address && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">IP: {acceptance.ip_address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      {acceptance.accepted ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aceito
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="w-3 h-3 mr-1" />
                          Não aceito
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Página {page} de {totalPages} ({total} total)
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

