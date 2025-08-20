import { useState } from "react";
import { Search, Heart, Calendar, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const mockContent = [
  {
    id: 1,
    title: "5 Óleos Essenciais para Relaxamento",
    type: "Post",
    date: "2024-01-15",
    excerpt: "Descubra os melhores óleos essenciais para criar um ambiente relaxante em casa.",
    tags: ["Relaxamento", "Aromaterapia", "Casa"],
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Como Fazer Blend Energizante",
    type: "Tutorial",
    date: "2024-01-10",
    excerpt: "Aprenda a criar uma mistura perfeita de óleos essenciais para aumentar sua energia.",
    tags: ["Energia", "Blend", "DIY"],
    isFavorite: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Óleos Essenciais na Meditação",
    type: "Vídeo",
    date: "2024-01-08",
    excerpt: "Como usar óleos essenciais para aprofundar sua prática de meditação.",
    tags: ["Meditação", "Mindfulness", "Espiritualidade"],
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Cuidados com a Pele usando Óleos",
    type: "Post",
    date: "2024-01-05",
    excerpt: "Dicas essenciais para cuidar da pele com óleos essenciais de forma segura.",
    tags: ["Skincare", "Beleza", "Cuidados"],
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
];

const contentTypes = ["Todos", "Post", "Tutorial", "Vídeo", "Carrossel"];

export default function Conteudos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [content, setContent] = useState(mockContent);

  const toggleFavorite = (id: number) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "Todos" || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Instagram className="w-8 h-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Conteúdos da Dai
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Acesse todo o conhecimento compartilhado no Instagram da Dai sobre óleos essenciais e aromaterapia.
        </p>
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
            placeholder="Buscar conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 rounded-2xl shadow-soft"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {contentTypes.map((type) => (
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
      </motion.div>

      {/* Results Count */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-muted-foreground">
          {filteredContent.length} conteúdo{filteredContent.length !== 1 ? 's' : ''} encontrado{filteredContent.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Content Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredContent.map((item, index) => (
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
                      className={`w-4 h-4 ${item.isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
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

                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" className="rounded-xl p-0 h-auto text-primary">
                    Ver no Instagram
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredContent.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground text-lg">
            Nenhum conteúdo encontrado com os filtros selecionados.
          </p>
        </motion.div>
      )}
    </div>
  );
}