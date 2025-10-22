import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Eye, ToggleLeft, ToggleRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { doencasApi, DoencaGeral } from "@/services/doencasApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function AdminDiseases() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [diseases, setDiseases] = useState<DoencaGeral[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<DoencaGeral | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    loadDiseases();
  }, []);

  const loadDiseases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doencasApi.getAll(undefined, undefined, false); // activeOnly = false para admin
      setDiseases(data);
    } catch (err) {
      setError("Erro ao carregar doenças");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta doença?")) {
      return;
    }

    try {
      await doencasApi.delete(id, token!);
      setDiseases(diseases.filter(disease => disease.id !== id));
    } catch (err) {
      alert("Erro ao deletar doença");
      console.error(err);
    }
  };

  const handleActivationToggle = (disease: DoencaGeral) => {
    setSelectedDisease(disease);
    setShowActivationModal(true);
    setShowScheduleModal(false);
    setSelectedDate(undefined);
  };

  const handleScheduleClick = () => {
    setShowActivationModal(false);
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedDisease || !selectedDate || !token) return;

    try {
      const scheduledDate = selectedDate.toISOString().split('T')[0];
      const updatedDisease = await doencasApi.scheduleRelease(selectedDisease.id, scheduledDate, token);

      // Atualizar a lista local
      const updatedDiseases = diseases.map(disease => 
        disease.id === selectedDisease.id ? updatedDisease : disease
      );
      setDiseases(updatedDiseases);
      setShowScheduleModal(false);
      setSelectedDisease(null);
      setSelectedDate(undefined);
    } catch (err) {
      alert("Erro ao agendar liberação da doença");
      console.error(err);
    }
  };

  const handleActivationSubmit = async (action: 'activate' | 'deactivate' | 'schedule', scheduledDate?: string) => {
    if (!selectedDisease || !token) return;

    try {
      let updatedDisease;
      
      if (action === 'schedule' && scheduledDate) {
        updatedDisease = await doencasApi.scheduleRelease(selectedDisease.id, scheduledDate, token);
      } else {
        const ativo = action === 'activate';
        updatedDisease = await doencasApi.toggleActivation(selectedDisease.id, ativo, scheduledDate, token);
      }

      // Atualizar a lista local
      const updatedDiseases = diseases.map(disease => 
        disease.id === selectedDisease.id ? updatedDisease : disease
      );
      setDiseases(updatedDiseases);
      setShowActivationModal(false);
      setSelectedDisease(null);
    } catch (err) {
      alert("Erro ao atualizar status da doença");
      console.error(err);
    }
  };

  const filteredDiseases = diseases.filter((disease) =>
    disease.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.descricao_short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando doenças...</p>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doenças</h1>
          <p className="text-gray-600">Gerencie o banco de dados de doenças e condições</p>
        </div>
        <Button
          onClick={() => navigate('/admin/diseases/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Doença
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar doença..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Doenças</p>
                <p className="text-2xl font-bold text-purple-600">{diseases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doenças Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {diseases.filter(disease => disease.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agendadas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {diseases.filter(disease => disease.data_liberacao && !disease.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(diseases.map(d => d.categoria)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600"
        >
          {error}
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Doenças Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDiseases.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhuma doença encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Categoria</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Data Liberação</th>
                      <th className="text-right p-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiseases.map((disease, index) => (
                      <motion.tr
                        key={disease.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{disease.nome}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {disease.descricao_short}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="rounded-lg">
                            {disease.categoria}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant={disease.ativo ? "default" : "secondary"}
                              className={disease.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {disease.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                            {disease.data_liberacao && !disease.ativo && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Agendado
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {disease.data_liberacao ? (
                            <div className="flex items-center gap-1 text-sm text-blue-600">
                              <Calendar className="w-4 h-4" />
                              {new Date(disease.data_liberacao).toLocaleDateString('pt-BR')}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/doencas/geral`)}
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/diseases/edit/${disease.id}`)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivationToggle(disease)}
                              className={disease.ativo ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                            >
                              {disease.ativo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(disease.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activation Modal */}
      {showActivationModal && selectedDisease && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowActivationModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Gerenciar Status da Doença
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{selectedDisease.nome}</strong> - Como deseja gerenciar a exibição desta doença?
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => handleActivationSubmit('activate')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <ToggleRight className="w-4 h-4 mr-2" />
                Ativar Agora
              </Button>
              
              <Button
                onClick={() => handleActivationSubmit('deactivate')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ToggleLeft className="w-4 h-4 mr-2" />
                Desativar
              </Button>
              
              <Button
                onClick={handleScheduleClick}
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Liberação
              </Button>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowActivationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedDisease && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowScheduleModal(false);
            setSelectedDate(undefined);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Agendar Liberação
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{selectedDisease.nome}</strong> - Selecione a data para liberação:
            </p>
            
            <div className="space-y-4">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Selecione uma data"
              />
              
              {selectedDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Data selecionada:</strong> {selectedDate.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedDate(undefined);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleScheduleSubmit}
                disabled={!selectedDate}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

