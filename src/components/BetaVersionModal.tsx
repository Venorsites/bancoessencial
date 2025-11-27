import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Mail, MessageCircle } from "lucide-react";

interface BetaVersionModalProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

const getBetaNotificationKey = (userId?: string) => {
  if (userId) {
    return `beta_notification_dismissed_${userId}`;
  }
  return "beta_notification_dismissed";
};

const getBetaSessionKey = (userId?: string) => {
  if (userId) {
    return `beta_notification_shown_${userId}`;
  }
  return "beta_notification_shown";
};

export function BetaVersionModal({ open, onClose, userId }: BetaVersionModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      const key = getBetaNotificationKey(userId);
      localStorage.setItem(key, "true");
    }
    // Marcar que o modal foi mostrado nesta sessão
    if (userId) {
      const sessionKey = getBetaSessionKey(userId);
      sessionStorage.setItem(sessionKey, "true");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="max-w-[95%] sm:max-w-[500px] [&>button]:hidden"
      >
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Versão Beta
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-slate-600">
            Estamos em uma versão beta e teremos diversas atualizações!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-slate-700">
              Estamos trabalhando constantemente para melhorar sua experiência. 
              Durante esta fase beta, você pode encontrar algumas funcionalidades 
              em desenvolvimento ou ajustes sendo realizados.
            </p>
            <p className="text-sm text-slate-700">
              <strong>Suas opiniões e feedback são muito importantes para nós!</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 mb-3">
              <strong>Precisa de ajuda ou tem alguma dúvida?</strong>
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/5518981792777?text=Olá, estou no Banco de Dados Essencial e gostaria de tirar uma dúvida!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">WhatsApp: (18) 98179-2777</span>
              </a>
              <a
                href="mailto:suporte@daianealaniz.com?subject=Contato via Banco de Dados Essencial&body=Olá, estou no Banco de Dados Essencial e gostaria de tirar uma dúvida!"
                className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">E-mail: suporte@daianealaniz.com</span>
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dont-show-again"
              className="text-sm text-slate-600 cursor-pointer"
            >
              Não desejo mais ver esta notificação
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
          >
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function shouldShowBetaNotification(userId?: string): boolean {
  if (!userId) {
    return false; // Só mostrar se tiver usuário autenticado
  }
  
  // Verificar se o usuário optou por não ver mais
  const key = getBetaNotificationKey(userId);
  if (localStorage.getItem(key) === "true") {
    return false;
  }
  
  // Verificar se já foi mostrado nesta sessão
  const sessionKey = getBetaSessionKey(userId);
  if (sessionStorage.getItem(sessionKey) === "true") {
    return false;
  }
  
  return true;
}

