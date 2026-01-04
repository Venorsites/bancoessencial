import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { doencasApi, doencasGestacaoApi, doencasMenopausaApi, doencasPediatricaApi, CreateDoencaGeralData } from "@/services/doencasApi";
import { useAuth } from "@/contexts/AuthContext";

type DiseaseCategory = 'geral' | 'gestacao' | 'menopausa' | 'pediatrica';

const categoryConfig = {
  geral: { label: 'Geral', api: doencasApi },
  gestacao: { label: 'Gestação', api: doencasGestacaoApi },
  menopausa: { label: 'Menopausa', api: doencasMenopausaApi },
  pediatrica: { label: 'Pediátrica', api: doencasPediatricaApi },
};

export default function AdminDiseaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const isEditing = !!id;
  
  const categoryParam = searchParams.get('category') as DiseaseCategory;
  const [selectedCategory] = useState<DiseaseCategory>(categoryParam || 'geral');

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateDoencaGeralData>({
    nome: "",
    categoria: "",
    descricao_short: "",
    oleos_recomendados: [],
    sintomas_comuns: [],
    forma_uso: "",
  });

  // Separate state for UI arrays
  const [formaUsoArray, setFormaUsoArray] = useState<string[]>([]);

  const [newOil, setNewOil] = useState("");
  const [newSymptom, setNewSymptom] = useState("");
  const [newFormaUso, setNewFormaUso] = useState("");

  useEffect(() => {
    if (isEditing) {
      loadDisease();
    }
  }, [id]);

  const getCurrentApi = () => categoryConfig[selectedCategory].api;

  const loadDisease = async () => {
    try {
      setLoadingData(true);
      const api = getCurrentApi();
      const disease = await api.getById(id!);
      
      // Parse forma_uso from string to array
      let formaUsoArrayData: string[] = [];
      if (disease.forma_uso) {
        try {
          // Try to parse as JSON array first
          formaUsoArrayData = JSON.parse(disease.forma_uso);
        } catch {
          // If not JSON, split by comma and trim
          formaUsoArrayData = disease.forma_uso.split(',').map(item => item.trim()).filter(item => item);
        }
      }
      
      setFormData({
        nome: disease.nome,
        categoria: disease.categoria,
        descricao_short: disease.descricao_short,
        oleos_recomendados: disease.oleos_recomendados || [],
        sintomas_comuns: disease.sintomas_comuns || [],
        forma_uso: disease.forma_uso || "",
      });
      
      setFormaUsoArray(formaUsoArrayData);
    } catch (err) {
      setError("Erro ao carregar doença");
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Você precisa estar autenticado para criar/editar doenças');
        setLoading(false);
        return;
      }

      // Prepare data for submission - convert forma_uso array to string
      const dataToSubmit = {
        ...formData,
        forma_uso: formaUsoArray.join(', '),
      };

      console.log('Criando doença com categoria:', selectedCategory);
      console.log('Dados:', dataToSubmit);
      console.log('Token:', token);

      const api = getCurrentApi();
      if (isEditing) {
        await api.update(id!, dataToSubmit, token);
      } else {
        await api.create(dataToSubmit, token);
      }

      navigate("/admin/diseases");
    } catch (err: any) {
      const errorMessage = err?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} doença`;
      setError(errorMessage);
      console.error('Erro completo:', err);
      console.error('Status:', err?.response?.status);
      console.error('Response:', err?.response);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addOil = () => {
    if (newOil.trim() && !formData.oleos_recomendados?.includes(newOil.trim())) {
      setFormData((prev) => ({
        ...prev,
        oleos_recomendados: [...(prev.oleos_recomendados || []), newOil.trim()],
      }));
      setNewOil("");
    }
  };

  const removeOil = (oil: string) => {
    setFormData((prev) => ({
      ...prev,
      oleos_recomendados: (prev.oleos_recomendados || []).filter((o) => o !== oil),
    }));
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !formData.sintomas_comuns?.includes(newSymptom.trim())) {
      setFormData((prev) => ({
        ...prev,
        sintomas_comuns: [...(prev.sintomas_comuns || []), newSymptom.trim()],
      }));
      setNewSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      sintomas_comuns: (prev.sintomas_comuns || []).filter((s) => s !== symptom),
    }));
  };

  const addFormaUso = () => {
    if (newFormaUso.trim() && !formaUsoArray.includes(newFormaUso.trim())) {
      setFormaUsoArray((prev) => [...prev, newFormaUso.trim()]);
      setNewFormaUso("");
    }
  };

  const removeFormaUso = (formaUso: string) => {
    setFormaUsoArray((prev) => prev.filter((f) => f !== formaUso));
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando doença...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/diseases")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Editar Doença" : "Nova Doença"}
          </h1>
            <Badge className="bg-purple-600 text-white">
              {categoryConfig[selectedCategory].label}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? "Atualize as informações da doença"
              : "Adicione uma nova doença ao banco de dados"}
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Informações Básicas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome da Doença *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Ex: Ansiedade"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Input
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        placeholder="Ex: Mental, Pele, Respiratório"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descricao_short">Descrição</Label>
                    <Textarea
                      id="descricao_short"
                      name="descricao_short"
                      value={formData.descricao_short}
                      onChange={handleInputChange}
                      placeholder="Descrição breve da doença ou condição (opcional)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Óleos Recomendados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Óleos Recomendados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newOil}
                      onChange={(e) => setNewOil(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOil())}
                      placeholder="Nome do óleo essencial"
                    />
                    <Button type="button" onClick={addOil} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.oleos_recomendados?.map((oil) => (
                      <Badge key={oil} variant="default" className="px-3 py-1">
                        {oil}
                        <button
                          type="button"
                          onClick={() => removeOil(oil)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sintomas Comuns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sintomas Comuns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSymptom())}
                      placeholder="Sintoma"
                    />
                    <Button type="button" onClick={addSymptom} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.sintomas_comuns?.map((symptom) => (
                      <Badge key={symptom} variant="outline" className="px-3 py-1">
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Forma de Uso */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Forma de Uso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newFormaUso}
                      onChange={(e) => setNewFormaUso(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFormaUso())}
                      placeholder="Método de uso (ex: Inalação, Massagem, Banho)"
                    />
                    <Button type="button" onClick={addFormaUso} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formaUsoArray.map((formaUso) => (
                      <Badge key={formaUso} variant="secondary" className="px-3 py-1">
                        {formaUso}
                        <button
                          type="button"
                          onClick={() => removeFormaUso(formaUso)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Botões */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-4 justify-end"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/diseases")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Atualizar" : "Criar"} Doença
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}

