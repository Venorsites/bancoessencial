import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, ChevronRight, ChevronDown, AlertTriangle, Atom, CheckSquare, Beaker, X, Info, ExternalLink, ChevronLeft } from "lucide-react";
import { oilsApi, Oil } from "@/services/oilsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { isFavorite as isFav, toggleFavorite as toggleFav, FavoriteItem } from "@/utils/favorites";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

type OilWithFavorite = Oil & { isFavorite: boolean };

export default function Oleos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [oils, setOils] = useState<OilWithFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOil, setSelectedOil] = useState<OilWithFavorite | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    contraindications: false,
    chemistry: false,
    substitutes: false,
    combinations: false
  });
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(20);
  const [currentPage, setCurrentPage] = useState(1);
  const isFirstRender = useRef(true);

  const loadOils = async (searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);
      // Se houver termo de busca, usar a busca do backend, senão buscar todos
      const data = searchTerm 
        ? await oilsApi.getAll(searchTerm, true)
        : await oilsApi.getAll(undefined, true);
      // annotate favorites based on localStorage per user
      const withFavs: OilWithFavorite[] = data.map((oil: Oil) => ({
        ...oil,
        isFavorite: isFav('oil', oil.id, user?.id),
      }));
      setOils(withFavs);
    } catch (err) {
      setError("Erro ao carregar óleos essenciais. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar óleos na montagem inicial
  useEffect(() => {
    loadOils();
    isFirstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Buscar quando o termo de busca mudar (com debounce)
  useEffect(() => {
    // Pular na montagem inicial (já carregado no useEffect anterior)
    if (isFirstRender.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      // Se o termo estiver vazio, buscar todos os óleos, senão buscar com o termo
      loadOils(searchTerm.trim() || undefined);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const toggleFavorite = (id: string) => {
    const oil = oils.find((o) => o.id === id);
    if (!oil) return;
    const toggled = toggleFav((): FavoriteItem => ({
      id: `oil-${oil.id}`,
      type: 'oil',
      title: oil.nome || 'Óleo Essencial',
      subtitle: oil.nome_cientifico || '',
      description: oil.descricao || '',
      tags: [
        ...(oil.categoria_aromatica ? oil.categoria_aromatica.split(',').map((t: string) => t.trim()) : []),
        ...(oil.aroma ? oil.aroma.split(',').map((t: string) => t.trim()) : []),
      ].slice(0, 5),
      addedAt: new Date().toISOString(),
      image: oil.avatar,
      url: `/oleos/${oil.id}`,
    }), user?.id);
    setOils((o) =>
      o.map((it) =>
        it.id === id ? { ...it, isFavorite: toggled } : it
      )
    );
    if (selectedOil && selectedOil.id === id) {
      setSelectedOil({ ...selectedOil, isFavorite: toggled } as any);
    }
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

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  // Função para destacar links no HTML
  const highlightLinks = (html: string) => {
    if (!html) return html;
    
    // Primeiro, limpar atributos de estilo inline desnecessários, mas preservar links existentes
    let cleanHtml = html
      .replace(/style="[^"]*"/gi, '') // Remove atributos style
      .replace(/data-[^=]*="[^"]*"/gi, '') // Remove atributos data-*
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comentários HTML
      .replace(/\s+/g, ' ') // Normaliza espaços em branco
      .trim();
    
    // Adicionar classes CSS e atributos aos links existentes para estilização
    cleanHtml = cleanHtml.replace(/<a\s+([^>]*?)href="([^"]*?)"([^>]*?)>/gi, (match, before, url, after) => {
      // Limpar atributos existentes que vamos substituir
      const beforeClean = before.replace(/class="[^"]*"/gi, '').replace(/target="[^"]*"/gi, '').replace(/rel="[^"]*"/gi, '');
      const afterClean = after.replace(/class="[^"]*"/gi, '').replace(/target="[^"]*"/gi, '').replace(/rel="[^"]*"/gi, '');
      
      // Adicionar todos os atributos necessários
      return `<a ${beforeClean}href="${url}"${afterClean} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200">`;
    });
    
    // Regex para detectar URLs que não estão dentro de tags <a>
    const urlRegex = /(?<!<a[^>]*>)(https?:\/\/[^\s<>"{}|\\^`[\]]+)(?![^<]*<\/a>)/gi;
    
    return cleanHtml.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200">${url}</a>`;
    });
  };

  // A busca já é feita no backend, então apenas usamos os óleos retornados
  const filteredOils = oils;

  // Calcular paginação
  const totalItems = filteredOils.length;
  const totalPages = itemsPerPage === "all" ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex = itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === "all" ? totalItems : startIndex + itemsPerPage;
  const displayedOils = filteredOils.slice(startIndex, endIndex);

  // Resetar para página 1 quando mudar itemsPerPage ou searchTerm
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  // Scroll para o primeiro óleo da lista quando mudar de página
  useEffect(() => {
    const gridElement = document.getElementById('oils-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        <img
          src="https://i.ibb.co/N2CVmNZL/Banco-de-Dados-leos-Essenciais-Fichas-Completas.webp"
          alt="Banner Banco de Dados Essencial - Óleos Essenciais"
          loading="eager"
          fetchpriority="high"
          className="relative w-full h-full object-cover object-center"
          onLoad={(e) => {
            const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'none';
          }}
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
          </div>
        </motion.div>

        {/* Search */}
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
            <Button onClick={() => loadOils()} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Results Count and Items Per Page Selector */}
        {!loading && !error && (
          <motion.div
            className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              {filteredOils.length} óleo
              {filteredOils.length !== 1 ? "s" : ""} encontrado
              {filteredOils.length !== 1 ? "s" : ""}
              {itemsPerPage !== "all" && (
                <> (mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems})</>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Itens por página:</span>
              <Select
                value={itemsPerPage === "all" ? "all" : itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(value === "all" ? "all" : parseInt(value));
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          id="oils-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {displayedOils.map((oil, index) => (
            <motion.div
              key={oil.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="bg-white rounded-3xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 h-full overflow-hidden cursor-pointer" onClick={() => openOilModal(oil)}>
                {/* Image Section */}
                <div className="relative w-full h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-3xl" />
                  <img
                    src={oil.avatar || "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Óleo+Essencial"}
                    alt={oil.nome || 'Óleo Essencial'}
                    loading="lazy"
                    className="relative w-full h-full object-cover"
                    onLoad={(e) => {
                      const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'none';
                    }}
                  />
                </div>

                {/* TÍTULO + FAVORITO lado a lado */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-purple-800 leading-tight">
                    {oil.nome || 'Óleo Essencial'}
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

        {/* Pagination Controls */}
        {!loading && !error && filteredOils.length > 0 && itemsPerPage !== "all" && totalPages > 1 && (
          <motion.div
            className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`rounded-xl ${currentPage === pageNum ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl"
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-1 sm:p-4"
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
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 min-h-[15vh] sm:min-h-0">
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-3xl" />
                <img
                  src={selectedOil.avatar || "https://via.placeholder.com/800x300/8B5CF6/FFFFFF?text=Óleo+Essencial"}
                  alt={selectedOil.nome || 'Óleo Essencial'}
                  loading="eager"
                  className="relative w-full h-[25vh] sm:h-auto sm:max-h-[480px] object-cover sm:object-contain rounded-t-3xl"
                  onLoad={(e) => {
                    const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(selectedOil.id)}
                    className="bg-white/90 hover:bg-white rounded-full"
                    title={selectedOil.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        selectedOil.isFavorite
                          ? "fill-purple-600 text-purple-600"
                          : "text-purple-900"
                      }`}
                    />
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
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-purple-800 mb-2">
                    {selectedOil.nome}
                  </h1>
                  <p className="text-lg text-gray-600 italic mb-4">
                    {selectedOil.nome_cientifico}
                  </p>
                  <div className="text-base text-gray-500">
                    {selectedOil.descricao ? (
                      <div dangerouslySetInnerHTML={{ __html: highlightLinks(selectedOil.descricao) }} />
                    ) : (
                      <p>Não informado</p>
                    )}
                  </div>
                </div>

                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Informações Básicas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                       <div>
                         <h3 className="font-semibold text-purple-800">Família Botânica:</h3>
                         <div className="mt-1">
                           {selectedOil.familia_botanica ? (
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                               {selectedOil.familia_botanica}
                             </span>
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Forma de Extração:</h3>
                         <div className="mt-1">
                           {selectedOil.forma_extracao ? (
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                               {selectedOil.forma_extracao}
                             </span>
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Parte da Planta:</h3>
                         <div className="mt-1">
                           {selectedOil.parte_planta ? (
                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                               {selectedOil.parte_planta}
                             </span>
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Origem:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.origem ? (
                             selectedOil.origem.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                     </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-purple-800">Composto Químico Principal:</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedOil.composto_quimico ? (
                            selectedOil.composto_quimico.split(',').map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                              >
                                {tag.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">Não informado</span>
                          )}
                        </div>
                      </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Família Química em Maior Proporção:</h3>
                         <div className="mt-1 flex flex-wrap gap-2">
                           {selectedOil.familia_quimica ? (
                             selectedOil.familia_quimica.split(',').map((familia, index) => (
                               <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                 {familia.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Características</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                       <div>
                         <h3 className="font-semibold text-purple-800">Aroma:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.aroma ? (
                             selectedOil.aroma.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-3">
                       <div>
                         <h3 className="font-semibold text-purple-800">Categoria Aromática:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.categoria_aromatica ? (
                             selectedOil.categoria_aromatica.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Benefícios e Propriedades */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Benefícios e Propriedades</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                       <div>
                         <h3 className="font-semibold text-purple-800">Psicoaromas (Emocional/Psicológica/Mental):</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.psicoaromas ? (
                             selectedOil.psicoaromas.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Estéticas (Pele/Cabelo/Unhas):</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.estetica ? (
                             selectedOil.estetica.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Saúde Física:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.saude_fisica ? (
                             selectedOil.saude_fisica.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                     </div>
                     <div className="space-y-3">
                       <div>
                         <h3 className="font-semibold text-purple-800">Espirituais/Vibracionais:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.espirituais ? (
                             selectedOil.espirituais.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Ambientais:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.ambientais ? (
                             selectedOil.ambientais.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Propriedades Adicionais */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Propriedades Adicionais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                       <div>
                         <h3 className="font-semibold text-purple-800">Contraindicações:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.contraindicacao ? (
                             selectedOil.contraindicacao.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                       <div>
                         <h3 className="font-semibold text-purple-800">Farmacologia e Neuropsicofarmacologia:</h3>
                         <div className="flex flex-wrap gap-1 mt-1">
                           {selectedOil.farmacologia_neuro ? (
                             selectedOil.farmacologia_neuro.split(',').map((tag, index) => (
                               <span
                                 key={index}
                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                               >
                                 {tag.trim()}
                               </span>
                             ))
                           ) : (
                             <span className="text-gray-500 text-sm">Não informado</span>
                           )}
                         </div>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Interações Medicamentosas */}
                {(selectedOil.interacao || selectedOil.notas) && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Interações Medicamentosas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-purple-800">Interações:</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedOil.interacao ? (
                              selectedOil.interacao.split(',').map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                                >
                                  {tag.trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">Não informado</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-purple-800">Notas:</h3>
                          <div className="mt-1 text-gray-700">
                            {selectedOil.notas ? (
                              <div className="text-sm" dangerouslySetInnerHTML={{ __html: highlightLinks(selectedOil.notas) }} />
                            ) : (
                              <span className="text-gray-500 text-sm">Não informado</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Galeria de Fotos */}
                {selectedOil.galeria_fotos && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Galeria de Fotos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedOil.galeria_fotos.split(',').map((photoUrl, index) => {
                        const trimmedUrl = photoUrl.trim();
                        if (!trimmedUrl) return null;
                        
                        return (
                          <div key={index} className="relative group">
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                            <img
                              src={trimmedUrl}
                              alt={`Foto ${index + 1} do ${selectedOil.nome || 'Óleo Essencial'}`}
                              loading="lazy"
                              className="relative w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                              onLoad={(e) => {
                                const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'none';
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const placeholder = target.previousElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'none';
                                target.style.display = 'none';
                              }}
                            />
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer"
                          onClick={() => openImageModal(trimmedUrl)}
                        >
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                        {selectedOil.contraindicacoes_preocupacoes && (
                          <div className="text-gray-700">
                            <div dangerouslySetInnerHTML={{ __html: highlightLinks(selectedOil.contraindicacoes_preocupacoes) }} />
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
                            (() => {
                              try {
                                const components = JSON.parse(selectedOil.composicao_quimica_majoritaria);
                                if (Array.isArray(components) && components.length > 0) {
                                  return (
                                    <div className="overflow-x-auto -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                                      <table className="min-w-[600px] border-collapse border border-purple-200">
                                        <thead>
                                          <tr className="bg-purple-50">
                                            <th className="border border-purple-200 px-3 py-2 text-left font-semibold text-purple-800 whitespace-nowrap">Componente Químico</th>
                                            <th className="border border-purple-200 px-3 py-2 text-left font-semibold text-purple-800 whitespace-nowrap">Família Química</th>
                                            <th className="border border-purple-200 px-3 py-2 text-left font-semibold text-purple-800 whitespace-nowrap">Concentração</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {components.map((component: any, index: number) => (
                                            <tr key={index} className="hover:bg-purple-25">
                                              <td className="border border-purple-200 px-3 py-2 whitespace-nowrap">{component.componente || '-'}</td>
                                              <td className="border border-purple-200 px-3 py-2 whitespace-nowrap">{component.familia || '-'}</td>
                                              <td className="border border-purple-200 px-3 py-2 whitespace-nowrap">{component.concentracao || '-'}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  );
                                } else {
                                  return <p>Não informado</p>;
                                }
                              } catch {
                                return <p>Não informado</p>;
                              }
                            })()
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
                            <div dangerouslySetInnerHTML={{ __html: highlightLinks(selectedOil.substitutos) }} />
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
                            <div dangerouslySetInnerHTML={{ __html: highlightLinks(selectedOil.combinacoes) }} />
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

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={closeImageModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
                <img
                  src={selectedImage}
                  alt="Imagem ampliada"
                  loading="eager"
                  className="relative max-w-full max-h-[85vh] object-contain rounded-lg"
                  onLoad={(e) => {
                    const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'none';
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeImageModal}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
