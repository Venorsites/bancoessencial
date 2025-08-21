import { useState } from "react";
import { Search, Filter, Heart, ChevronDown, Info } from "lucide-react";
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
        {/* ===== BLOCO INFORMACIONAL (substitui o antigo título simples) ===== */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Banco de Dados – Óleos Essenciais (Fichas Completas)
          </h1>

          {/* Caixa informativa com ícone */}
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50/60 p-4 md:p-5 text-[15px] text-neutral-700">
            <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Info className="h-5 w-5 text-purple-700" />
                </span>
              </div>
              <p className="leading-relaxed">
                Este é o seu <strong>banco de dados de pesquisa</strong> sobre óleos essenciais, que será
                constantemente atualizado e ajustado com as informações mais recentes. Aqui, você encontrará
                detalhes sobre a composição química, propriedades terapêuticas, indicações de uso e muito mais,
                tudo cuidadosamente organizado para consultas rápidas e eficazes.
              </p>
            </div>
          </div>

          {/* Drops/Accordions (nativos com <details>) */}
          <div className="mt-4 space-y-3">
            {/* Drop 1 */}
            <details className="group rounded-xl border border-neutral-200 bg-white p-4 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-lg font-semibold text-neutral-900">
                  E se eu encontrar alguma informação incorreta?
                </span>
                <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 text-neutral-700 leading-relaxed">
                Se você perceber alguma informação errada ou desatualizada, é só entrar em contato comigo pelo
                e-mail <a href="mailto:suporte@daianealaniz.com.br" className="text-purple-700 underline">suporte@daianealaniz.com.br</a>.
                O banco de dados está sempre sendo atualizado, então <strong>pode acontecer de algo precisar de ajustes</strong>.
                Assim que você me avisar, vou revisar as fontes e, se necessário, buscar novos estudos para garantir
                que tudo esteja correto. A ideia é manter as informações sempre precisas para que o uso dos óleos
                essenciais seja o mais <strong>seguro e eficaz</strong> possível!
              </div>
            </details>

            {/* Drop 2 */}
            <details className="group rounded-xl border border-neutral-200 bg-white p-4 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-lg font-semibold text-neutral-900">
                  Regras de Convivência e Compartilhamento
                </span>
                <ChevronDown className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 text-neutral-700 leading-relaxed">
                <ul className="space-y-3 pl-5">
                  <li className="list-disc">
                    <strong>Não compartilhe seu acesso:</strong> o acesso ao banco de dados e aos conteúdos é pessoal e intransferível.
                    Compartilhar seu login compromete a integridade do material e não é permitido.
                  </li>
                  <li className="list-disc">
                    <strong>Evite copiar o conteúdo:</strong> o conteúdo aqui é exclusivo e criado com muito cuidado.
                    Copiar ou distribuir sem permissão vai contra a nossa comunidade de apoio e aprendizado.
                  </li>
                  <li className="list-disc">
                    <strong>Somos uma comunidade que se ajuda:</strong> se você encontrar alguma informação errada ou desatualizada,
                    me avise para que eu possa corrigir! Entre em contato pelo e-mail{" "}
                    <a href="mailto:suporte@daianealaniz.com.br" className="text-purple-700 underline">
                      suporte@daianealaniz.com.br
                    </a>.
                  </li>
                  <li className="list-disc">
                    <strong>Busque os conteúdos completos nas aulas:</strong> antes de replicar qualquer informação ou ideia,
                    certifique-se de buscar o conteúdo completo dentro das aulas e materiais disponíveis. É importante ter uma visão clara e crítica.
                  </li>
                </ul>
              </div>
            </details>
          </div>
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
