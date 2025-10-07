import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Droplets, 
  Users, 
  Settings, 
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
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
    id: "users",
    label: "Usuários",
    icon: Users,
    description: "Gerenciar usuários"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    description: "Relatórios e métricas"
  },
  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
    description: "Configurações do sistema"
  }
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    
    // Navegar para a rota correspondente
    switch (tabId) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'oils':
        navigate('/admin');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'analytics':
        navigate('/admin');
        break;
      case 'settings':
        navigate('/admin');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-b from-purple-900 to-purple-800 text-white z-40 transition-all duration-300 shadow-2xl",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-purple-200 text-sm">Banco Essencial</p>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-purple-700/50 p-2"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
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
              <Icon className={cn("w-5 h-5", isActive && "text-yellow-300")} />
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 text-left"
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        {/* Botão Home */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/')}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white",
            isCollapsed && "justify-center"
          )}
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-left"
            >
              <div className="font-medium">Voltar ao Site</div>
              <div className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                Retornar à página inicial
              </div>
            </motion.div>
          )}
        </motion.button>

        {/* Info do Sistema */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-purple-700/30 rounded-xl p-3 border border-purple-600/30">
              <div className="text-xs text-purple-200">
                Sistema de Administração
              </div>
              <div className="text-xs text-purple-300">
                v1.0.0
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
