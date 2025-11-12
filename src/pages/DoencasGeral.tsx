import { useState, useEffect } from "react";
import { Search, Heart, ChevronRight, ArrowLeft, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { doencasApi, DoencaGeral } from "@/services/doencasApi";

interface Disease {
  id: string;
  name: string;
  category: string;
  description: string;
  recommendedOils: string[];
  symptoms: string[];
  usageForm?: string;
  isFavorite: boolean;
}

const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DoencasGeral() {
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
                         disease.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === "" || disease.name.charAt(0).toUpperCase() === selectedLetter;
    
    return matchesSearch && matchesLetter;
  });

  const groupedDiseases = alphabetLetters.reduce((acc, letter) => {
    const diseasesForLetter = filteredDiseases.filter(disease => 
      disease.name.charAt(0).toUpperCase() === letter
    );
    if (diseasesForLetter.length > 0) {
      acc[letter] = diseasesForLetter;
    }
    return acc;
  }, {} as Record<string, Disease[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/N6Nq66d8/Guia-de-Consulta-Doen-as-Condi-es-x-leos-Essenciais-de-A-a-Z.webp"
          alt="Banner Guia de Doenças Gerais"
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
            Doenças Gerais
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Guia completo de doenças e condições com recomendações de óleos essenciais para saúde geral e bem-estar.
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
              placeholder="Buscar doença ou sintoma..."
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

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground text-lg">Carregando doenças...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button onClick={loadDiseases}>Tentar Novamente</Button>
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-muted-foreground text-center">
              {filteredDiseases.length} doença{filteredDiseases.length !== 1 ? 's' : ''} encontrada{filteredDiseases.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}

        {/* Diseases by Letter */}
        {!loading && !error && (
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {letterDiseases.map((disease, index) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                                         <Card 
                       className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 cursor-pointer border-2 border-purple-200"
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
                            <p className="text-sm text-muted-foreground">
                              {disease.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(disease.id)}
                              className="rounded-xl"
                            >
                              <Heart 
                                className={`w-4 h-4 ${disease.isFavorite ? 'fill-purple-600 text-purple-600' : 'text-purple-900'}`} 
                              />
                            </Button>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-foreground mb-2 text-sm">Óleos Recomendados:</h4>
                          <div className="flex flex-wrap gap-1">
                            {disease.recommendedOils.map((oil) => (
                              <Badge 
                                key={oil} 
                                variant="default" 
                                className="text-xs rounded-lg"
                              >
                                {oil}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2 text-sm">Sintomas Comuns:</h4>
                          <div className="flex flex-wrap gap-1">
                            {disease.symptoms.map((symptom) => (
                              <Badge 
                                key={symptom} 
                                variant="outline" 
                                className="text-xs rounded-lg"
                              >
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          </motion.div>
        )}

        {!loading && !error && filteredDiseases.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-muted-foreground text-lg">
              Nenhuma doença encontrada com os critérios selecionados.
            </p>
          </motion.div>
        )}

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
                      <p className="text-muted-foreground">
                        {selectedDisease.description}
                      </p>
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

                  {/* Sintomas Comuns */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Sintomas Comuns:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisease.symptoms.map((symptom) => (
                        <Badge 
                          key={symptom} 
                          variant="outline" 
                          className="text-sm rounded-lg"
                        >
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Modo de Uso */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg">Modo de Uso:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDisease.usageForm ? (
                        selectedDisease.usageForm.split(',').map((usage, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-sm rounded-lg"
                          >
                            {usage.trim()}
                          </Badge>
                        ))
                      ) : (
                        <Badge 
                          variant="outline" 
                          className="text-sm rounded-lg"
                        >
                          Consulte um profissional de aromaterapia para orientações específicas sobre dosagem, método de aplicação e contraindicações para esta condição.
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Alert Message */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800 text-sm leading-relaxed">
                        Consulte um profissional de aromaterapia para orientações específicas sobre dosagem, método de aplicação e contraindicações para esta condição ou verifique a aula respectiva.
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
