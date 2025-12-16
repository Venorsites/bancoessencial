import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Edit,
  Eye,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  description: string | null;
  subject: string;
  html_content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminEmailTemplates() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [editForm, setEditForm] = useState({
    subject: "",
    html_content: "",
    description: "",
  });

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get("/email-templates");
      setTemplates(response.data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar templates",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditForm({
      subject: template.subject,
      html_content: template.html_content,
      description: template.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setEditForm({ subject: "", html_content: "", description: "" });
  };

  const handleSave = async () => {
    if (!editingTemplate) return;

    try {
      await api.patch(`/email-templates/${editingTemplate.id}`, editForm);
      toast({
        title: "Template atualizado com sucesso",
      });
      setEditingTemplate(null);
      setEditForm({ subject: "", html_content: "", description: "" });
      fetchTemplates();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar template",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/email-templates/${id}/toggle-active`);
      toast({
        title: "Status alterado",
      });
      fetchTemplates();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-mails Automáticos</h1>
        <p className="text-gray-600">
          Gerencie os templates de e-mails automáticos do sistema
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {templates.filter((t) => t.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {templates.filter((t) => !t.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum template encontrado</p>
            </CardContent>
          </Card>
        ) : (
          templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={!template.is_active ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        {template.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Chave:</span> {template.template_key}
                      </p>
                      {template.description && (
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Assunto:</span> {template.subject}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(template)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(template.id)}
                      >
                        {template.is_active ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-2" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingTemplate !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Template: {editingTemplate?.name}</DialogTitle>
            <DialogDescription>
              Edite o assunto, conteúdo HTML e descrição do template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Assunto</label>
              <Input
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                placeholder="Assunto do e-mail"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Descrição do template"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Conteúdo HTML</label>
              <Textarea
                value={editForm.html_content}
                onChange={(e) => setEditForm({ ...editForm, html_content: e.target.value })}
                placeholder="Conteúdo HTML do e-mail"
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewTemplate !== null} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
            <DialogDescription>
              Visualização do template de e-mail
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Assunto</label>
              <p className="text-sm text-gray-700">{previewTemplate?.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Conteúdo HTML</label>
              <div
                className="border rounded-lg p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: previewTemplate?.html_content || "" }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
