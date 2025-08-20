import { useState, useEffect } from "react";
import { Heart, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteItem {
  id: string;
  type: 'oil' | 'disease' | 'content';
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  addedAt: string;
}

const mockFavorites: FavoriteItem[] = [
  {
    id: "oil-1",
    type: "oil",
    title: "Lavanda",
    subtitle: "Lavandula angustifolia",
    description: "Óleo essencial com propriedades calmantes e cicatrizantes.",
    tags: ["Calmante", "Cicatrizante", "Floral"],
    addedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "disease-1",
    type: "disease",
    title: "Acne",
    description: "Condição inflamatória da pele que causa espinhas e cravos.",
    tags: ["Pele", "Tea Tree", "Lavanda"],
    addedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "content-1",
    type: "content",
    title: "Como Fazer Blend Energizante",
    description: "Tutorial sobre criação de misturas energizantes com óleos essenciais.",
    tags: ["Energia", "Blend", "DIY"],
    addedAt: "2024-01-13T09:20:00Z",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'oil': return '🌿';
    case 'disease': return '🏥';
    case 'content': return '📱';
    default: return '💜';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'oil': return 'Óleo Essencial';
    case 'disease': return 'Doença';
    case 'content': return 'Conteúdo';
    default: return 'Item';
  }
};

export default function Favoritos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      // Use mock data for demo
      setFavorites(mockFavorites);
      localStorage.setItem('favorites', JSON.stringify(mockFavorites));
    }
  }, []);

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner full-width com imagem e caixa escura só atrás do texto ===== */}
      <section className="relative w-full h-48 sm:h-64 lg:h-80 flex items-center">
        <img
          src="https://i.ibb.co/b5SmSFzS/Chat-GPT-Image-9-de-abr-de-2025-17-30-51.webp"
          alt="Banner Repositório de Receitas"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* caixa de texto com fundo escuro apenas na área do texto */}
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="inline-block rounded-xl bg-black/55 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-[1px] ring-1 ring-white/10">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
              Meus Favoritos
            </h1>
            <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
              Acesse rapidamente seus óleos, doenças e conteúdos favoritos salvos para consulta posterior.
            </p>
          </div>
        </div>
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
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Meus Favoritos
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Seus óleos essenciais, doenças e conteúdos salvos para acesso rápido.
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
            placeholder="Buscar nos favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 rounded-2xl shadow-soft"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {['oil', 'disease', 'content'].map((type) => {
          const count = favorites.filter(item => item.type === type).length;
          return (
            <Card key={type} className="card-organic rounded-2xl text-center p-4">
              <div className="text-2xl mb-2">{getTypeIcon(type)}</div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-sm text-muted-foreground">{getTypeLabel(type)}{count !== 1 ? 's' : ''}</div>
            </Card>
          );
        })}
      </motion.div>

      {/* Results Count */}
      {filteredFavorites.length > 0 && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground">
            {filteredFavorites.length} favorito{filteredFavorites.length !== 1 ? 's' : ''} encontrado{filteredFavorites.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Favorites List */}
      <AnimatePresence>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {filteredFavorites.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-3xl">{getTypeIcon(item.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <Badge variant="secondary" className="rounded-xl text-xs">
                            {getTypeLabel(item.type)}
                          </Badge>
                        </div>
                        {item.subtitle && (
                          <p className="text-sm text-muted-foreground italic mb-2">
                            {item.subtitle}
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFavorite(item.id)}
                      className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
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
                  
                  <div className="text-xs text-muted-foreground">
                    Adicionado em {formatDate(item.addedAt)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredFavorites.length === 0 && favorites.length > 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-muted-foreground text-lg">
            Nenhum favorito encontrado com o termo pesquisado.
          </p>
        </motion.div>
      )}

      {favorites.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhum favorito ainda
          </h3>
          <p className="text-muted-foreground text-lg mb-6">
            Comece explorando óleos essenciais, doenças e conteúdos para adicionar aos seus favoritos.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="default" className="rounded-2xl">
              Explorar Óleos
            </Button>
            <Button variant="outline" className="rounded-2xl">
              Ver Doenças
            </Button>
            <Button variant="outline" className="rounded-2xl">
              Conteúdos
            </Button>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}