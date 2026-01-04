import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { doencasApi, doencasGestacaoApi, doencasMenopausaApi, doencasPediatricaApi, DoencaGeral } from "@/services/doencasApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type DiseaseCategory = 'geral' | 'gestacao' | 'menopausa' | 'pediatrica';

const categoryConfig = {
  geral: { label: 'Geral', api: doencasApi, route: '/doencas/geral' },
  gestacao: { label: 'Gestação', api: doencasGestacaoApi, route: '/doencas/gestacao' },
  menopausa: { label: 'Menopausa', api: doencasMenopausaApi, route: '/doencas/menopausa' },
  pediatrica: { label: 'Pediátrica', api: doencasPediatricaApi, route: '/doencas/pediatrica' },
};

export function AdminDiseases() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<DiseaseCategory>('geral');
  const [diseases, setDiseases] = useState<DoencaGeral[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<DoencaGeral | null>(null);

  useEffect(() => {
    loadDiseases();
  }, [selectedCategory]);

  const getCurrentApi = () => categoryConfig[selectedCategory].api;

  const loadDiseases = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = getCurrentApi();
      const data = await api.getAll(undefined, undefined, false); // activeOnly = false para admin
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
      const api = getCurrentApi();
      await api.delete(id, token!);
      setDiseases(diseases.filter(disease => disease.id !== id));
    } catch (err) {
      alert("Erro ao deletar doença");
      console.error(err);
    }
  };

  const handleActivationToggle = (disease: DoencaGeral) => {
    setSelectedDisease(disease);
    setShowActivationModal(true);
  };

  const handleActivationSubmit = async (action: 'activate' | 'deactivate') => {
    if (!selectedDisease || !token) return;

    try {
      const ativo = action === 'activate';
      const api = getCurrentApi();
      const updatedDisease = await api.toggleActivation(selectedDisease.id, ativo, undefined, token);

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
          onClick={() => navigate(`/admin/diseases/new?category=${selectedCategory}`)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Doença
        </Button>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryConfig) as DiseaseCategory[]).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {categoryConfig[category].label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
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
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                          <Badge 
                            variant={disease.ativo ? "default" : "secondary"}
                            className={disease.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {disease.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(categoryConfig[selectedCategory].route)}
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/diseases/edit/${disease.id}?category=${selectedCategory}`)}
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
                Ativar
              </Button>
              
              <Button
                onClick={() => handleActivationSubmit('deactivate')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ToggleLeft className="w-4 h-4 mr-2" />
                Desativar
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

    </div>
  );
}

