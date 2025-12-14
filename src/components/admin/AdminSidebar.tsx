import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Droplets, 
  Users, 
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Home,
  Stethoscope,
  FileCheck,
  LogOut,
  MessageSquare,
  Webhook,
  DollarSign,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
  },
  {
    id: "oils",
    label: "Óleos Essenciais",
    icon: Droplets,
    description: "Gerenciar óleos"
  },
  {
    id: "diseases",
    label: "Doenças",
    icon: Stethoscope,
    description: "Gerenciar doenças"
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users,
    description: "Gerenciar usuários e suspensões"
  },
  {
    id: "webhooks",
    label: "Webhooks",
    icon: Webhook,
    description: "Visualizar webhooks recebidos"
  },
  {
    id: "financeiro",
    label: "Financeiro",
    icon: DollarSign,
    description: "Controle financeiro e vendas"
  },
  {
    id: "ofertas-cupons",
    label: "Ofertas",
    icon: Tag,
    description: "Gerenciar ofertas"
  },
  {
    id: "policy-acceptances",
    label: "Aceites de Política",
    icon: FileCheck,
    description: "Visualizar aceites de política"
  },
  {
    id: "feedbacks",
    label: "Feedbacks",
    icon: MessageSquare,
    description: "Relatos e sugestões dos usuários"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Relatórios e métricas"
  }
];

export function AdminSidebar({ activeTab, onTabChange, isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Detectar se está em mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsCollapsed(false); // Sempre expandido em desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    
    // Fechar sidebar em mobile após selecionar item
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
    
    // Navegar para a rota correspondente
    switch (tabId) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'oils':
        navigate('/admin/oils');
        break;
      case 'diseases':
        navigate('/admin/diseases');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'webhooks':
        navigate('/admin/webhooks');
        break;
      case 'financeiro':
        navigate('/admin/financeiro');
        break;
      case 'ofertas-cupons':
        navigate('/admin/ofertas-cupons');
        break;
      case 'policy-acceptances':
        navigate('/admin/policy-acceptances');
        break;
      case 'feedbacks':
        navigate('/admin/feedbacks');
        break;
      case 'analytics':
        navigate('/admin');
        break;
      default:
        navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Em mobile, sidebar só aparece se isMobileOpen for true
  if (isMobile && !isMobileOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <motion.div
        initial={isMobile ? { x: -300 } : { x: 0 }}
        animate={{ x: 0 }}
        exit={isMobile ? { x: -300 } : { x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed left-0 top-0 h-full bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 shadow-2xl z-50 flex flex-col",
          // Desktop: largura fixa ou colapsada
          !isMobile && (isCollapsed ? "w-16" : "w-64"),
          // Mobile: sempre largura total quando aberto
          isMobile && "w-64"
        )}
      >
      {/* Header */}
      <div className="p-4 border-b border-purple-700/50">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-purple-200 text-sm">Banco Essencial</p>
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            {/* Botão de fechar/colapsar */}
            {isMobile ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="text-white hover:bg-purple-700/50 p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white hover:bg-purple-700/50 p-2"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto flex-1 min-h-0">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-white/20 text-white shadow-lg" 
                  : "text-purple-200 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-yellow-300")} />
              {(!isCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="font-medium truncate">{item.label}</div>
                  {!isMobile && (
                    <div className="text-xs text-purple-300 opacity-80 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-purple-700/50 bg-purple-900 flex-shrink-0">
        {/* Botão Home */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            navigate('/');
            if (isMobile && onMobileClose) {
              onMobileClose();
            }
          }}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 group bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white",
            (isCollapsed && !isMobile) ? "justify-center p-2" : "p-2.5"
          )}
        >
          <Home className={cn("flex-shrink-0", (isCollapsed && !isMobile) ? "w-4 h-4" : "w-5 h-5")} />
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-left min-w-0"
            >
              <div className="font-medium truncate text-sm">Voltar ao Site</div>
            </motion.div>
          )}
        </motion.button>

        {/* Botão Sair */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            handleLogout();
            if (isMobile && onMobileClose) {
              onMobileClose();
            }
          }}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl transition-all duration-200 group bg-red-500/10 hover:bg-red-500/20 text-red-200 hover:text-white border border-red-500/20",
            (isCollapsed && !isMobile) ? "justify-center p-2" : "p-2.5"
          )}
        >
          <LogOut className={cn("flex-shrink-0", (isCollapsed && !isMobile) ? "w-4 h-4" : "w-5 h-5")} />
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-left min-w-0"
            >
              <div className="font-medium truncate text-sm">Sair</div>
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.div>
    </>
  );
}
