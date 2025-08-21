import { useState } from "react";
import { Search, Heart, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const mockPediatricDiseases = [
  {
    id: 1,
    name: "Cólica",
    category: "Digestivo",
    description: "Dor abdominal causada por gases e espasmos intestinais em bebês.",
    recommendedOils: ["Camomila", "Lavanda", "Erva-doce"],
    symptoms: ["Choro intenso", "Pernas encolhidas", "Barriga inchada"],
    isFavorite: false,
    ageGroup: "0-6 meses",
  },
  {
    id: 2,
    name: "Febre",
    category: "Sistêmico",
    description: "Elevação da temperatura corporal, comum em infecções.",
    recommendedOils: ["Lavanda", "Eucalipto", "Hortelã-pimenta"],
    symptoms: ["Temperatura elevada", "Calafrios", "Mal-estar"],
    isFavorite: true,
    ageGroup: "Todas as idades",
  },
  {
    id: 3,
    name: "Tosse",
    category: "Respiratório",
    description: "Reflexo para limpar as vias aéreas, comum em resfriados.",
    recommendedOils: ["Eucalipto", "Lavanda", "Limão"],
    symptoms: ["Tosse seca", "Tosse com catarro", "Irritação na garganta"],
    isFavorite: false,
    ageGroup: "1+ anos",
  },
  {
    id: 4,
    name: "Insônia",
    category: "Sono",
    description: "Dificuldade para dormir, comum em crianças ansiosas.",
    recommendedOils: ["Lavanda", "Camomila", "Cedro"],
    symptoms: ["Dificuldade para dormir", "Despertar frequente", "Agitação"],
    isFavorite: false,
    ageGroup: "2+ anos",
  },
  {
    id: 5,
    name: "Ansiedade",
    category: "Emocional",
    description: "Estado de preocupação e nervosismo em crianças.",
    recommendedOils: ["Lavanda", "Bergamota", "Ylang Ylang"],
    symptoms: ["Nervosismo", "Preocupação excessiva", "Dificuldade de concentração"],
    isFavorite: false,
    ageGroup: "3+ anos",
  },
  {
    id: 6,
    name: "Dermatite",
    category: "Pele",
    description: "Inflamação da pele causando coceira e vermelhidão.",
    recommendedOils: ["Lavanda", "Camomila", "Tea Tree"],
    symptoms: ["Vermelhidão", "Coceira", "Descamação"],
    isFavorite: false,
    ageGroup: "Todas as idades",
  },
];

const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DoencasPediatrica() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [diseases, setDiseases] = useState(mockPediatricDiseases);

  const toggleFavorite = (id: number) => {
    setDiseases(diseases.map(disease => 
      disease.id === id ? { ...disease, isFavorite: !disease.isFavorite } : disease
    ));
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
  }, {} as Record<string, typeof mockPediatricDiseases>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-24 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/8LVrD6ZM/Lavanda-Francesa.webp"
          alt="Banner Aromaterapia Pediátrica"
          className="absolute inset-0 w-full h-full object-cover object-top"
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
                disabled={!Object.keys(groupedDiseases).includes(letter)}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {letterDiseases.map((disease, index) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                {disease.name}
                              </h3>
                              <Badge variant="secondary" className="rounded-xl text-xs">
                                {disease.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {disease.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {disease.ageGroup}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(disease.id)}
                              className="rounded-xl"
                            >
                              <Heart 
                                className={`w-4 h-4 ${disease.isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
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
      </div>
    </div>
  );
}
