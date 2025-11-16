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

      const data = await response.json();

      // Verificar se já foi aceito (backend retorna status 200 mesmo quando já aceitou)
      if (data.message && data.message.includes('já foi aceita')) {
        // Se já foi aceito, apenas fechar o modal e atualizar cache
        console.log("✅ [Policy] Política já estava aceita anteriormente");
        toast({
          title: "Política já aceita",
          description: "Esta política já foi aceita anteriormente.",
        });
        
        // Salvar no cache local
        try {
          localStorage.setItem(`policy_accepted_${user.id}_2.0`, 'true');
        } catch (error) {
          console.error('Erro ao salvar cache:', error);
        }
        
        onAccept();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Erro ao registrar aceite");
      }
      
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
    } catch (error: any) {
      console.error("Erro ao aceitar política:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar aceite. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:hidden"
      >
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Política de Privacidade e Termos de Uso
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-slate-600">
            Para continuar utilizando o Banco de Dados Essencial, é necessário que você leia e aceite nossa Política de Privacidade e Termos de Uso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-purple-900">Principais pontos:</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Não compartilhe seu acesso:</strong> O acesso é pessoal e intransferível. Compartilhar seu login não é permitido.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Evite copiar o conteúdo:</strong> O conteúdo é exclusivo e protegido por direitos autorais.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Comunidade de apoio:</strong> Se encontrar informações incorretas, entre em contato conosco.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Busque os conteúdos completos nas aulas:</strong> Este sistema é um apoio à consulta, não substitui as aulas completas.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 mb-2">
              <strong>Proteção de Dados (LGPD):</strong> Seus dados pessoais são tratados de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Coletamos apenas os dados necessários para fornecer o serviço e melhorar sua experiência.
            </p>
            <Link
              to="/politica-e-termos"
              target="_blank"
              className="text-purple-700 hover:text-purple-800 underline text-sm font-medium inline-flex items-center space-x-1"
            >
              <span>Ler política completa</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={handleAccept}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? (
              "Processando..."
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aceito os termos e condições
              </>
            )}
          </Button>
        </DialogFooter>
        <p className="text-xs text-center text-slate-500 mt-2">
          Para continuar utilizando o sistema, é necessário aceitar a Política de Privacidade e Termos de Uso.
        </p>
      </DialogContent>
    </Dialog>
  );
}

