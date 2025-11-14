import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { oilsApi, Oil } from "@/services/oilsApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function AdminOils() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [oils, setOils] = useState<Oil[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedOil, setSelectedOil] = useState<Oil | null>(null);

  useEffect(() => {
    loadOils();
  }, []);

  const loadOils = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await oilsApi.getAll(undefined, false); // activeOnly = false para admin
      setOils(data);
    } catch (err) {
      setError("Erro ao carregar óleos essenciais");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este óleo?")) {
      return;
    }

    try {
      await oilsApi.delete(id, token!);
      setOils(oils.filter(oil => oil.id !== id));
    } catch (err) {
      alert("Erro ao deletar óleo");
      console.error(err);
    }
  };

  const handleActivationToggle = (oil: Oil) => {
    setSelectedOil(oil);
    setShowActivationModal(true);
  };

  const handleActivationSubmit = async (action: 'activate' | 'deactivate') => {
    if (!selectedOil || !token) return;

    try {
      const ativo = action === 'activate';
      const updatedOil = await oilsApi.toggleActivation(selectedOil.id, ativo, undefined, token);

      // Atualizar a lista local
      const updatedOils = oils.map(oil => 
        oil.id === selectedOil.id ? updatedOil : oil
      );
      setOils(updatedOils);
      setShowActivationModal(false);
      setSelectedOil(null);
    } catch (err) {
      alert("Erro ao atualizar status do óleo");
      console.error(err);
    }
  };

  const filteredOils = oils.filter((oil) =>
    oil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    oil.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando óleos essenciais...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Óleos Essenciais</h1>
          <p className="text-gray-600">Gerencie o banco de dados de óleos essenciais</p>
        </div>
        <Button
          onClick={() => navigate('/admin/oils/new')}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Óleo
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
            placeholder="Buscar óleo essencial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <p className="text-red-600">{error}</p>
          <Button onClick={loadOils} variant="outline" size="sm" className="mt-2">
            Tentar Novamente
          </Button>
        </motion.div>
      )}

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
                <p className="text-sm text-gray-600">Total de Óleos</p>
                <p className="text-2xl font-bold text-purple-600">{oils.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Óleos Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {oils.filter(oil => oil.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Óleos Essenciais Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOils.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Nenhum óleo encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Família</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-right p-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOils.map((oil, index) => (
                      <motion.tr
                        key={oil.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={oil.avatar || "https://via.placeholder.com/40"}
                              alt={oil.nome}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{oil.nome}</p>
                              <p className="text-sm text-gray-500 italic">
                                {oil.nome_cientifico}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-700">{oil.familia_botanica}</span>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={oil.ativo ? "default" : "secondary"}
                            className={oil.ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {oil.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/oleos/${oil.id}`)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/oils/edit/${oil.id}`)}
                              className="text-purple-600 hover:bg-purple-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivationToggle(oil)}
                              className={oil.ativo ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                            >
                              {oil.ativo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(oil.id)}
                              className="text-red-600 hover:bg-red-50"
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

      {/* Empty State */}
      {!loading && !error && filteredOils.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "Nenhum óleo encontrado" : "Nenhum óleo cadastrado"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? "Tente ajustar os termos de busca" 
              : "Comece adicionando seu primeiro óleo essencial"
            }
          </p>
          {!searchTerm && (
            <Button
              onClick={() => navigate('/admin/oils/new')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Óleo
            </Button>
          )}
        </motion.div>
      )}

      {/* Activation Modal */}
      {showActivationModal && selectedOil && (
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
              Gerenciar Status do Óleo
            </h3>
            <p className="text-gray-600 mb-6">
              <strong>{selectedOil.nome}</strong> - Como deseja gerenciar a exibição deste óleo?
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
