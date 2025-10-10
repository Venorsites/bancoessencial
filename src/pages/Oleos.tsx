import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Heart, ChevronDown, ChevronRight, AlertTriangle, Atom, CheckSquare, Beaker, X, Info, ExternalLink } from "lucide-react";
import { oilsApi, Oil } from "@/services/oilsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockOils = [
  {
    id: 1,
    name: "Lavanda Francesa",
    scientificName: "Lavandula angustifolia",
    family: "Lamiaceae",
    extractionMethod: "Destilação a vapor",
    aroma: "Floral, herbáceo, doce",
    mainCompound: "Linalol (25-38%)",
    mainChemicalFamily: "Monoterpenóis",
    plantPart: "Flores e folhas",
    psychoaroma: "Calmante, relaxante, equilibrante emocional. Ajuda na ansiedade, estresse e insônia.",
    aesthetic: "Antisséptico, cicatrizante, regenerador celular. Ideal para acne, queimaduras e envelhecimento da pele.",
    health: "Antisséptico, analgésico, antiespasmódico. Alivia dores musculares, problemas respiratórios e digestivos.",
    spiritual: "Purificação, proteção, paz interior. Ajuda na meditação e equilíbrio energético.",
    environmental: "Purificante, repelente natural, harmonizador de ambientes.",
    contraindications: "Não usar em gestantes no primeiro trimestre. Pode causar sonolência excessiva.",
    aromaticCategory: "Floral",
    description: "Óleo essencial versátil e seguro, conhecido por suas propriedades calmantes e cicatrizantes.",
    image: "https://i.ibb.co/8LVrD6ZM/Lavanda-Francesa.webp",
    category: "Floral",
    chemicalGroup: "Ésteres",
    properties: ["Calmante", "Antisséptico", "Cicatrizante"],
    uses: ["Ansiedade", "Insônia", "Queimaduras"],
    isFavorite: true,
  },
  {
    id: 2,
    name: "Tea Tree (Melaleuca)",
    scientificName: "Melaleuca alternifolia",
    family: "Myrtaceae",
    extractionMethod: "Destilação a vapor",
    aroma: "Medicinal, fresco, herbáceo",
    mainCompound: "Terpinen-4-ol (30-48%)",
    mainChemicalFamily: "Monoterpenóis",
    plantPart: "Folhas e ramos",
    psychoaroma: "Estimulante mental, clareza de pensamento, foco e concentração.",
    aesthetic: "Antifúngico, antibacteriano, regulador sebáceo. Excelente para acne, caspa e infecções cutâneas.",
    health: "Antibacteriano, antiviral, antifúngico. Fortalece o sistema imunológico.",
    spiritual: "Proteção, purificação, limpeza energética. Remove energias negativas.",
    environmental: "Desinfetante natural, purificador de ar, repelente de insetos.",
    contraindications: "Não usar em gestantes. Pode causar irritação em peles sensíveis.",
    aromaticCategory: "Medicinal",
    description: "Óleo essencial poderoso com propriedades antimicrobianas excepcionais.",
    image: "https://i.ibb.co/S7XSps0y/Tea-tree.webp",
    category: "Medicinal",
    chemicalGroup: "Monoterpenos",
    properties: ["Antifúngico", "Antibacteriano", "Antiviral"],
    uses: ["Acne", "Caspa", "Infecções"],
    isFavorite: false,
  },
  {
    id: 3,
    name: "Eucalipto Citriodora",
    scientificName: "Eucalyptus citriodora/ Corymbia citriodora",
    family: "Myrtaceae",
    extractionMethod: "Destilação a vapor",
    aroma: "Cítrico, fresco, mentolado",
    mainCompound: "Citronelal (65-85%)",
    mainChemicalFamily: "Aldeídos",
    plantPart: "Folhas",
    psychoaroma: "Estimulante mental, clareza, foco e concentração. Ajuda na memória.",
    aesthetic: "Antisséptico, adstringente, regulador sebáceo. Ideal para peles oleosas.",
    health: "Expectorante, descongestionante, antimicrobiano. Excelente para problemas respiratórios.",
    spiritual: "Clareza mental, proteção, limpeza energética. Remove bloqueios mentais.",
    environmental: "Purificante, repelente natural, refrescante de ambientes.",
    contraindications: "Não usar em gestantes. Pode irritar mucosas sensíveis.",
    aromaticCategory: "Respiratório",
    description: "Óleo essencial com aroma cítrico único, excelente para problemas respiratórios.",
    image: "https://i.ibb.co/qMWzfMvN/Eucalipito-Citriodora.webp",
    category: "Respiratório",
    chemicalGroup: "Óxidos",
    properties: ["Expectorante", "Descongestionante", "Antibacteriano"],
    uses: ["Gripe", "Tosse", "Sinusite"],
    isFavorite: false,
  },
  {
    id: 4,
    name: "Alecrim qt. Cineol",
    scientificName: "Rosmarinus officinalis | Salvia rosmarinus",
    family: "Lamiaceae",
    extractionMethod: "Destilação a vapor",
    aroma: "Herbáceo, fresco, estimulante",
    mainCompound: "1,8-Cineol (45-65%)",
    mainChemicalFamily: "Óxidos",
    plantPart: "Folhas e flores",
    psychoaroma: "Estimulante mental, melhora memória, foco e concentração. Antidepressivo natural.",
    aesthetic: "Antisséptico, adstringente, estimulante circulatório. Melhora celulite e retenção.",
    health: "Expectorante, antimicrobiano, estimulante circulatório. Fortalece sistema imunológico.",
    spiritual: "Proteção, clareza mental, força interior. Ajuda na tomada de decisões.",
    environmental: "Purificante, estimulante, harmonizador de ambientes de trabalho.",
    contraindications: "Não usar em gestantes. Pode elevar pressão arterial.",
    aromaticCategory: "Medicinal",
    description: "Óleo essencial estimulante com propriedades expectorantes e circulatórias.",
    image: "https://i.ibb.co/GQQTV91n/leo-Essencial-de-Alecrim-qt-Cineol.webp",
    category: "Medicinal",
    chemicalGroup: "Óxidos",
    properties: ["Estimulante", "Antimicrobiano", "Expectorante"],
    uses: ["Fadiga", "Congestão", "Concentração"],
    isFavorite: false,
  },
  {
    id: 5,
    name: "Bergamota",
    scientificName: "Citrus x bergamia | Citrus bergamia",
    family: "Rutaceae",
    extractionMethod: "Expressão a frio",
    aroma: "Cítrico, fresco, floral",
    mainCompound: "Limoneno (25-45%)",
    mainChemicalFamily: "Monoterpenos",
    plantPart: "Casca do fruto",
    psychoaroma: "Antidepressivo, equilibrante emocional, alegria e otimismo. Reduz ansiedade.",
    aesthetic: "Antisséptico, adstringente, regulador sebáceo. Ideal para peles mistas.",
    health: "Antisséptico, digestivo, antiespasmódico. Ajuda na digestão e cólicas.",
    spiritual: "Alegria, abundância, prosperidade. Atrai energias positivas.",
    environmental: "Purificante, refrescante, harmonizador de ambientes sociais.",
    contraindications: "Fotossensibilizante - não expor ao sol por 12h após uso. Não usar em gestantes.",
    aromaticCategory: "Cítrico",
    description: "Óleo essencial cítrico com propriedades antidepressivas e digestivas.",
    image: "https://i.ibb.co/QvqT62Sq/Bergamota.webp",
    category: "Cítrico",
    chemicalGroup: "Monoterpenos",
    properties: ["Antidepressivo", "Antisséptico", "Digestivo"],
    uses: ["Ansiedade", "Depressão", "Digestão"],
    isFavorite: false,
  },
];

const categories = ["Todos", "Floral", "Medicinal", "Respiratório", "Cítrico"];
const chemicalGroups = ["Todos", "Ésteres", "Monoterpenos", "Óxidos", "Aldeídos"];

export default function Oleos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedChemicalGroup, setSelectedChemicalGroup] = useState("Todos");
  const [oils, setOils] = useState<Oil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOil, setSelectedOil] = useState<Oil | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    contraindications: false,
    chemistry: false,
    substitutes: false,
    combinations: false
  });

  useEffect(() => {
    loadOils();
  }, []);

  const loadOils = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await oilsApi.getAll();
      setOils(data);
    } catch (err) {
      setError("Erro ao carregar óleos essenciais. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setOils((o) =>
      o.map((oil) =>
        oil.id === id ? { ...oil, isFavorite: !oil.isFavorite } : oil
      )
    );
  };

  const openOilModal = (oil: any) => {
    setSelectedOil(oil);
    setExpandedSections({
      contraindications: false,
      chemistry: false,
      substitutes: false,
      combinations: false
    });
  };

  const closeOilModal = () => {
    setSelectedOil(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const filteredOils = oils.filter((oil) => {
    const matchesSearch =
      oil.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oil.nome_cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (oil.familia_botanica && oil.familia_botanica.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (oil.aroma && oil.aroma.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "Todos" || (oil.categoria_aromatica && oil.categoria_aromatica === selectedCategory);
    const matchesChemicalGroup =
      selectedChemicalGroup === "Todos" ||
      (oil.familia_quimica && oil.familia_quimica === selectedChemicalGroup);

    return matchesSearch && matchesCategory && matchesChemicalGroup;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/N2CVmNZL/Banco-de-Dados-leos-Essenciais-Fichas-Completas.webp"
          alt="Banner Banco de Dados Essencial - Óleos Essenciais"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-top"
        />
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* ===== Bloco informacional + drops ===== */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Banco de Dados Essencial – Óleos Essenciais (Fichas Completas)
          </h1>

          {/* Caixa com texto e fundo roxo leve APENAS no parágrafo */}
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-100/50 p-5">
            <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-200">
                  <Info className="h-5 w-5 text-purple-700" />
                </span>
              </div>
              <p className="leading-relaxed text-[15px] text-neutral-700">
                Este é o seu <strong>banco de dados de pesquisa</strong> sobre óleos essenciais, que será
                constantemente atualizado e ajustado com as informações mais recentes. Aqui, você encontrará
                detalhes sobre a composição química, propriedades terapêuticas, indicações de uso e muito mais,
                tudo cuidadosamente organizado para consultas rápidas e eficazes.
              </p>
            </div>
          </div>

          {/* Drops sem fundo + chevron próximo ao texto + tipografia do tamanho do parágrafo */}
          <div className="mt-4 space-y-2">
            {/* Drop 1 */}
            <details className="group px-2 py-3 rounded-lg">
              <summary className="flex items-center gap-2 cursor-pointer list-none select-none">
                <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" />
                <span className="text-[15px] font-semibold text-neutral-900">
                  E se eu encontrar alguma informação incorreta?
                </span>
              </summary>
              <div className="mt-3 text-[15px] text-neutral-700 leading-relaxed pl-7">
                Se você perceber alguma informação errada ou desatualizada, é só entrar em contato comigo pelo
                e-mail{" "}
                <a href="mailto:suporte@daianealaniz.com.br" className="text-purple-700 underline">
                  suporte@daianealaniz.com.br
                </a>.
                O banco de dados está sempre sendo atualizado, então <strong>pode acontecer de algo precisar de ajustes</strong>.
                Assim que você me avisar, vou revisar as fontes e, se necessário, buscar novos estudos para garantir
                que tudo esteja correto. A ideia é manter as informações sempre precisas para que o uso dos óleos
                essenciais seja o mais <strong>seguro e eficaz</strong> possível!
              </div>
            </details>

            {/* Linha sutil divisória */}
            <div className="h-px bg-neutral-200/70 mx-1" />

            {/* Drop 2 */}
            <details className="group px-2 py-3 rounded-lg">
              <summary className="flex items-center gap-2 cursor-pointer list-none select-none">
                <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" />
                <span className="text-[15px] font-semibold text-neutral-900">
                  Regras de Convivência e Compartilhamento
                </span>
              </summary>
              <div className="mt-3 text-[15px] text-neutral-700 leading-relaxed pl-7">
                <ul className="space-y-3 list-disc pl-5">
                  <li>
                    <strong>Não compartilhe seu acesso:</strong> o acesso ao banco de dados e aos conteúdos é pessoal e
                    intransferível. Compartilhar seu login compromete a integridade do material e não é permitido.
                  </li>
                  <li>
                    <strong>Evite copiar o conteúdo:</strong> o conteúdo aqui é exclusivo e criado com muito cuidado.
                    Copiar ou distribuir sem permissão vai contra a nossa comunidade de apoio e aprendizado.
                  </li>
                  <li>
                    <strong>Somos uma comunidade que se ajuda:</strong> se você encontrar alguma informação errada ou
                    desatualizada, me avise para que eu possa corrigir! Entre em contato pelo e-mail{" "}
                    <a href="mailto:suporte@daianealaniz.com.br" className="text-purple-700 underline">
                      suporte@daianealaniz.com.br
                    </a>.
                  </li>
                  <li>
                    <strong>Busque os conteúdos completos nas aulas:</strong> antes de replicar qualquer informação ou
                    ideia, certifique-se de buscar o conteúdo completo dentro das aulas e materiais disponíveis.
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar óleo essencial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 rounded-2xl shadow-soft"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-2xl min-w-[180px] justify-between"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-2xl min-w-[180px] justify-between"
              >
                Grupo Químico
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {chemicalGroups.map((group) => (
                <DropdownMenuItem
                  key={group}
                  onClick={() => setSelectedChemicalGroup(group)}
                >
                  {group}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Carregando óleos essenciais...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <Button onClick={loadOils} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              {filteredOils.length} óleo
              {filteredOils.length !== 1 ? "s" : ""} encontrado
              {filteredOils.length !== 1 ? "s" : ""}
            </p>
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredOils.map((oil, index) => (
            <motion.div
              key={oil.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="bg-white rounded-3xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 h-full overflow-hidden cursor-pointer" onClick={() => openOilModal(oil)}>
                {/* Image Section */}
                <div className="relative w-full h-40">
                  <img
                    src={oil.avatar || "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Óleo+Essencial"}
                    alt={oil.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* TÍTULO + FAVORITO lado a lado */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-purple-800 leading-tight">
                    {oil.nome}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(oil.id);
                    }}
                    className="rounded-full p-1"
                    aria-label={oil.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        oil.isFavorite
                          ? "fill-purple-600 text-purple-600"
                          : "text-purple-900"
                      }`}
                    />
                  </Button>
                </div>

                {/* Bottom Section - Scientific Name and Ver Mais Button */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 italic text-left">
                      {oil.nome_cientifico}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        openOilModal(oil);
                      }}
                    >
                      Ver mais
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredOils.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-muted-foreground text-lg">
              Nenhum óleo essencial encontrado com os filtros selecionados.
            </p>
          </motion.div>
        )}
      </div>

      {/* Oil Detail Modal */}
      <AnimatePresence>
        {selectedOil && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeOilModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedOil.avatar || "https://via.placeholder.com/800x300/8B5CF6/FFFFFF?text=Óleo+Essencial"}
                  alt={selectedOil.nome}
                  className="w-full h-64 object-cover rounded-t-3xl"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/oleos/${selectedOil.id}`)}
                    className="bg-white/90 hover:bg-white rounded-full"
                    title="Abrir em página dedicada"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeOilModal}
                    className="bg-white/90 hover:bg-white rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Title and Basic Info */}
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-purple-800 mb-2">
                    {selectedOil.nome}
                  </h1>
                  <p className="text-lg text-gray-600 italic">
                    {selectedOil.nome_cientifico}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedOil.descricao}
                  </p>
                </div>

                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-purple-800">Família Botânica:</h3>
                      <p className="text-gray-700">{selectedOil.familia_botanica || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Forma de Extração:</h3>
                      <p className="text-gray-700">{selectedOil.forma_extracao || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Aroma:</h3>
                      <p className="text-gray-700">{selectedOil.aroma || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Parte da Planta:</h3>
                      <p className="text-gray-700">{selectedOil.parte_planta || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-purple-800">Composto Químico Principal:</h3>
                      <p className="text-gray-700">{selectedOil.composto_quimico || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Família Química:</h3>
                      <p className="text-gray-700">{selectedOil.familia_quimica || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Categoria Aromática:</h3>
                      <p className="text-gray-700">{selectedOil.categoria_aromatica || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Properties */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Psicoaroma (Emocional/Psicológica/Mental)</h3>
                    <div className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                      {selectedOil.psicoaromas ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedOil.psicoaromas }} />
                      ) : (
                        <p>Não informado</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Estética/Pele/Cabelo/Unhas</h3>
                    <div className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                      {selectedOil.estetica ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedOil.estetica }} />
                      ) : (
                        <p>Não informado</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Saúde Física em Geral</h3>
                    <div className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                      {selectedOil.saude_fisica ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedOil.saude_fisica }} />
                      ) : (
                        <p>Não informado</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Espiritual/Vibracional</h3>
                    <div className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                      {selectedOil.espirituais ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedOil.espirituais }} />
                      ) : (
                        <p>Não informado</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">Ambiental</h3>
                    <div className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                      {selectedOil.ambientais ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedOil.ambientais }} />
                      ) : (
                        <p>Não informado</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Sections (as per the print) */}
                <div className="space-y-3">
                  {/* Contraindicações */}
                  <div className="border border-purple-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('contraindications')}
                      className="w-full p-4 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-purple-800">Contraindicações e precauções</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-purple-600 transition-transform ${expandedSections.contraindications ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSections.contraindications && (
                      <div className="p-4 bg-white border-t border-purple-200">
                        <div className="text-gray-700">
                          {selectedOil.contraindicacao ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedOil.contraindicacao }} />
                          ) : (
                            <p>Não informado</p>
                          )}
                        </div>
                        {selectedOil.contraindicacoes_preocupacoes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <h4 className="font-semibold text-purple-800 mb-2">Preocupações Adicionais:</h4>
                            <div dangerouslySetInnerHTML={{ __html: selectedOil.contraindicacoes_preocupacoes }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Composição Química */}
                  <div className="border border-purple-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('chemistry')}
                      className="w-full p-4 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Atom className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-purple-800">Composição química majoritária (aproximada)</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-purple-600 transition-transform ${expandedSections.chemistry ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSections.chemistry && (
                      <div className="p-4 bg-white border-t border-purple-200">
                        <div className="text-gray-700">
                          {selectedOil.composicao_quimica_majoritaria ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedOil.composicao_quimica_majoritaria }} />
                          ) : (
                            <p>Não informado</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Óleos Substitutos */}
                  <div className="border border-purple-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('substitutes')}
                      className="w-full p-4 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-purple-800">Possíveis óleos essenciais substitutos (considerando a química)</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-purple-600 transition-transform ${expandedSections.substitutes ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSections.substitutes && (
                      <div className="p-4 bg-white border-t border-purple-200">
                        <div className="text-gray-700">
                          {selectedOil.substitutos ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedOil.substitutos }} />
                          ) : (
                            <p>Não informado</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sugestões de Combinações */}
                  <div className="border border-purple-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('combinations')}
                      className="w-full p-4 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Beaker className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold text-purple-800">Sugestões de combinações</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-purple-600 transition-transform ${expandedSections.combinations ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSections.combinations && (
                      <div className="p-4 bg-white border-t border-purple-200">
                        <div className="text-gray-700">
                          {selectedOil.combinacoes ? (
                            <div dangerouslySetInnerHTML={{ __html: selectedOil.combinacoes }} />
                          ) : (
                            <p>Não informado</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
