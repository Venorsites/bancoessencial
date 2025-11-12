import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Droplet, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { oilsApi, Oil } from "@/services/oilsApi";
import { doencasApi, DoencaGeral } from "@/services/doencasApi";

interface SearchResult {
  id: string;
  type: 'oil' | 'disease';
  title: string;
  subtitle?: string;
  href: string;
}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Buscar quando o termo mudar
  useEffect(() => {
    const search = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        // Buscar óleos e doenças em paralelo
        const [oils, diseases] = await Promise.all([
          oilsApi.getAll(searchTerm, true),
          doencasApi.getAll(searchTerm, undefined, true),
        ]);

        const searchResults: SearchResult[] = [];

        // Adicionar óleos aos resultados
        oils.forEach((oil: Oil) => {
          searchResults.push({
            id: oil.id,
            type: 'oil',
            title: oil.nome,
            subtitle: oil.nome_cientifico,
            href: `/oleos/${oil.id}`,
          });
        });

        // Adicionar doenças aos resultados
        diseases.forEach((disease: DoencaGeral) => {
          searchResults.push({
            id: disease.id,
            type: 'disease',
            title: disease.nome,
            subtitle: disease.categoria,
            href: `/doencas/geral?search=${encodeURIComponent(disease.nome)}`,
          });
        });

        // Limitar a 10 resultados (5 de cada tipo)
        setResults(searchResults.slice(0, 10));
      } catch (error) {
        console.error("Erro ao buscar:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce: aguardar 300ms após o usuário parar de digitar
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleResultClick = (href: string) => {
    navigate(href);
    setSearchTerm("");
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setIsFocused(false);
    } else if (e.key === "Enter" && results.length > 0) {
      handleResultClick(results[0].href);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar óleos, doenças..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0 || searchTerm.length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={`pl-10 pr-4 rounded-2xl transition-all duration-300 w-full md:w-64 ${
            isFocused ? 'md:w-80 shadow-medium' : ''
          }`}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Dropdown de resultados */}
      <AnimatePresence>
        {isOpen && (results.length > 0 || (searchTerm.length >= 2 && !isLoading)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full md:min-w-[400px] max-h-[500px] overflow-y-auto bg-background border border-border rounded-2xl shadow-lg z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                <p className="text-sm">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <Button
                    key={`${result.type}-${result.id}`}
                    variant="ghost"
                    className="w-full justify-start p-3 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    onClick={() => handleResultClick(result.href)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        result.type === 'oil' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-pink-100 text-pink-600'
                      }`}>
                        {result.type === 'oil' ? (
                          <Droplet className="w-4 h-4" />
                        ) : (
                          <Heart className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">
                        {result.type === 'oil' ? 'Óleo' : 'Doença'}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">Nenhum resultado encontrado</p>
                <p className="text-xs mt-1">Tente buscar por outro termo</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

