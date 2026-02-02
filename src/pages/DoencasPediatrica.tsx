import { useState, useEffect, useRef } from "react";
import { Search, Heart, ArrowLeft, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { doencasPediatricaApi as doencasApi, DoencaGeral } from "@/services/doencasApi";

interface Disease {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  recommendedOils: string[];
  symptoms: string[];
  usageForm?: string;
  isFavorite: boolean;
}

const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Componente para exibir óleos com detecção inteligente de overflow
function OilsDisplay({ oils }: { oils: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(oils.length);
  const [showMore, setShowMore] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const checkOverflow = () => {
      const container = containerRef.current;
      if (!container) return;

      const maxHeight = 120;
      const gap = 4;
      
      const allBadges = Array.from(container.querySelectorAll('[data-oil-item]')) as HTMLElement[];
      if (allBadges.length === 0) return;

      const containerWidth = container.offsetWidth;
      const badgeWidths = allBadges.map(badge => badge.offsetWidth);
      const badgeHeight = allBadges[0].offsetHeight;
      
      let currentLineWidth = 0;
      let currentHeight = badgeHeight;
      let count = 0;
      
      for (let i = 0; i < badgeWidths.length; i++) {
        const badgeWidth = badgeWidths[i];
        
        if (currentLineWidth + badgeWidth <= containerWidth) {
          currentLineWidth += badgeWidth + gap;
          count++;
        } else {
          currentHeight += badgeHeight + gap;
          
          if (currentHeight + badgeHeight <= maxHeight) {
            currentLineWidth = badgeWidth + gap;
            count++;
          } else {
            break;
          }
        }
      }

      if (count >= oils.length) {
        setVisibleCount(oils.length);
        setShowMore(false);
        setIsMeasuring(false);
        return;
      }

      if (count > 0) {
        const remainingCount = oils.length - count;
        const moreBadgeText = `+${remainingCount} mais`;
        
        const tempBadge = document.createElement('span');
        tempBadge.className = 'inline-flex items-center rounded-lg border px-2 py-1 text-xs font-semibold';
        tempBadge.textContent = moreBadgeText;
        tempBadge.style.position = 'absolute';
        tempBadge.style.visibility = 'hidden';
        document.body.appendChild(tempBadge);
        
        const moreBadgeWidth = tempBadge.offsetWidth;
        document.body.removeChild(tempBadge);

        let finalLineWidth = 0;
        let finalHeight = badgeHeight;
        let finalCount = 0;
        
        for (let i = 0; i < count; i++) {
          const badgeWidth = badgeWidths[i];
          
          if (finalLineWidth + badgeWidth <= containerWidth) {
            finalLineWidth += badgeWidth + gap;
            finalCount++;
          } else {
            finalHeight += badgeHeight + gap;
            if (finalHeight + badgeHeight <= maxHeight) {
              finalLineWidth = badgeWidth + gap;
              finalCount++;
            } else {
              break;
            }
          }
        }
        
        if (finalLineWidth + moreBadgeWidth > containerWidth) {
          if (finalCount > 1) {
            finalCount--;
          }
        }
        
        setVisibleCount(Math.max(1, finalCount));
        setShowMore(true);
      } else {
        setVisibleCount(1);
        setShowMore(true);
      }
      
      setIsMeasuring(false);
    };

    const timeoutId = setTimeout(checkOverflow, 150);
    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [oils]);

  return (
    <div>
      <h4 className="font-medium text-foreground mb-2 text-sm">Óleos Recomendados:</h4>
      <div 
        ref={containerRef}
        className="flex flex-wrap gap-1"
      >
        {oils.map((oil, index) => (
          <Badge 
            key={oil} 
            data-oil-item
            variant="default" 
            className="text-xs rounded-lg"
            style={{ 
              display: isMeasuring || index < visibleCount ? 'inline-flex' : 'none'
            }}
          >
            {oil}
          </Badge>
        ))}
        {showMore && !isMeasuring && (
          <Badge 
            variant="outline" 
            className="text-xs rounded-lg"
          >
            +{oils.length - visibleCount} mais
          </Badge>
        )}
      </div>
    </div>
  );
}

export default function DoencasPediatrica() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiseases();
  }, []);

  // Atualizar searchTerm quando a URL mudar
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const loadDiseases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doencasApi.getAll(undefined, undefined, true); // activeOnly = true
      const transformedData: Disease[] = data.map((doenca: DoencaGeral) => ({
        id: doenca.id,
        name: doenca.nome,
        category: doenca.categoria,
        description: doenca.descricao_short,
        recommendedOils: doenca.oleos_recomendados || [],
        symptoms: doenca.sintomas_comuns || [],
        usageForm: doenca.forma_uso,
        isFavorite: false,
      }));
      setDiseases(transformedData);
    } catch (err) {
      setError('Erro ao carregar doenças. Por favor, tente novamente.');
      console.error('Erro ao carregar doenças:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setDiseases(diseases.map(disease => 
      disease.id === id ? { ...disease, isFavorite: !disease.isFavorite } : disease
    ));
  };

  const openDiseaseModal = (disease: Disease) => {
    setSelectedDisease(disease);
  };

  const closeDiseaseModal = () => {
    setSelectedDisease(null);
  };

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (disease.description && disease.description.trim() && disease.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLetter = selectedLetter === "" || disease.name.charAt(0).toUpperCase() === selectedLetter;
    
    return matchesSearch && matchesLetter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando doenças...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const groupedDiseases = alphabetLetters.reduce((acc, letter) => {
    const diseasesForLetter = filteredDiseases.filter(disease => 
      disease.name.charAt(0).toUpperCase() === letter
    );
    if (diseasesForLetter.length > 0) {
      acc[letter] = diseasesForLetter;
    }
    return acc;
  }, {} as Record<string, typeof mockPediatricDiseases>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/8LVrD6ZM/Lavanda-Francesa.webp"
          alt="Banner Aromaterapia Pediátrica"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-top"
        />
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/doencas">
            <Button variant="ghost" className="text-foreground hover:text-purple-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Guia de Doenças
            </Button>
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Aromaterapia Pediátrica
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Especializada em cuidados com crianças, incluindo dosagens seguras e aplicações específicas para cada idade.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar condição ou sintoma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 rounded-2xl shadow-soft"
            />
          </div>
        </motion.div>

        {/* Alphabet Filter */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedLetter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter("")}
              className="rounded-xl"
            >
              Todos
            </Button>
            {alphabetLetters.map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(letter)}
                className="rounded-xl w-10 h-10 p-0"
              >
                {letter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground text-center">
            {filteredDiseases.length} condição{filteredDiseases.length !== 1 ? 'ões' : ''} encontrada{filteredDiseases.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Diseases by Letter */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {Object.entries(groupedDiseases).map(([letter, letterDiseases]) => (
            <div key={letter}>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <span className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white mr-4">
                  {letter}
                </span>
                {letter}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {letterDiseases.map((disease, index) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card 
                      className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 cursor-pointer border-2 border-purple-200 h-[280px] flex flex-col"
                      onClick={() => openDiseaseModal(disease)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {disease.name}
                              </h3>
                              <Badge variant="secondary" className="rounded-xl text-xs text-white">
                                {disease.category}
                              </Badge>
                            </div>
                            {disease.description && disease.description.trim() && (
                            <p className="text-sm text-muted-foreground">
                              {disease.description}
                            </p>
                            )}
                            {disease.ageGroup && disease.ageGroup.trim() && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {disease.ageGroup}
                            </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(disease.id);
                              }}
                              className="rounded-xl"
                            >
                              <Heart 
                                className={`w-4 h-4 ${disease.isFavorite ? 'fill-purple-600 text-purple-600' : 'text-purple-900'}`} 
                              />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 flex-1 flex flex-col overflow-hidden">
                        {disease.recommendedOils && disease.recommendedOils.length > 0 && (
                        <OilsDisplay oils={disease.recommendedOils} />
                        )}

                        {disease.symptoms && disease.symptoms.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2 text-sm">Sintomas Comuns:</h4>
                          <div className="flex flex-wrap gap-1">
                            {disease.symptoms.slice(0, 3).map((symptom) => (
                              <Badge 
                                key={symptom} 
                                variant="outline" 
                                className="text-xs rounded-lg"
                              >
                                {symptom}
                              </Badge>
                            ))}
                            {disease.symptoms.length > 3 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs rounded-lg"
                              >
                                +{disease.symptoms.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                        )}
                      </CardContent>
                      
                      <div className="relative pt-3 pb-3">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
                        <p className="text-sm text-purple-600 font-medium text-center cursor-pointer hover:text-purple-700 transition-colors">
                          Ver mais
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {filteredDiseases.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-muted-foreground text-lg">
              Nenhuma condição encontrada com os critérios selecionados.
            </p>
          </motion.div>
        )}

        {/* Safety Notice */}
        <motion.div 
          className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ⚠️ Importante: Segurança na Aromaterapia Pediátrica
          </h3>
          <p className="text-blue-800 text-sm">
            Sempre consulte um profissional de saúde antes de usar óleos essenciais em crianças. 
            As dosagens e aplicações variam conforme a idade e condição da criança. 
            Alguns óleos podem não ser seguros para uso pediátrico.
          </p>
        </motion.div>

        {/* Disease Detail Modal */}
        <AnimatePresence>
          {selectedDisease && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={closeDiseaseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-foreground">
                          {selectedDisease.name}
                        </h2>
                        <Badge variant="secondary" className="rounded-xl text-xs text-white">
                          {selectedDisease.category}
                        </Badge>
                      </div>
                      {selectedDisease.description && selectedDisease.description.trim() && (
                      <p className="text-muted-foreground">
                        {selectedDisease.description}
                      </p>
                      )}
                      <Badge variant="outline" className="mt-2 text-xs">
                        {selectedDisease.ageGroup}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeDiseaseModal}
                      className="rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Óleos Recomendados */}
                  {selectedDisease.recommendedOils && selectedDisease.recommendedOils.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Óleos Recomendados:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisease.recommendedOils.map((oil) => (
                        <Badge 
                          key={oil} 
                          variant="default" 
                          className="text-sm rounded-lg text-white"
                        >
                          {oil}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Sintomas Comuns */}
                  {selectedDisease.symptoms && selectedDisease.symptoms.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Sintomas Comuns:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisease.symptoms.map((symptom) => (
                        <Badge 
                          key={symptom} 
                          variant="outline" 
                            className="text-sm rounded-lg text-white"
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Modo de Uso */}
                  {selectedDisease.usageForm && selectedDisease.usageForm.trim() && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Modo de Uso:</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedDisease.usageForm.split(',').map((usage, index) => (
                      <Badge 
                            key={index} 
                        variant="secondary" 
                            className="text-sm rounded-lg text-white"
                      >
                            {usage.trim()}
                      </Badge>
                        ))}
                    </div>
                  </div>
                  )}

                  {/* Alert Message */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800 text-sm leading-relaxed">
                        Consulte um profissional de aromaterapia para orientações específicas sobre dosagem, método de aplicação e contraindicações para esta condição ou verifique a aula respectiva se for assinante da "Comunidade Aromaterapia na Prática".
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
