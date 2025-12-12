import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

interface PolicyAcceptanceModalProps {
  open: boolean;
  onAccept: () => void;
}

export function PolicyAcceptanceModal({ open, onAccept }: PolicyAcceptanceModalProps) {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!user || !token) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para aceitar a política.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/policy-acceptance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          accepted: true,
          policy_version: "2.0",
          ip_address: "", // Será preenchido pelo backend se necessário
          user_agent: navigator.userAgent,
        }),
      });

      // Verificar se a resposta é OK antes de tentar fazer parse
      if (!response.ok) {
        let errorMessage = "Erro ao registrar aceite";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Se não conseguir fazer parse do JSON, usar o texto da resposta
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Verificar se já foi aceito (backend retorna status 200 mesmo quando já aceitou)
      if (data.message && (data.message.includes('já foi aceita') || data.message.includes('já aceita'))) {
        // Se já foi aceito, apenas fechar o modal e atualizar cache
        console.log("✅ [Policy] Política já estava aceita anteriormente");
        
        // Salvar no cache local
        try {
          localStorage.setItem(`policy_accepted_${user.id}_2.0`, 'true');
        } catch (error) {
          console.error('Erro ao salvar cache:', error);
        }
        
        toast({
          title: "Política aceita",
          description: "Sua aceitação foi confirmada.",
        });
        
        onAccept();
        return;
      }

      // Verificar se foi aceito com sucesso
      if (data.accepted || data.message?.includes('aceita com sucesso')) {
        // Salvar no cache local após aceitar com sucesso
        try {
          localStorage.setItem(`policy_accepted_${user.id}_2.0`, 'true');
        } catch (error) {
          console.error('Erro ao salvar cache:', error);
        }
        
        toast({
          title: "Política aceita",
          description: "Obrigado por aceitar nossa política de privacidade e termos de uso.",
        });

        onAccept();
      } else {
        throw new Error(data.message || "Resposta inesperada do servidor");
      }
    } catch (error: any) {
      console.error("Erro ao aceitar política:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar aceite. Tente novamente.",
        variant: "destructive",
      });
      // Não fechar o modal em caso de erro para o usuário poder tentar novamente
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-[600px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto [&>button]:hidden p-4 sm:p-6 mx-2 sm:mx-auto"
      >
        <DialogHeader className="space-y-3 sm:space-y-4">
          <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-full flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <DialogTitle className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
              Política de Privacidade e Termos de Uso
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Para continuar utilizando o Banco de Dados Essencial, é necessário que você leia e aceite nossa Política de Privacidade e Termos de Uso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-purple-900 text-sm sm:text-base">Principais pontos:</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Não compartilhe seu acesso:</strong> O acesso é pessoal e intransferível. Compartilhar seu login não é permitido.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Evite copiar o conteúdo:</strong> O conteúdo é exclusivo e protegido por direitos autorais.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Comunidade de apoio:</strong> Se encontrar informações incorretas, entre em contato conosco.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Busque os conteúdos completos nas aulas:</strong> Este sistema é um apoio à consulta, não substitui as aulas completas.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-slate-700 mb-2 leading-relaxed">
              <strong>Proteção de Dados (LGPD):</strong> Seus dados pessoais são tratados de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Coletamos apenas os dados necessários para fornecer o serviço e melhorar sua experiência.
            </p>
            <Link
              to="/politica-e-termos"
              target="_blank"
              className="text-purple-700 hover:text-purple-800 underline text-xs sm:text-sm font-medium inline-flex items-center space-x-1 break-words"
            >
              <span>Ler política completa</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </Link>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
          <Button
            onClick={handleAccept}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-sm sm:text-base py-2.5 sm:py-2 px-4 sm:px-6"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Processando...
              </span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aceito os termos e condições
              </>
            )}
          </Button>
        </DialogFooter>
        <p className="text-xs text-center text-slate-500 mt-2 sm:mt-3 px-2 leading-relaxed">
          Para continuar utilizando o sistema, é necessário aceitar a Política de Privacidade e Termos de Uso.
        </p>
      </DialogContent>
    </Dialog>
  );
}

