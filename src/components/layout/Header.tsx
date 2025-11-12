import { useState, useEffect } from "react";
import { Search, Heart, Menu, X, User, Settings, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/SearchBar";
import logo from "@/assets/logo-banco.svg";

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const adminOnlyRoutes = ['/doencas', '/quimica', '/conteudos'];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (adminOnlyRoutes.some(route => href.startsWith(route)) && !isAdmin) {
      e.preventDefault();
      toast({
        title: "Em breve!",
        description: "Esta página estará disponível em breve.",
        className: "border-0",
        style: {
          backgroundColor: '#7D5FBB',
          color: '#ffffff',
        },
      });
      return false;
    }
  };

  const navItems = [
    { href: "/oleos", label: "Óleos Essenciais", active: location.pathname === "/oleos" },
    { href: "/doencas", label: "Guia de Doenças", active: location.pathname === "/doencas" },
    { href: "/quimica", label: "Grupos Químicos", active: location.pathname === "/quimica" },
    { href: "/conteudos", label: "Conteúdos", active: location.pathname === "/conteudos" },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 relative">
            <motion.div 
              className="h-16 flex items-center justify-center relative"
              style={{ width: 'auto' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={logo} 
                alt="Logo Banco de Dados Essencial" 
                className="h-full w-auto object-contain"
              />
              <Badge className="absolute -top-2 left-0 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] bg-purple-600 text-white shadow z-10">
                Beta
              </Badge>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <Button 
                  variant={item.active ? "default" : "ghost"}
                  className="relative rounded-xl overflow-visible"
                >
                  <span className="inline-flex items-center">
                    {item.label}
                  </span>
                  {(item.href === '/doencas' || item.href === '/quimica' || item.href === '/conteudos') && (
                    <span className="absolute -top-3 -right-2 flex items-center gap-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 text-[10px] font-semibold shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      Em breve
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            layout
          >
            <SearchBar />

            {/* Action Buttons */}
            <Link to="/favoritos">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Heart className="w-5 h-5 fill-purple-600 text-purple-600" />
              </Button>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-2 p-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-700" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.nome} {user.sobrenome}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/favoritos")}>
                      <Heart className="w-4 h-4 mr-2" />
                      Favoritos
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Sistema
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}

            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-3 border-t border-border/50 pt-4"
            >
              {/* Mobile Search */}
              <div className="px-2">
                <SearchBar />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    to={item.href}
                    onClick={(e) => {
                      if (handleNavClick(e, item.href) === false) {
                        return;
                      }
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Button 
                      variant={item.active ? "default" : "ghost"}
                      className="w-full justify-start rounded-xl relative overflow-visible"
                    >
                      <span className="inline-flex items-center">
                        {item.label}
                      </span>
                      {(item.href === '/doencas' || item.href === '/quimica' || item.href === '/conteudos') && (
                        <span className="absolute -top-1 right-2 flex items-center gap-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 text-[10px] font-semibold shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          Em breve
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="space-y-2 pt-2">
                {user ? (
                  <>
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start rounded-xl">
                        <User className="w-4 h-4 mr-2" />
                        Meu Perfil
                      </Button>
                    </Link>
                    
                    <Link to="/favoritos">
                      <Button variant="ghost" className="w-full justify-start rounded-xl">
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritos
                        <Badge variant="destructive" className="ml-2">3</Badge>
                      </Button>
                    </Link>

                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full justify-start rounded-xl text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full justify-start rounded-xl">
                        <User className="w-4 h-4 mr-2" />
                        Entrar
                      </Button>
                    </Link>

                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}