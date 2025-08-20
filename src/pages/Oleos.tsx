import { useState } from "react";
import { Search, Filter, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockOils = [
  {
    id: 1,
    name: "Lavanda",
    scientificName: "Lavandula angustifolia",
    category: "Floral",
    chemicalGroup: "Ésteres",
    properties: ["Calmante", "Antisséptico", "Cicatrizante"],
    uses: ["Ansiedade", "Insônia", "Queimaduras"],
    isFavorite: true,
  },
  {
    id: 2,
    name: "Tea Tree",
    scientificName: "Melaleuca alternifolia",
    category: "Medicinal",
    chemicalGroup: "Monoterpenos",
    properties: ["Antifúngico", "Antibacteriano", "Antiviral"],
    uses: ["Acne", "Caspa", "Infecções"],
    isFavorite: false,
  },
  {
    id: 3,
    name: "Eucalipto",
    scientificName: "Eucalyptus globulus",
    category: "Respiratório",
    chemicalGroup: "Óxidos",
    properties: ["Expectorante", "Descongestionante", "Antibacteriano"],
    uses: ["Gripe", "Tosse", "Sinusite"],
    isFavorite: false,
  },
];

const categories = ["Todos", "Floral", "Medicinal", "Respiratório", "Cítrico"];
const chemicalGroups = ["Todos", "Ésteres", "Monoterpenos", "Óxidos", "Aldeídos"];

export default function Oleos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedChemicalGroup, setSelectedChemicalGroup] = useState("Todos");
  const [oils, setOils] = useState(mockOils);

  const toggleFavorite = (id: number) => {
    setOils(oils.map(oil => 
      oil.id === id ? { ...oil, isFavorite: !oil.isFavorite } : oil
    ));
  };

  const filteredOils = oils.filter(oil => {
    const matchesSearch = oil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oil.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || oil.category === selectedCategory;
    const matchesChemicalGroup = selectedChemicalGroup === "Todos" || oil.chemicalGroup === selectedChemicalGroup;
    
    return matchesSearch && matchesCategory && matchesChemicalGroup;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner full-width com imagem e caixa escura só atrás do texto ===== */}
      <section className="relative w-full h-48 sm:h-64 lg:h-80 flex items-center">
        <img
          src="https://i.ibb.co/N2CVmNZL/Banco-de-Dados-leos-Essenciais-Fichas-Completas.webp"
          alt="Banner Banco de Dados - Óleos Essenciais"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* caixa de texto com fundo escuro apenas na área do texto */}
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="inline-block rounded-xl bg-black/55 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-[1px] ring-1 ring-white/10">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
              Óleos Essenciais
            </h1>
            <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
              Descubra as propriedades terapêuticas e aplicações dos óleos essenciais mais utilizados na aromaterapia.
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
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Óleos Essenciais
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Descubra as propriedades terapêuticas e aplicações dos óleos essenciais mais utilizados na aromaterapia.
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
            placeholder="Buscar óleo essencial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 rounded-2xl shadow-soft"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-2xl min-w-[180px] justify-between">
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
            <Button variant="outline" className="rounded-2xl min-w-[180px] justify-between">
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

      {/* Results Count */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-muted-foreground">
          {filteredOils.length} óleo{filteredOils.length !== 1 ? 's' : ''} encontrado{filteredOils.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Oils Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            <Card className="card-organic rounded-3xl hover:shadow-medium transition-all duration-300 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {oil.name}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">
                      {oil.scientificName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(oil.id)}
                    className="rounded-xl"
                  >
                    <Heart 
                      className={`w-5 h-5 ${oil.isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="rounded-xl">
                    {oil.category}
                  </Badge>
                  <Badge variant="outline" className="rounded-xl">
                    {oil.chemicalGroup}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Propriedades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {oil.properties.map((property) => (
                      <Badge 
                        key={property} 
                        variant="outline" 
                        className="text-xs rounded-lg"
                      >
                        {property}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Indicações:</h4>
                  <div className="flex flex-wrap gap-1">
                    {oil.uses.map((use) => (
                      <Badge 
                        key={use} 
                        variant="secondary" 
                        className="text-xs rounded-lg"
                      >
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
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
    </div>
  );
}