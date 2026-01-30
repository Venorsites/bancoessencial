import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Heart, 
  AlertTriangle, 
  Atom, 
  CheckSquare, 
  Beaker,
  ChevronRight,
  ChevronDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { oilsApi, Oil } from "@/services/oilsApi";
import { useAuth } from "@/contexts/AuthContext";
import { isFavorite as isFav, toggleFavorite as toggleFav, FavoriteItem } from "@/utils/favorites";

export default function OilDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [oil, setOil] = useState<Oil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    contraindications: false,
    chemistry: false,
    substitutes: false,
    combinations: false
  });

  useEffect(() => {
    if (id) {
      loadOil();
    }
  }, [id]);

  const loadOil = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await oilsApi.getById(id!);
      setOil(data);
      setIsFavorite(isFav('oil', data.id, user?.id));
    } catch (err) {
      setError("Erro ao carregar óleo essencial. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
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
    setIsFavorite(toggled);
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

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // share removed per request

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !oil) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Óleo não encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/oleos')} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Óleos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/oleos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos Óleos
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite
                      ? "fill-purple-600 text-purple-600"
                      : "text-gray-600"
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            <img
              src={oil.avatar || "https://via.placeholder.com/1200x400/8B5CF6/FFFFFF?text=Óleo+Essencial"}
              alt={oil.nome || 'Óleo Essencial'}
              loading="eager"
              fetchPriority="high"
              className="relative w-full h-auto max-h-80 sm:max-h-96 object-contain"
              onLoad={(e) => {
                const placeholder = e.currentTarget.previousElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 hidden sm:block">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {oil.nome}
              </h1>
              <p className="text-lg text-white/90 italic">
                {oil.nome_cientifico}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title and Basic Info */}
            <div className="text-left">
              <h1 className="text-3xl font-bold text-purple-800 mb-2">
                {oil.nome}
              </h1>
              <p className="text-lg text-gray-600 italic mb-4">
                {oil.nome_cientifico}
              </p>
              <div className="text-base text-gray-500">
                {oil.descricao ? (
                  <div dangerouslySetInnerHTML={{ __html: highlightLinks(oil.descricao) }} />
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
                       {oil.familia_botanica ? (
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                           {oil.familia_botanica}
                         </span>
                       ) : (
                         <span className="text-gray-500 text-sm">Não informado</span>
                       )}
                     </div>
                   </div>
                   <div>
                     <h3 className="font-semibold text-purple-800">Forma de Extração:</h3>
                     <div className="mt-1">
                       {oil.forma_extracao ? (
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                           {oil.forma_extracao}
                         </span>
                       ) : (
                         <span className="text-gray-500 text-sm">Não informado</span>
                       )}
                     </div>
                   </div>
                   <div>
                     <h3 className="font-semibold text-purple-800">Parte da Planta:</h3>
                     <div className="mt-1">
                       {oil.parte_planta ? (
                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                           {oil.parte_planta}
                         </span>
                       ) : (
                         <span className="text-gray-500 text-sm">Não informado</span>
                       )}
                     </div>
                   </div>
                   <div>
                     <h3 className="font-semibold text-purple-800">Origem:</h3>
                     <div className="flex flex-wrap gap-1 mt-1">
                       {oil.origem ? (
                         oil.origem.split(',').map((tag, index) => (
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
                          {oil.composto_quimico ? (
                            oil.composto_quimico.split(',').map((tag, index) => (
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
                       {oil.familia_quimica ? (
                         oil.familia_quimica.split(',').map((familia, index) => (
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
                       {oil.aroma ? (
                         oil.aroma.split(',').map((tag, index) => (
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
                       {oil.categoria_aromatica ? (
                         oil.categoria_aromatica.split(',').map((tag, index) => (
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
                       {oil.psicoaromas ? (
                         oil.psicoaromas.split(',').map((tag, index) => (
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
                       {oil.estetica ? (
                         oil.estetica.split(',').map((tag, index) => (
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
                       {oil.saude_fisica ? (
                         oil.saude_fisica.split(',').map((tag, index) => (
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
                       {oil.espirituais ? (
                         oil.espirituais.split(',').map((tag, index) => (
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
                       {oil.ambientais ? (
                         oil.ambientais.split(',').map((tag, index) => (
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
                       {oil.contraindicacao ? (
                         oil.contraindicacao.split(',').map((tag, index) => (
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
                       {oil.farmacologia_neuro ? (
                         oil.farmacologia_neuro.split(',').map((tag, index) => (
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
            {(oil.interacao || oil.notas) && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Interações Medicamentosas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-purple-800">Interações:</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {oil.interacao ? (
                          oil.interacao.split(',').map((tag, index) => (
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
                        {oil.notas ? (
                          <div className="text-sm" dangerouslySetInnerHTML={{ __html: highlightLinks(oil.notas) }} />
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
            {oil.galeria_fotos && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-purple-800 border-b-2 border-purple-200 pb-2">Galeria de Fotos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {oil.galeria_fotos.split(',').map((photoUrl, index) => {
                    const trimmedUrl = photoUrl.trim();
                    if (!trimmedUrl) return null;
                    
                    return (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                        <img
                          src={trimmedUrl}
                          alt={`Foto ${index + 1} do ${oil.nome}`}
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

            {/* Expandable Sections */}
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
                      {oil.contraindicacoes_preocupacoes && (
                      <div className="text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: highlightLinks(oil.contraindicacoes_preocupacoes) }} />
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
                      {oil.composicao_quimica_majoritaria ? (
                        (() => {
                          try {
                            const components = JSON.parse(oil.composicao_quimica_majoritaria);
                            if (Array.isArray(components) && components.length > 0) {
                              return (
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-purple-200">
                                    <thead>
                                      <tr className="bg-purple-50">
                                        <th className="border border-purple-200 px-3 py-2 text-left font-semibold text-purple-800">Componente Químico</th>
                                        <th className="border border-purple-200 px-3 py-2 text-left font-semibold text-purple-800">Família Química</th>
                                        <th className="border border-purple-200 px-3 py-2 text-left font-semibold text-purple-800">Concentração</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {components.map((component: any, index: number) => (
                                        <tr key={index} className="hover:bg-purple-25">
                                          <td className="border border-purple-200 px-3 py-2">{component.componente || '-'}</td>
                                          <td className="border border-purple-200 px-3 py-2">{component.familia || '-'}</td>
                                          <td className="border border-purple-200 px-3 py-2">{component.concentracao || '-'}</td>
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
                      {oil.substitutos ? (
                        <div dangerouslySetInnerHTML={{ __html: highlightLinks(oil.substitutos) }} />
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
                      {oil.combinacoes ? (
                        <div dangerouslySetInnerHTML={{ __html: highlightLinks(oil.combinacoes) }} />
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
      </div>

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
                <img
                  src={selectedImage}
                  alt="Imagem ampliada"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
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
    </div>
  );
}
