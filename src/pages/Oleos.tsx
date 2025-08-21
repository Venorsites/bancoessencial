import { useState } from "react";
import { Search, Filter, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
    name: "Lavanda Francesa",
    scientificName: "Lavandula angustifolia",
    category: "Floral",
    chemicalGroup: "Ésteres",
    properties: ["Calmante", "Antisséptico", "Cicatrizante"],
    uses: ["Ansiedade", "Insônia", "Queimaduras"],
    isFavorite: true,
    image: "https://i.ibb.co/8LVrD6ZM/Lavanda-Francesa.webp",
  },
  {
    id: 2,
    name: "Tea Tree (Melaleuca)",
    scientificName: "Melaleuca alternifolia",
    category: "Medicinal",
    chemicalGroup: "Monoterpenos",
    properties: ["Antifúngico", "Antibacteriano", "Antiviral"],
    uses: ["Acne", "Caspa", "Infecções"],
    isFavorite: false,
    image: "https://i.ibb.co/S7XSps0y/Tea-tree.webp",
  },
  {
    id: 3,
    name: "Eucalipto Citriodora",
    scientificName: "Eucalyptus citriodora/ Corymbia citriodora",
    category: "Respiratório",
    chemicalGroup: "Óxidos",
    properties: ["Expectorante", "Descongestionante", "Antibacteriano"],
    uses: ["Gripe", "Tosse", "Sinusite"],
    isFavorite: false,
    image: "https://i.ibb.co/qMWzfMvN/Eucalipito-Citriodora.webp",
  },
  {
    id: 4,
    name: "Alecrim qt. Cineol",
    scientificName: "Rosmarinus officinalis | Salvia rosmarinus",
    category: "Medicinal",
    chemicalGroup: "Óxidos",
    properties: ["Estimulante", "Antimicrobiano", "Expectorante"],
    uses: ["Fadiga", "Congestão", "Concentração"],
    isFavorite: false,
    image: "https://i.ibb.co/GQQTV91n/leo-Essencial-de-Alecrim-qt-Cineol.webp",
  },
  {
    id: 5,
    name: "Bergamota",
    scientificName: "Citrus x bergamia | Citrus bergamia",
    category: "Cítrico",
    chemicalGroup: "Monoterpenos",
    properties: ["Antidepressivo", "Antisséptico", "Digestivo"],
    uses: ["Ansiedade", "Depressão", "Digestão"],
    isFavorite: false,
    image: "https://i.ibb.co/QvqT62Sq/Bergamota.webp",
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
    setOils((o) =>
      o.map((oil) =>
        oil.id === id ? { ...oil, isFavorite: !oil.isFavorite } : oil
      )
    );
  };

  const filteredOils = oils.filter((oil) => {
    const matchesSearch =
      oil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oil.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || oil.category === selectedCategory;
    const matchesChemicalGroup =
      selectedChemicalGroup === "Todos" ||
      oil.chemicalGroup === selectedChemicalGroup;

    return matchesSearch && matchesCategory && matchesChemicalGroup;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner full-width ===== */}
      <section className="relative w-full h-24 sm:h-32 lg:h-40">
        <img
          src="https://i.ibb.co/N2CVmNZL/Banco-de-Dados-leos-Essenciais-Fichas-Completas.webp"
          alt="Banner Banco de Dados - Óleos Essenciais"
          className="absolute inset-0 w-full h-full object-cover object-[20%]"
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Óleos Essenciais
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra as propriedades terapêuticas e aplicações dos óleos
            essenciais mais utilizados na aromaterapia.
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
              <Button
                variant="outline"
                className="rounded-2xl min-w-[180px] justify-between"
              >
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
              <Button
                variant="outline"
                className="rounded-2xl min-w-[180px] justify-between"
              >
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
            {filteredOils.length} óleo
            {filteredOils.length !== 1 ? "s" : ""} encontrado
            {filteredOils.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Oils Grid (4 por linha no lg) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              <Card className="bg-white rounded-3xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                {/* Image Section */}
                <div className="relative w-full h-40">
                  <img
                    src={oil.image}
                    alt={oil.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* TÍTULO + FAVORITO lado a lado */}
                <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-purple-800 leading-tight">
                    {oil.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(oil.id)}
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
                      {oil.scientificName}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-purple-300 text-purple-700 hover:bg-purple-50"
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
      </div>
    </div>
  );
}
