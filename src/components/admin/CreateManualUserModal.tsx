import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, UserPlus, AlertCircle, Calendar, Mail, Phone, User, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface CreateManualUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateManualUserModal({ isOpen, onClose, onSuccess }: CreateManualUserModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    contato: "",
    senha_temporaria: "",
    access_start_date: new Date().toISOString().split('T')[0],
    access_end_date: "",
    auto_suspend_on_expire: true,
    manual_notes: "",
    send_welcome_email: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações detalhadas
      if (!formData.nome) {
        toast({
          title: "Campo obrigatório",
          description: "Por favor, preencha o Nome",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.sobrenome) {
        toast({
          title: "Campo obrigatório",
          description: "Por favor, preencha o Sobrenome",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.email) {
        toast({
          title: "Campo obrigatório",
          description: "Por favor, preencha o E-mail",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.contato) {
        toast({
          title: "Campo obrigatório",
          description: "Por favor, preencha o Contato/Telefone",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

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
        ...formData,
        access_start_date: formData.access_start_date ? `${formData.access_start_date}T00:00:00.000Z` : undefined,
        access_end_date: formData.access_end_date ? `${formData.access_end_date}T23:59:59.999Z` : null,
      };

      const response = await api.post('/users/manual', dataToSend);

      toast({
        title: "Usuário criado com sucesso!",
        description: `Senha temporária: ${response.data.temp_password}`,
        duration: 10000,
      });

      onSuccess();
      onClose();
      
      // Resetar formulário
      setFormData({
        nome: "",
        sobrenome: "",
        email: "",
        contato: "",
        senha_temporaria: "",
        access_start_date: new Date().toISOString().split('T')[0],
        access_end_date: "",
        auto_suspend_on_expire: true,
        manual_notes: "",
        send_welcome_email: true,
      });
    } catch (error: any) {
      console.error("Erro ao criar usuário manual:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o usuário",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, senha_temporaria: password });
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Criar Usuário Manual</h3>
                  <p className="text-sm text-purple-100">Cadastro com controle de datas de acesso</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-purple-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Alerta de campos obrigatórios */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Atenção:</strong> Os campos Nome, Sobrenome, E-mail e Contato são <strong>obrigatórios</strong>. Role para cima para preenchê-los.
              </div>
            </div>

            {/* Informação */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Importante:</strong> Usuários criados manualmente são controlados por datas. Se o usuário comprar via Hotmart, o sistema automaticamente converterá para controle via webhook.
              </div>
            </div>

            {/* Dados pessoais */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Dados Pessoais
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="João"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sobrenome">Sobrenome *</Label>
                  <Input
                    id="sobrenome"
                    value={formData.sobrenome}
                    onChange={(e) => setFormData({ ...formData, sobrenome: e.target.value })}
                    placeholder="Silva"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-1" />
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="joao@exemplo.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contato">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contato *
                  </Label>
                  <Input
                    id="contato"
                    value={formData.contato}
                    onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha de Acesso
              </h4>

              <div>
                <Label htmlFor="senha_temporaria">Senha Temporária (deixe vazio para gerar automaticamente)</Label>
                <div className="flex gap-2">
                  <Input
                    id="senha_temporaria"
                    type="text"
                    value={formData.senha_temporaria}
                    onChange={(e) => setFormData({ ...formData, senha_temporaria: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <Button type="button" onClick={generatePassword} variant="outline">
                    Gerar
                  </Button>
                </div>
              </div>
            </div>

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
                  />
                </div>
                <div>
                  <Label htmlFor="access_end_date">Data de Término (opcional)</Label>
                  <Input
                    id="access_end_date"
                    type="date"
                    value={formData.access_end_date}
                    onChange={(e) => setFormData({ ...formData, access_end_date: e.target.value })}
                    min={formData.access_start_date}
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
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <Label htmlFor="auto_suspend_on_expire" className="cursor-pointer">
                  Suspender automaticamente após expirar
                </Label>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Observações
              </h4>

              <div>
                <Label htmlFor="manual_notes">Notas (opcional)</Label>
                <Textarea
                  id="manual_notes"
                  value={formData.manual_notes}
                  onChange={(e) => setFormData({ ...formData, manual_notes: e.target.value })}
                  placeholder="Ex: Trial 7 dias, Parceria com empresa X, etc."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="send_welcome_email"
                  checked={formData.send_welcome_email}
                  onChange={(e) => setFormData({ ...formData, send_welcome_email: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <Label htmlFor="send_welcome_email" className="cursor-pointer">
                  Enviar e-mail de boas-vindas com credenciais
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" onClick={onClose} variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Criar Usuário
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
