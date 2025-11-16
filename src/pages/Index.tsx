import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PolicyAcceptanceModal } from "@/components/PolicyAcceptanceModal";
import { BetaVersionModal, shouldShowBetaNotification } from "@/components/BetaVersionModal";
import { API_URL } from "@/config/api";

const Index = () => {
  const { user, token, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [betaModalChecked, setBetaModalChecked] = useState(false);

  // Funções auxiliares para gerenciar cache local (usando useCallback para evitar recriações)
  const getCachedAcceptance = useCallback((userId: string): boolean | null => {
    try {
      const cached = localStorage.getItem(`policy_accepted_${userId}_2.0`);
      if (cached === 'true') {
        return true;
      }
      return null; // null significa que não há cache
    } catch (error) {
      return null;
    }
  }, []);

  const setCachedAcceptance = useCallback((userId: string, accepted: boolean) => {
    try {
      localStorage.setItem(`policy_accepted_${userId}_2.0`, accepted ? 'true' : 'false');
    } catch (error) {
      console.error('Erro ao salvar cache de aceite:', error);
    }
  }, []);

  // Verificar se o usuário já aceitou a política
  useEffect(() => {
    // Aguardar o auth terminar de carregar
    if (authLoading) {
      console.log("🔍 [Policy] Aguardando autenticação carregar...");
      return;
    }

    // Se não tiver usuário autenticado, não precisa verificar
    if (!user || !token) {
      console.log("🔍 [Policy] Usuário não autenticado, não precisa verificar política");
      setIsChecking(false);
      setHasChecked(true);
      return;
    }

    // Evitar verificar múltiplas vezes
    if (hasChecked) {
      return;
    }

    const checkPolicyAcceptance = async () => {
      console.log("🔍 [Policy] Iniciando verificação para usuário:", user.id);

      // Primeiro, verificar cache local
      const cached = getCachedAcceptance(user.id);
      if (cached === true) {
        console.log("✅ [Policy] Aceite encontrado no cache local");
        setIsChecking(false);
        setHasChecked(true);
        return; // Não mostrar modal se já aceitou
      }

      try {
        const response = await fetch(`${API_URL}/policy-acceptance/check?version=2.0`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("🔍 [Policy] Resposta do servidor:", response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log("🔍 [Policy] Dados recebidos:", data);
          
          if (!data.hasAccepted) {
            console.log("✅ [Policy] Usuário não aceitou, mostrando modal");
            setShowPolicyModal(true);
            // Não salvar no cache se não aceitou
          } else {
            console.log("✅ [Policy] Usuário já aceitou a política");
            // Salvar no cache local
            setCachedAcceptance(user.id, true);
          }
        } else {
          // Se a resposta não for OK, verificar cache antes de mostrar modal
          const cached = getCachedAcceptance(user.id);
          if (cached === true) {
            console.log("⚠️ [Policy] Erro na verificação, mas cache indica que já aceitou");
            // Não mostrar modal se o cache indica que já aceitou
          } else {
            const errorText = await response.text();
            console.warn("⚠️ [Policy] Resposta não OK e sem cache, mostrando modal por segurança:", {
              status: response.status,
              error: errorText
            });
            setShowPolicyModal(true);
          }
        }
      } catch (error: any) {
        console.error("❌ [Policy] Erro ao verificar aceite da política:", error);
        // Em caso de erro, verificar cache antes de mostrar modal
        const cached = getCachedAcceptance(user.id);
        if (cached === true) {
          console.log("✅ [Policy] Erro na verificação, mas cache indica que já aceitou");
          // Não mostrar modal se o cache indica que já aceitou
        } else {
          console.log("✅ [Policy] Mostrando modal devido a erro e sem cache");
          setShowPolicyModal(true);
        }
      } finally {
        setIsChecking(false);
        setHasChecked(true);
      }
    };

    checkPolicyAcceptance();
  }, [user, token, authLoading, hasChecked]);

  const handlePolicyAccept = () => {
    setShowPolicyModal(false);
    // Salvar no cache local imediatamente após aceitar
    if (user) {
      setCachedAcceptance(user.id, true);
    }
    // Mostrar modal beta logo após aceitar os termos, se o usuário não tiver optado por não ver mais
    // Só mostrar se o usuário estiver autenticado
    if (user && shouldShowBetaNotification(user.id)) {
      // Marcar que o modal será mostrado nesta sessão
      const sessionKey = `beta_notification_shown_${user.id}`;
      sessionStorage.setItem(sessionKey, "true");
      
      // Pequeno delay para melhor UX
      setTimeout(() => {
        setShowBetaModal(true);
      }, 300);
    }
  };

  const handleBetaModalClose = () => {
    setShowBetaModal(false);
  };

  const handleCardClick = (e: React.MouseEvent, href: string, adminOnly?: boolean) => {
    if (adminOnly && !isAdmin) {
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

  const allContentCards = [
    {
      image:
        "https://i.ibb.co/N2CVmNZL/Banco-de-Dados-leos-Essenciais-Fichas-Completas.webp",
      title: "Banco de Dados Essencial - Óleos Essenciais (Fichas Completas)",
      description:
        "Base completa com propriedades e aplicações de centenas de óleos essenciais",
      href: "/oleos",
      color: "from-purple-400 to-purple-600",
    },
    {
      image:
        "https://i.ibb.co/N6Nq66d8/Guia-de-Consulta-Doen-as-Condi-es-x-leos-Essenciais-de-A-a-Z.webp",
      title:
        "Guia de Consulta - Doenças/Condições x Óleos Essenciais de A a Z",
      description:
        "Recomendações de óleos essenciais para diferentes condições de saúde",
      href: "/doencas",
      color: "from-pink-400 to-pink-600",
      adminOnly: true,
    },
    {
      image:
        "https://i.ibb.co/twk59f8d/DALLE-2024-11-19-17-34-33-A-wide-artistic-watercolor-representation-of-essential-oil-chemical-groups.webp",
      title: "Resumo dos principais grupos químicos",
      description:
        "Compreenda a química por trás dos óleos essenciais e suas propriedades",
      href: "/quimica",
      color: "from-green-400 to-green-600",
      adminOnly: true,
    },
    {
      image: "https://i.ibb.co/whpd6f5J/Banco-de-Conte-dos-Insta-da-Dai.webp",
      title: "Banco de Conteúdos - Insta da Dai",
      description: "Acesso organizado aos conteúdos educativos do Instagram",
      href: "/conteudos",
      color: "from-blue-400 to-blue-600",
      adminOnly: true,
    },
    {
      image:
        "https://i.ibb.co/b5SmSFzS/Chat-GPT-Image-9-de-abr-de-2025-17-30-51.webp",
      title: "Repositório de receitas e protocolos prontos [em construção]",
      description:
        "Coleção de receitas e protocolos para uso dos óleos essenciais",
      href: "/favoritos",
      color: "from-orange-400 to-orange-600",
    },
  ];

  // Mostrar todos os cards (filtro removido)
  const contentCards = allContentCards;

  // Debug: log do estado do modal
  useEffect(() => {
    console.log("🔍 [Policy Modal] Estado:", { 
      showPolicyModal, 
      isChecking, 
      hasChecked,
      authLoading,
      user: user?.id, 
      token: !!token,
      shouldShow: showPolicyModal && !isChecking 
    });
  }, [showPolicyModal, isChecking, hasChecked, authLoading, user, token]);

  // Remover ou ajustar o timeout - não é mais necessário com cache
  // useEffect(() => {
  //   if (!user || !token || authLoading) return;
  //   
  //   const timeout = setTimeout(() => {
  //     if (isChecking && !hasChecked) {
  //       console.warn("⚠️ [Policy] Timeout na verificação, mostrando modal por segurança");
  //       setShowPolicyModal(true);
  //       setIsChecking(false);
  //       setHasChecked(true);
  //     }
  //   }, 3000);
  //
  //   return () => clearTimeout(timeout);
  // }, [user, token, authLoading, isChecking, hasChecked]);

  // Mostrar modal beta apenas uma vez após login, se o usuário já aceitou os termos
  useEffect(() => {
    // Aguardar o auth terminar de carregar
    if (authLoading) {
      return;
    }

    // Se não tiver usuário autenticado, não mostrar
    if (!user || !token) {
      return;
    }

    // Se já verificou o modal beta, não verificar novamente
    if (betaModalChecked) {
      return;
    }

    // Só verificar após a verificação de política terminar
    if (isChecking || !hasChecked) {
      return;
    }

    // Verificar se o usuário já aceitou os termos e se deve mostrar o modal beta
    const checkBetaModal = async () => {
      try {
        const response = await fetch(`${API_URL}/policy-acceptance/check?version=2.0`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Se já aceitou os termos e ainda não viu o modal beta, mostrar
          if (data.hasAccepted && shouldShowBetaNotification(user.id)) {
            // Marcar que o modal será mostrado nesta sessão
            const sessionKey = `beta_notification_shown_${user.id}`;
            sessionStorage.setItem(sessionKey, "true");
            
            // Pequeno delay para melhor UX
            setTimeout(() => {
              setShowBetaModal(true);
              setBetaModalChecked(true);
            }, 1000);
          } else {
            setBetaModalChecked(true);
          }
        } else {
          setBetaModalChecked(true);
        }
      } catch (error) {
        console.error("❌ [Beta Modal] Erro ao verificar:", error);
        setBetaModalChecked(true);
      }
    };

    checkBetaModal();
  }, [user, token, authLoading, isChecking, hasChecked, betaModalChecked]);

  return (
    <>
      <PolicyAcceptanceModal 
        open={showPolicyModal && !isChecking} 
        onAccept={handlePolicyAccept}
      />
      <BetaVersionModal 
        open={showBetaModal} 
        onClose={handleBetaModalClose}
        userId={user?.id}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ===== Banner full-width com imagem ===== */}
      <section className="relative w-full h-32 sm:h-32 lg:h-40 flex items-center">
        <img
          src="https://i.ibb.co/xtPW4mv4/fundo.webp"
          alt="Banner aromaterapia"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_91%]"
        />
      </section>

      {/* ===== Conteúdo principal ===== */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Conteúdos Section */}
          <section>
            <div className="section-header">
              <h2 className="section-title">
                <CheckCircle className="section-icon text-green-500" />
                Conteúdos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contentCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    to={card.href}
                    onClick={(e) => handleCardClick(e, card.href, card.adminOnly)}
                  >
                    <Card className="dashboard-card group flex flex-col overflow-hidden">
                      <div className="relative w-full aspect-[16/9]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {card.href !== '/oleos' && (
                          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 text-[10px] font-semibold shadow">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            Em breve
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-3 sm:p-4">
                        <h3 className="dashboard-title text-slate-800 group-hover:text-purple-600 transition-colors text-sm sm:text-base leading-tight text-left font-semibold line-clamp-2 mb-2">
                          {card.title}
                        </h3>
                        <p className="dashboard-description text-slate-600 text-xs sm:text-sm leading-snug text-left line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default Index;
