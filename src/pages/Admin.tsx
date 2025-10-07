import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { oilsApi, Oil } from "@/services/oilsApi";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Admin() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [oils, setOils] = useState<Oil[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se é admin
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    loadOils();
  }, [user, navigate]);

  const loadOils = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await oilsApi.getAll();
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

  const filteredOils = oils.filter((oil) =>
    oil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    oil.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-2">
            Administração de Óleos Essenciais
          </h1>
          <p className="text-muted-foreground">
            Gerencie o banco de dados de óleos essenciais
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar óleo essencial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 rounded-2xl shadow-soft"
            />
          </div>
          <Button
            onClick={() => navigate('/admin/oils/new')}
            className="rounded-2xl bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Óleo
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Carregando...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <Button onClick={loadOils} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50 border-b border-purple-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                      Nome Científico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-900 uppercase tracking-wider">
                      Família
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-purple-900 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOils.map((oil, index) => (
                    <motion.tr
                      key={oil.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={oil.avatar || "https://via.placeholder.com/50"}
                          alt={oil.nome}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {oil.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 italic">
                          {oil.nome_cientifico}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {oil.familia_botanica}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/oils/edit/${oil.id}`)}
                            className="text-purple-600 hover:text-purple-900 hover:bg-purple-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(oil.id)}
                            className="text-red-600 hover:text-red-900 hover:bg-red-100"
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

            {filteredOils.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum óleo essencial encontrado.
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

