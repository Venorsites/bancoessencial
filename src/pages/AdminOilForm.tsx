import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { oilsApi, CreateOilData } from "@/services/oilsApi";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminOilForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateOilData>({
    nome: "",
    nome_cientifico: "",
    descricao: "",
    familia_botanica: "",
    forma_extracao: "",
    aroma: "",
    parte_planta: "",
    familia_quimica: "",
    avatar: "",
    composto_quimico: "",
    categoria_aromatica: "",
    psicoaromas: "",
    estetica: "",
    saude_fisica: "",
    espirituais: "",
    ambientais: "",
    contraindicacao: "",
    contraindicacoes_preocupacoes: "",
    composicao_quimica_majoritaria: "",
    substitutos: "",
    combinacoes: "",
    galeria_fotos: "",
  });

  useEffect(() => {
    if (!user || user.role?.toUpperCase() !== 'ADMIN') {
      navigate('/');
      return;
    }

    if (id) {
      loadOil();
    }
  }, [id, user, navigate]);

  const loadOil = async () => {
    try {
      const oil = await oilsApi.getById(id!);
      setFormData(oil);
    } catch (err) {
      alert("Erro ao carregar óleo");
      navigate('/admin');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await oilsApi.update(id, formData, token!);
        alert("Óleo atualizado com sucesso!");
      } else {
        await oilsApi.create(formData, token!);
        alert("Óleo criado com sucesso!");
      }
      navigate('/admin');
    } catch (err: any) {
      alert(err.message || "Erro ao salvar óleo");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role?.toUpperCase() !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {id ? "Editar" : "Novo"} Óleo Essencial
          </h1>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800">
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Lavanda Francesa"
                  />
                </div>

                <div>
                  <Label htmlFor="nome_cientifico">Nome Científico *</Label>
                  <Input
                    id="nome_cientifico"
                    name="nome_cientifico"
                    value={formData.nome_cientifico}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Lavandula angustifolia"
                  />
                </div>

                <div>
                  <Label htmlFor="familia_botanica">Família Botânica *</Label>
                  <Input
                    id="familia_botanica"
                    name="familia_botanica"
                    value={formData.familia_botanica}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Lamiaceae"
                  />
                </div>

                <div>
                  <Label htmlFor="forma_extracao">Forma de Extração *</Label>
                  <Input
                    id="forma_extracao"
                    name="forma_extracao"
                    value={formData.forma_extracao}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Destilação a vapor"
                  />
                </div>

                <div>
                  <Label htmlFor="parte_planta">Parte da Planta *</Label>
                  <Input
                    id="parte_planta"
                    name="parte_planta"
                    value={formData.parte_planta}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Flores e folhas"
                  />
                </div>

                <div>
                  <Label htmlFor="aroma">Aroma *</Label>
                  <Input
                    id="aroma"
                    name="aroma"
                    value={formData.aroma}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Floral, herbáceo, doce"
                  />
                </div>

                <div>
                  <Label htmlFor="avatar">URL da Imagem</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    type="url"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="categoria_aromatica">Categoria Aromática</Label>
                  <Input
                    id="categoria_aromatica"
                    name="categoria_aromatica"
                    value={formData.categoria_aromatica}
                    onChange={handleChange}
                    placeholder="Ex: Floral"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Descrição geral do óleo essencial"
                />
              </div>
            </div>

            {/* Química */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800">
                Composição Química
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="familia_quimica">Família Química *</Label>
                  <Input
                    id="familia_quimica"
                    name="familia_quimica"
                    value={formData.familia_quimica}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Monoterpenóis"
                  />
                </div>

                <div>
                  <Label htmlFor="composto_quimico">Composto Químico Principal</Label>
                  <Input
                    id="composto_quimico"
                    name="composto_quimico"
                    value={formData.composto_quimico}
                    onChange={handleChange}
                    placeholder="Ex: Linalol (25-38%)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="composicao_quimica_majoritaria">
                  Composição Química Majoritária
                </Label>
                <Textarea
                  id="composicao_quimica_majoritaria"
                  name="composicao_quimica_majoritaria"
                  value={formData.composicao_quimica_majoritaria}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Composição química detalhada"
                />
              </div>
            </div>

            {/* Propriedades */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800">
                Propriedades e Usos
              </h2>

              <div>
                <Label htmlFor="psicoaromas">Psicoaroma (Emocional/Psicológica)</Label>
                <Textarea
                  id="psicoaromas"
                  name="psicoaromas"
                  value={formData.psicoaromas}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Efeitos emocionais e psicológicos"
                />
              </div>

              <div>
                <Label htmlFor="estetica">Estética (Pele/Cabelo/Unhas)</Label>
                <Textarea
                  id="estetica"
                  name="estetica"
                  value={formData.estetica}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Aplicações estéticas"
                />
              </div>

              <div>
                <Label htmlFor="saude_fisica">Saúde Física</Label>
                <Textarea
                  id="saude_fisica"
                  name="saude_fisica"
                  value={formData.saude_fisica}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Benefícios para saúde física"
                />
              </div>

              <div>
                <Label htmlFor="espirituais">Espiritual/Vibracional</Label>
                <Textarea
                  id="espirituais"
                  name="espirituais"
                  value={formData.espirituais}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Aspectos espirituais e vibracionais"
                />
              </div>

              <div>
                <Label htmlFor="ambientais">Ambiental</Label>
                <Textarea
                  id="ambientais"
                  name="ambientais"
                  value={formData.ambientais}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Usos ambientais"
                />
              </div>
            </div>

            {/* Contraindicações */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800">
                Contraindicações
              </h2>

              <div>
                <Label htmlFor="contraindicacao">Contraindicações</Label>
                <Textarea
                  id="contraindicacao"
                  name="contraindicacao"
                  value={formData.contraindicacao}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Contraindicações principais"
                />
              </div>

              <div>
                <Label htmlFor="contraindicacoes_preocupacoes">
                  Contraindicações e Preocupações Adicionais
                </Label>
                <Textarea
                  id="contraindicacoes_preocupacoes"
                  name="contraindicacoes_preocupacoes"
                  value={formData.contraindicacoes_preocupacoes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Preocupações adicionais"
                />
              </div>
            </div>

            {/* Outros */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-purple-800">
                Outras Informações
              </h2>

              <div>
                <Label htmlFor="substitutos">Óleos Substitutos</Label>
                <Textarea
                  id="substitutos"
                  name="substitutos"
                  value={formData.substitutos}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Óleos que podem ser usados como substitutos"
                />
              </div>

              <div>
                <Label htmlFor="combinacoes">Sugestões de Combinações</Label>
                <Textarea
                  id="combinacoes"
                  name="combinacoes"
                  value={formData.combinacoes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Combinações sugeridas com outros óleos"
                />
              </div>

              <div>
                <Label htmlFor="galeria_fotos">
                  Galeria de Fotos (URLs separadas por vírgula)
                </Label>
                <Textarea
                  id="galeria_fotos"
                  name="galeria_fotos"
                  value={formData.galeria_fotos}
                  onChange={handleChange}
                  rows={2}
                  placeholder="https://exemplo1.com/foto1.jpg, https://exemplo2.com/foto2.jpg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

