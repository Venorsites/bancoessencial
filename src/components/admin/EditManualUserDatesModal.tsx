import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  user_source?: string;
  access_start_date?: string;
  access_end_date?: string;
  auto_suspend_on_expire?: boolean;
  manual_notes?: string;
}

interface EditManualUserDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export function EditManualUserDatesModal({ isOpen, onClose, onSuccess, user }: EditManualUserDatesModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    access_start_date: "",
    access_end_date: "",
    auto_suspend_on_expire: true,
    manual_notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        access_start_date: user.access_start_date 
          ? new Date(user.access_start_date).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
        access_end_date: user.access_end_date 
          ? new Date(user.access_end_date).toISOString().split('T')[0] 
          : "",
        auto_suspend_on_expire: user.auto_suspend_on_expire ?? true,
        manual_notes: user.manual_notes || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      // Validar datas
      if (formData.access_end_date && formData.access_start_date > formData.access_end_date) {
        toast({
          title: "Erro de validação",
          description: "A data de início deve ser anterior à data de término",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Preparar dados para envio
      const dataToSend = {
        access_start_date: formData.access_start_date ? `${formData.access_start_date}T00:00:00.000Z` : undefined,
        access_end_date: formData.access_end_date ? `${formData.access_end_date}T23:59:59.999Z` : undefined,
        auto_suspend_on_expire: formData.auto_suspend_on_expire,
        manual_notes: formData.manual_notes || undefined,
      };

      await api.patch(`/users/manual/${user.id}/dates`, dataToSend);

      toast({
        title: "Datas atualizadas com sucesso!",
        description: `Período de acesso atualizado para ${user.nome} ${user.sobrenome}`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar datas:", error);
      
      const errorMessage = error.response?.data?.message || "Ocorreu um erro ao atualizar as datas";
      
      toast({
        title: "Erro ao atualizar datas",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Editar Datas de Acesso</h3>
                  <p className="text-sm text-blue-100">{user.nome} {user.sobrenome}</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Aviso para usuários Hotmart */}
            {user.user_source === 'HOTMART' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Atenção:</strong> Este usuário foi criado via Hotmart. Não é possível alterar datas de usuários gerenciados por webhooks.
                </div>
              </div>
            )}

            {/* Informação sobre usuário manual */}
            {user.user_source === 'MANUAL' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Usuário Manual:</strong> Você pode alterar as datas de acesso a qualquer momento. Se este usuário comprar via Hotmart, o sistema automaticamente converterá para controle via webhook.
                </div>
              </div>
            )}

            {/* Período de acesso */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Período de Acesso
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="access_start_date">Data de Início *</Label>
                  <Input
                    id="access_start_date"
                    type="date"
                    value={formData.access_start_date}
                    onChange={(e) => setFormData({ ...formData, access_start_date: e.target.value })}
                    required
                    disabled={user.user_source === 'HOTMART'}
                  />
                </div>
                <div>
                  <Label htmlFor="access_end_date">Data de Término</Label>
                  <Input
                    id="access_end_date"
                    type="date"
                    value={formData.access_end_date}
                    onChange={(e) => setFormData({ ...formData, access_end_date: e.target.value })}
                    min={formData.access_start_date}
                    disabled={user.user_source === 'HOTMART'}
                  />
                  <p className="text-xs text-gray-500 mt-1">Deixe vazio para acesso ilimitado</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_suspend_on_expire"
                  checked={formData.auto_suspend_on_expire}
                  onChange={(e) => setFormData({ ...formData, auto_suspend_on_expire: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={user.user_source === 'HOTMART'}
                />
                <Label htmlFor="auto_suspend_on_expire" className="cursor-pointer">
                  Suspender automaticamente após expirar
                </Label>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Observações</h4>

              <div>
                <Label htmlFor="manual_notes">Notas (opcional)</Label>
                <Textarea
                  id="manual_notes"
                  value={formData.manual_notes}
                  onChange={(e) => setFormData({ ...formData, manual_notes: e.target.value })}
                  placeholder="Ex: Período estendido por 30 dias, Trial prolongado, etc."
                  rows={3}
                  disabled={user.user_source === 'HOTMART'}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" onClick={onClose} variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || user.user_source === 'HOTMART'} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
