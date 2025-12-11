import { useState } from "react";
import { Bug, X, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("bug");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, descreva o problema ou sugestão.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/feedback", {
        message: message.trim(),
        type,
        page_url: window.location.href,
      });

      toast({
        title: "Feedback enviado!",
        description: "Obrigado por nos ajudar a melhorar o sistema.",
      });

      setMessage("");
      setType("bug");
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar feedback",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Não mostrar em páginas de login, forgot-password, reset-password
  const hiddenPages = ["/login", "/forgot-password"];
  const isResetPassword = location.pathname.startsWith("/reset-password");
  
  if (hiddenPages.includes(location.pathname) || isResetPassword) {
    return null;
  }

  return (
    <>
      {/* Botão Flutuante */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
        size="icon"
      >
        <Bug className="w-6 h-6" />
      </Button>

      {/* Modal de Feedback */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-600" />
              Reportar Problema ou Sugestão
            </DialogTitle>
            <DialogDescription>
              Estamos em versão beta! Ajude-nos a melhorar reportando bugs, problemas ou enviando sugestões.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Tipo de relato</Label>
              <RadioGroup value={type} onValueChange={setType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="cursor-pointer">
                    Bug / Problema
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" />
                  <Label htmlFor="suggestion" className="cursor-pointer">
                    Sugestão
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="question" id="question" />
                  <Label htmlFor="question" className="cursor-pointer">
                    Dúvida
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Outro
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Descrição *</Label>
              <Textarea
                id="message"
                placeholder="Descreva o problema, bug ou sua sugestão em detalhes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {user ? `Enviado por: ${user.nome} ${user.sobrenome} (${user.email})` : "Você está logado como visitante"}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

