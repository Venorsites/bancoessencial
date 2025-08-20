import { useState, useEffect } from "react";
import { Search, Moon, Sun, Heart, Menu, X, User, Settings, LogOut } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Header({ isDark, toggleTheme }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

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
          <Link to="/" className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center glow-soft"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-lg">BD</span>
            </motion.div>
            <span className="font-dm-sans font-semibold text-xl text-foreground">
              Banco de Dados
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={item.active ? "default" : "ghost"}
                  className="rounded-xl"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            layout
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar óleos, doenças..."
                className={`pl-10 pr-4 w-64 rounded-2xl transition-all duration-300 ${
                  isSearchFocused ? 'w-80 shadow-medium' : ''
                }`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>

            {/* Action Buttons */}
            <Link to="/favoritos">
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Heart className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </Link>

            {/* User Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/favoritos")}>
                    <Heart className="w-4 h-4 mr-2" />
                    <span>Meus Favoritos</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate("/login");
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
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

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-xl"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar óleos, doenças..."
                  className="pl-10 pr-4 rounded-2xl"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button 
                      variant={item.active ? "default" : "ghost"}
                      className="w-full justify-start rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
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

                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        onClick={toggleTheme}
                        className="rounded-xl"
                      >
                        {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        {isDark ? "Modo Claro" : "Modo Escuro"}
                      </Button>

                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                        className="rounded-xl text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full justify-start rounded-xl">
                        <User className="w-4 h-4 mr-2" />
                        Entrar
                      </Button>
                    </Link>

                    <div className="flex justify-center">
                      <Button 
                        variant="ghost" 
                        onClick={toggleTheme}
                        className="rounded-xl"
                      >
                        {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        {isDark ? "Modo Claro" : "Modo Escuro"}
                      </Button>
                    </div>
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