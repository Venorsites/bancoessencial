import { useState } from "react";
import { Search, Heart, Calendar, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const mockRecipes = [
  {
    id: 1,
    title: "Blend Relaxante para o Sono",
    type: "Blend",
    category: "Relaxamento",
    date: "2024-01-15",
    excerpt: "Mistura perfeita de lavanda, camomila e ylang-ylang para uma noite tranquila de sono.",
    tags: ["Sono", "Relaxamento", "Lavanda"],
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    ingredients: ["Lavanda", "Camomila", "Ylang-Ylang"],
    usage: "Aplicar 2-3 gotas no travesseiro antes de dormir",
  },
  {
    id: 2,
    title: "Protocolo para Resfriado",
    type: "Protocolo",
    category: "Saúde",
    date: "2024-01-10",
    excerpt: "Protocolo completo para alívio de sintomas de resfriado usando óleos essenciais.",
    tags: ["Resfriado", "Saúde", "Eucalipto"],
    isFavorite: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    ingredients: ["Eucalipto", "Hortelã-Pimenta", "Limão"],
    usage: "Inalar 3x ao dia ou aplicar no peito com óleo carreador",
  },
  {
    id: 3,
    title: "Roll-On Energizante Matinal",
    type: "Receita",
    category: "Energia",
    date: "2024-01-08",
    excerpt: "Receita de roll-on para aumentar a energia e disposição durante o dia.",
    tags: ["Energia", "Roll-On", "Citrus"],
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    ingredients: ["Laranja Doce", "Limão", "Hortelã-Pimenta"],
    usage: "Aplicar nos pulsos e nuca ao acordar",
  },
  {
    id: 4,
    title: "Spray Purificador de Ambiente",
    type: "Receita",
    category: "Ambiente",
    date: "2024-01-05",
    excerpt: "Spray natural para purificar e aromatizar ambientes da casa.",
    tags: ["Ambiente", "Purificação", "Spray"],
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    ingredients: ["Tea Tree", "Limão", "Lavanda"],
    usage: "Borrifar no ambiente 2-3 vezes ao dia",
  },
];

const recipeTypes = ["Todos", "Receita", "Protocolo", "Blend"];
const recipeCategories = ["Todos", "Relaxamento", "Saúde", "Energia", "Ambiente", "Beleza"];

export default function Receitas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [recipes, setRecipes] = useState(mockRecipes);

  const toggleFavorite = (id: number) => {
    setRecipes(recipes.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const filteredRecipes = recipes.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "Todos" || item.type === selectedType;
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/b5SmSFzS/Chat-GPT-Image-9-de-abr-de-2025-17-30-51.webp"
          alt="Banner Repositório de Receitas e Protocolos"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-top"
        />
      </section>

      <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Receitas e Protocolos
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Coleção completa de receitas e protocolos prontos para uso dos óleos essenciais.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="flex flex-col gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar receitas e protocolos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 rounded-2xl shadow-soft"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 overflow-x-auto">
            <span className="text-sm text-muted-foreground self-center whitespace-nowrap mr-2">Tipo:</span>
            {recipeTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="rounded-2xl whitespace-nowrap"
              >
                {type}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            <span className="text-sm text-muted-foreground self-center whitespace-nowrap mr-2">Categoria:</span>
            {recipeCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-2xl whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-muted-foreground">
          {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Recipes Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredRecipes.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 h-full overflow-hidden group cursor-pointer">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="rounded-xl bg-white/90 backdrop-blur-sm">
                    {item.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart 
                      className={`w-4 h-4 ${item.isFavorite ? 'fill-purple-600 text-purple-600' : 'text-purple-900'}`} 
                    />
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.date)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {item.excerpt}
                </p>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Ingredientes:</p>
                    <p className="text-sm text-muted-foreground">
                      {item.ingredients.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Como usar:</p>
                    <p className="text-sm text-muted-foreground">
                      {item.usage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs rounded-lg"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredRecipes.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground text-lg">
            Nenhuma receita encontrada com os filtros selecionados.
          </p>
        </motion.div>
      )}
      </div>
    </div>
  );
}

