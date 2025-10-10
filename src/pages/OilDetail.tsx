import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  AlertTriangle, 
  Atom, 
  CheckSquare, 
  Beaker,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { oilsApi, Oil } from "@/services/oilsApi";

export default function OilDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [oil, setOil] = useState<Oil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
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
    } catch (err) {
      setError("Erro ao carregar óleo essencial. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const shareOil = async () => {
    if (navigator.share && oil) {
      try {
        await navigator.share({
          title: oil.nome,
          text: `Confira informações sobre ${oil.nome} - ${oil.nome_cientifico}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

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
              <Button
                variant="ghost"
                size="icon"
                onClick={shareOil}
                className="rounded-full"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
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
          <div className="relative">
            <img
              src={oil.avatar || "https://via.placeholder.com/1200x400/8B5CF6/FFFFFF?text=Óleo+Essencial"}
              alt={oil.nome}
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {oil.nome}
              </h1>
              <p className="text-lg text-white/90 italic">
                {oil.nome_cientifico}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Description */}
            {oil.descricao && (
              <div>
                <h2 className="text-2xl font-bold text-purple-800 mb-4">Descrição</h2>
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: oil.descricao }}
                />
              </div>
            )}

            {/* Basic Information Grid */}
            <div>
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Família Botânica:</h3>
                    <p className="text-gray-700">{oil.familia_botanica || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Forma de Extração:</h3>
                    <p className="text-gray-700">{oil.forma_extracao || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Aroma:</h3>
                    <p className="text-gray-700">{oil.aroma || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Parte da Planta:</h3>
                    <p className="text-gray-700">{oil.parte_planta || "Não informado"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Composto Químico Principal:</h3>
                    <p className="text-gray-700">{oil.composto_quimico || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Família Química:</h3>
                    <p className="text-gray-700">{oil.familia_quimica || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Categoria Aromática:</h3>
                    <p className="text-gray-700">{oil.categoria_aromatica || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Properties */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Propriedades Detalhadas</h2>
              
              {oil.psicoaromas && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">Psicoaroma (Emocional/Psicológica/Mental)</h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: oil.psicoaromas }}
                    />
                  </CardContent>
                </Card>
              )}

              {oil.estetica && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">Estética/Pele/Cabelo/Unhas</h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: oil.estetica }}
                    />
                  </CardContent>
                </Card>
              )}

              {oil.saude_fisica && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">Saúde Física em Geral</h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: oil.saude_fisica }}
                    />
                  </CardContent>
                </Card>
              )}

              {oil.espirituais && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">Espiritual/Vibracional</h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: oil.espirituais }}
                    />
                  </CardContent>
                </Card>
              )}

              {oil.ambientais && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-800 mb-3">Ambiental</h3>
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: oil.ambientais }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-purple-800">Informações Adicionais</h2>
              
              {/* Contraindicações */}
              {(oil.contraindicacao || oil.contraindicacoes_preocupacoes) && (
                <Card className="border border-red-200">
                  <button
                    onClick={() => toggleSection('contraindications')}
                    className="w-full p-6 flex items-center justify-between hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-purple-800">Contraindicações e precauções</span>
                    </div>
                    {expandedSections.contraindications ? (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  {expandedSections.contraindications && (
                    <CardContent className="p-6 pt-0">
                      {oil.contraindicacao && (
                        <div 
                          className="text-gray-700 mb-4"
                          dangerouslySetInnerHTML={{ __html: oil.contraindicacao }}
                        />
                      )}
                      {oil.contraindicacoes_preocupacoes && (
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">Preocupações Adicionais:</h4>
                          <div 
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{ __html: oil.contraindicacoes_preocupacoes }}
                          />
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Composição Química */}
              {oil.composicao_quimica_majoritaria && (
                <Card>
                  <button
                    onClick={() => toggleSection('chemistry')}
                    className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Atom className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold text-purple-800">Composição química majoritária</span>
                    </div>
                    {expandedSections.chemistry ? (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  {expandedSections.chemistry && (
                    <CardContent className="p-6 pt-0">
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: oil.composicao_quimica_majoritaria }}
                      />
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Óleos Substitutos */}
              {oil.substitutos && (
                <Card>
                  <button
                    onClick={() => toggleSection('substitutes')}
                    className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold text-purple-800">Óleos essenciais substitutos</span>
                    </div>
                    {expandedSections.substitutes ? (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  {expandedSections.substitutes && (
                    <CardContent className="p-6 pt-0">
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: oil.substitutos }}
                      />
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Sugestões de Combinações */}
              {oil.combinacoes && (
                <Card>
                  <button
                    onClick={() => toggleSection('combinations')}
                    className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Beaker className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold text-purple-800">Sugestões de combinações</span>
                    </div>
                    {expandedSections.combinations ? (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  {expandedSections.combinations && (
                    <CardContent className="p-6 pt-0">
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: oil.combinacoes }}
                      />
                    </CardContent>
                  )}
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
