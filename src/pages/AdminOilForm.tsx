import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PhotoGalleryInput } from "@/components/ui/photo-gallery-input";
import { ChemicalCompositionTable, ChemicalComponent } from "@/components/ui/chemical-composition-table";
import { oilsApi, CreateOilData } from "@/services/oilsApi";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

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

  // Estados para tags (arrays)
  const [aromaTags, setAromaTags] = useState<string[]>([]);
  const [categoriaTags, setCategoriaTags] = useState<string[]>([]);
  const [compostoQuimicoTags, setCompostoQuimicoTags] = useState<string[]>([]);
  const [psicoaromaTags, setPsicoaromaTags] = useState<string[]>([]);
  const [esteticaTags, setEsteticaTags] = useState<string[]>([]);
  const [saudeTags, setSaudeTags] = useState<string[]>([]);
  const [espiritualTags, setEspiritualTags] = useState<string[]>([]);
  const [ambientalTags, setAmbientalTags] = useState<string[]>([]);
  const [contraindicacaoTags, setContraindicacaoTags] = useState<string[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [chemicalComponents, setChemicalComponents] = useState<ChemicalComponent[]>([]);

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
      
      // Converter strings em arrays para as tags
      setAromaTags(oil.aroma ? oil.aroma.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setCategoriaTags(oil.categoria_aromatica ? oil.categoria_aromatica.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setCompostoQuimicoTags(oil.composto_quimico ? oil.composto_quimico.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setPsicoaromaTags(oil.psicoaromas ? oil.psicoaromas.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setEsteticaTags(oil.estetica ? oil.estetica.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setSaudeTags(oil.saude_fisica ? oil.saude_fisica.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setEspiritualTags(oil.espirituais ? oil.espirituais.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setAmbientalTags(oil.ambientais ? oil.ambientais.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setContraindicacaoTags(oil.contraindicacao ? oil.contraindicacao.split(',').map(tag => tag.trim()).filter(Boolean) : []);
      setGalleryPhotos(oil.galeria_fotos ? oil.galeria_fotos.split(',').map(url => url.trim()).filter(Boolean) : []);
      
      // Carregar componentes químicos da composição
      if (oil.composicao_quimica_majoritaria) {
        try {
          const components = JSON.parse(oil.composicao_quimica_majoritaria);
          setChemicalComponents(Array.isArray(components) ? components : []);
        } catch {
          // Se não for JSON válido, tratar como string vazia
          setChemicalComponents([]);
        }
      } else {
        setChemicalComponents([]);
      }
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
      // Converter arrays de tags em strings
      const dataToSubmit = {
        ...formData,
        aroma: aromaTags.join(', '),
        categoria_aromatica: categoriaTags.join(', '),
        composto_quimico: compostoQuimicoTags.join(', '),
        composicao_quimica_majoritaria: JSON.stringify(chemicalComponents),
        psicoaromas: psicoaromaTags.join(', '),
        estetica: esteticaTags.join(', '),
        saude_fisica: saudeTags.join(', '),
        espirituais: espiritualTags.join(', '),
        ambientais: ambientalTags.join(', '),
        contraindicacao: contraindicacaoTags.join(', '),
        galeria_fotos: galleryPhotos.join(', '),
      };

      if (id) {
        await oilsApi.update(id, dataToSubmit, token!);
        alert("Óleo atualizado com sucesso!");
      } else {
        await oilsApi.create(dataToSubmit, token!);
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {id ? "Editar" : "Novo"} Óleo Essencial
          </h1>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Lavanda Francesa"
                    className="mt-1"
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
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="familia_botanica">Família Botânica</Label>
                  <Input
                    id="familia_botanica"
                    name="familia_botanica"
                    value={formData.familia_botanica}
                    onChange={handleChange}
                    placeholder="Ex: Lamiaceae"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="forma_extracao">Forma de Extração</Label>
                  <Input
                    id="forma_extracao"
                    name="forma_extracao"
                    value={formData.forma_extracao}
                    onChange={handleChange}
                    placeholder="Ex: Destilação a vapor"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="parte_planta">Parte da Planta</Label>
                  <Input
                    id="parte_planta"
                    name="parte_planta"
                    value={formData.parte_planta}
                    onChange={handleChange}
                    placeholder="Ex: Flores"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="avatar">URL da Imagem</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <RichTextEditor
                  value={formData.descricao}
                  onChange={(value) => setFormData(prev => ({ ...prev, descricao: value }))}
                  placeholder="Descrição detalhada do óleo essencial..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Propriedades Químicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Propriedades Químicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="familia_quimica">Família Química</Label>
                  <Input
                    id="familia_quimica"
                    name="familia_quimica"
                    value={formData.familia_quimica}
                    onChange={handleChange}
                    placeholder="Ex: Monoterpenos"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Composto Químico Principal</Label>
                  <TagInput
                    value={compostoQuimicoTags}
                    onChange={setCompostoQuimicoTags}
                    placeholder="Digite os compostos químicos principais..."
                    className="mt-1"
                  />
                </div>
              </div>

              <ChemicalCompositionTable
                value={chemicalComponents}
                onChange={setChemicalComponents}
                className="mt-4"
              />
            </CardContent>
          </Card>

          {/* Propriedades Aromáticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Propriedades Aromáticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Aroma</Label>
                <TagInput
                  value={aromaTags}
                  onChange={setAromaTags}
                  placeholder="Digite as características do aroma..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Categoria Aromática</Label>
                <TagInput
                  value={categoriaTags}
                  onChange={setCategoriaTags}
                  placeholder="Digite as categorias aromáticas..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Aplicações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Aplicações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Psicoaroma (Emocional/Psicológica)</Label>
                <TagInput
                  value={psicoaromaTags}
                  onChange={setPsicoaromaTags}
                  placeholder="Digite os efeitos emocionais e psicológicos..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Estética (Pele/Cabelo/Unhas)</Label>
                <TagInput
                  value={esteticaTags}
                  onChange={setEsteticaTags}
                  placeholder="Digite os benefícios estéticos..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Saúde Física</Label>
                <TagInput
                  value={saudeTags}
                  onChange={setSaudeTags}
                  placeholder="Digite os benefícios para a saúde física..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Espiritual/Vibracional</Label>
                <TagInput
                  value={espiritualTags}
                  onChange={setEspiritualTags}
                  placeholder="Digite as propriedades espirituais e vibracionais..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Ambiental</Label>
                <TagInput
                  value={ambientalTags}
                  onChange={setAmbientalTags}
                  placeholder="Digite os usos ambientais..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contraindicações e Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Contraindicações e Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Contraindicações</Label>
                <TagInput
                  value={contraindicacaoTags}
                  onChange={setContraindicacaoTags}
                  placeholder="Digite as contraindicações..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Contraindicações e Preocupações Adicionais</Label>
                <RichTextEditor
                  value={formData.contraindicacoes_preocupacoes}
                  onChange={(value) => setFormData(prev => ({ ...prev, contraindicacoes_preocupacoes: value }))}
                  placeholder="Informações adicionais sobre contraindicações..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Óleos Substitutos</Label>
                <RichTextEditor
                  value={formData.substitutos}
                  onChange={(value) => setFormData(prev => ({ ...prev, substitutos: value }))}
                  placeholder="Liste óleos que podem substituir este..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Sugestões de Combinações</Label>
                <RichTextEditor
                  value={formData.combinacoes}
                  onChange={(value) => setFormData(prev => ({ ...prev, combinacoes: value }))}
                  placeholder="Sugestões de combinações com outros óleos..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Galeria de Fotos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Galeria de Fotos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Adicionar Fotos</Label>
                <PhotoGalleryInput
                  value={galleryPhotos}
                  onChange={setGalleryPhotos}
                  placeholder="Digite a URL da foto e pressione Enter"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : id ? "Atualizar" : "Criar"} Óleo
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
