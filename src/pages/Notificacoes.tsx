import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Info, AlertCircle, Sparkles, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  type: 'update' | 'info' | 'warning' | 'feature';
  title: string;
  description: string;
  date: Date;
  read: boolean;
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'update',
    title: 'Nova funcionalidade: Busca avançada',
    description: 'Agora você pode buscar óleos essenciais por nome, nome científico, família botânica, forma de extração e muito mais!',
    date: new Date('2025-11-13'),
    read: false,
  },
  {
    id: '2',
    type: 'feature',
    title: 'Sistema de notificações implementado',
    description: 'Agora você pode acompanhar todas as atualizações do sistema em tempo real através desta página.',
    date: new Date('2025-11-13'),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Melhorias na busca',
    description: 'Agora você pode buscar óleos essenciais de forma mais fácil! Não precisa se preocupar com maiúsculas, minúsculas ou acentos. Por exemplo, você pode digitar "erva" e encontrar "Erva-baleeira", ou digitar "lavanda" e encontrar todos os óleos de lavanda.',
    date: new Date('2025-11-13'),
    read: true,
  },
];

export default function Notificacoes() {
  // Carregar notificações do localStorage ou usar as padrão
  const loadNotifications = (): Notification[] => {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verificar se há notificações antigas que precisam ser removidas
        const validIds = ['1', '2', '3']; // IDs das notificações atuais
        const filtered = parsed.filter((n: any) => validIds.includes(n.id));
        
        // Se houver notificações removidas, atualizar o localStorage
        if (filtered.length !== parsed.length) {
          // Atualizar as notificações existentes com novos dados se necessário
          const updated = defaultNotifications.map(defaultNotif => {
            const existing = filtered.find((n: any) => n.id === defaultNotif.id);
            if (existing) {
              // Manter o status de leitura, mas atualizar outros dados se necessário
              return {
                ...defaultNotif,
                read: existing.read,
              };
            }
            return defaultNotif;
          });
          localStorage.setItem('notifications', JSON.stringify(updated));
          return updated.map((n: any) => ({
            ...n,
            date: new Date(n.date),
          }));
        }
        
        // Converter datas de string para Date
        return filtered.map((n: any) => ({
          ...n,
          date: new Date(n.date),
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
    return defaultNotifications;
  };

  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

  // Inicializar ou atualizar localStorage na primeira carga
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    const notificationsVersion = localStorage.getItem('notifications-version');
    const currentVersion = '2.0'; // Versão atual das notificações
    
    // Se a versão mudou ou não existe, atualizar notificações
    if (!stored || notificationsVersion !== currentVersion) {
      // Sempre atualizar com os dados mais recentes
      try {
        if (stored) {
          const parsed = JSON.parse(stored);
          const validIds = ['1', '2', '3'];
          
          // Atualizar com apenas as notificações válidas, usando dados atualizados
          const updated = defaultNotifications.map(defaultNotif => {
            const existing = parsed.find((n: any) => n.id === defaultNotif.id);
            if (existing) {
              // Manter apenas o status de leitura, usar todos os outros dados atualizados
              return {
                ...defaultNotif,
                read: existing.read,
              };
            }
            return defaultNotif;
          });
          
          // Remover notificações que não existem mais (IDs 4 e 5)
          const filtered = updated.filter(n => validIds.includes(n.id));
          
          localStorage.setItem('notifications', JSON.stringify(filtered));
          localStorage.setItem('notifications-version', currentVersion);
          setNotifications(filtered.map((n: any) => ({
            ...n,
            date: new Date(n.date),
          })));
        } else {
          localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
          localStorage.setItem('notifications-version', currentVersion);
          setNotifications(defaultNotifications);
        }
      } catch (error) {
        // Se houver erro, resetar para padrão
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
        localStorage.setItem('notifications-version', currentVersion);
        setNotifications(defaultNotifications);
      }
    } else {
      // Se a versão é a mesma, apenas carregar e atualizar dados se necessário
      try {
        const parsed = JSON.parse(stored);
        const validIds = ['1', '2', '3'];
        const filtered = parsed.filter((n: any) => validIds.includes(n.id));
        
        // Atualizar dados mantendo status de leitura
        const updated = defaultNotifications.map(defaultNotif => {
          const existing = filtered.find((n: any) => n.id === defaultNotif.id);
          if (existing) {
            return {
              ...defaultNotif,
              read: existing.read,
            };
          }
          return defaultNotif;
        });
        
        setNotifications(updated.map((n: any) => ({
          ...n,
          date: new Date(n.date),
        })));
      } catch (error) {
        localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
        localStorage.setItem('notifications-version', currentVersion);
        setNotifications(defaultNotifications);
      }
    }
  }, []);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    // Disparar evento customizado para atualizar o header
    window.dispatchEvent(new Event('notifications-updated'));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'update':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'feature':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: Notification['type']) => {
    switch (type) {
      case 'update':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Atualização</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Informação</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Aviso</Badge>;
      case 'feature':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Nova Funcionalidade</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Notificações</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Acompanhe todas as atualizações do sistema
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma notificação disponível</p>
            </Card>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    !notification.read 
                      ? 'bg-purple-50 border-purple-200 border-2' 
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-lg font-semibold ${
                              !notification.read ? 'text-slate-900' : 'text-slate-700'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm mb-3">
                            {notification.description}
                          </p>
                        </div>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(notification.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        {notification.read && (
                          <span className="text-green-600">✓ Lida</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

