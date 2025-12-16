import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import {
  Plus, Edit2, Trash2, Tag, DollarSign, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Info
} from "lucide-react";

interface Oferta {
  id: string;
  codigo_oferta: string;
  nome: string;
  valor_referencia_brl: number;
  descricao: string | null;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

interface OfertaFormData {
  codigo_oferta: string;
  nome: string;
  valor_referencia_brl: string;
  descricao: string;
}

export function AdminOfertasCupons() {
  const { token } = useAuth();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
  const [formData, setFormData] = useState<OfertaFormData>({
    codigo_oferta: '',
    nome: '',
    valor_referencia_brl: '',
    descricao: '',
  });
  const [stats, setStats] = useState({ total: 0, ativas: 0, inativas: 0 });

  useEffect(() => {
    loadOfertas();
    loadStats();
  }, [token]);

  const loadOfertas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ofertas`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar ofertas');

      const data = await response.json();
      setOfertas(data.data || []);
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error);
      toast.error('Erro ao carregar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/ofertas/stats`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar estatísticas');

      const data = await response.json();
      setStats(data.data || { total: 0, ativas: 0, inativas: 0 });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        valor_referencia_brl: parseFloat(formData.valor_referencia_brl),
      };

      const response = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar oferta');
      }

      toast.success('Oferta criada com sucesso!');
      setShowCreateModal(false);
      resetForm();
      loadOfertas();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao criar oferta:', error);
      toast.error(error.message || 'Erro ao criar oferta');
    }
  };

  const handleEdit = async () => {
    if (!selectedOferta) return;

    try {
      const payload: any = {
        nome: formData.nome,
        valor_referencia_brl: parseFloat(formData.valor_referencia_brl),
      };

      if (formData.descricao) {
        payload.descricao = formData.descricao;
      }

      const response = await fetch(`${API_URL}/ofertas/${selectedOferta.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar oferta');
      }

      toast.success('Oferta atualizada com sucesso!');
      setShowEditModal(false);
      setSelectedOferta(null);
      resetForm();
      loadOfertas();
    } catch (error: any) {
      console.error('Erro ao atualizar oferta:', error);
      toast.error(error.message || 'Erro ao atualizar oferta');
    }
  };

  const handleToggleAtiva = async (oferta: Oferta) => {
    try {
      const response = await fetch(`${API_URL}/ofertas/${oferta.id}/toggle`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao alternar status');
      }

      toast.success(`Oferta ${oferta.ativa ? 'desativada' : 'ativada'} com sucesso!`);
      loadOfertas();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao alternar status:', error);
      toast.error(error.message || 'Erro ao alternar status');
    }
  };

  const handleDelete = async () => {
    if (!selectedOferta) return;

    try {
      const response = await fetch(`${API_URL}/ofertas/${selectedOferta.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir oferta');
      }

      toast.success('Oferta excluída com sucesso!');
      setShowDeleteDialog(false);
      setSelectedOferta(null);
      loadOfertas();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao excluir oferta:', error);
      toast.error(error.message || 'Erro ao excluir oferta');
    }
  };

  const openEditModal = (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setFormData({
      codigo_oferta: oferta.codigo_oferta,
      nome: oferta.nome,
      valor_referencia_brl: oferta.valor_referencia_brl.toString(),
      descricao: oferta.descricao || '',
    });
    setShowEditModal(true);
  };

  const openDeleteDialog = (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      codigo_oferta: '',
      nome: '',
      valor_referencia_brl: '',
      descricao: '',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ofertas</h1>
          <p className="text-gray-600">Cadastre ofertas para conversão aproximada de moedas</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="w-full sm:w-auto bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Oferta
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Como funciona a conversão:</p>
              <ul className="space-y-1 text-blue-800">
                <li>• Cadastre o código da oferta (igual ao da Hotmart) e o valor em BRL</li>
                <li>• Quando chegar um webhook em moeda estrangeira, o sistema busca a oferta</li>
                <li>• Aplica a proporção do valor pago para incluir descontos automáticos</li>
                <li>• Gera uma estimativa em BRL para visualização consolidada</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Ofertas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Tag className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ofertas Ativas</p>
                <p className="text-3xl font-bold text-green-600">{stats.ativas}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ofertas Inativas</p>
                <p className="text-3xl font-bold text-gray-600">{stats.inativas}</p>
              </div>
              <XCircle className="w-10 h-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ofertas List */}
      <Card>
        <CardHeader>
          <CardTitle>Ofertas Cadastradas</CardTitle>
          <CardDescription>
            Gerencie as ofertas para conversão aproximada de valores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ofertas.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Nenhuma oferta cadastrada ainda</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeira Oferta
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {ofertas.map((oferta) => (
                <div
                  key={oferta.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="font-mono text-xs">{oferta.codigo_oferta}</Badge>
                      <Badge variant={oferta.ativa ? 'default' : 'secondary'} className={oferta.ativa ? 'bg-green-600 text-white' : ''}>
                        {oferta.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{oferta.nome}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(oferta.valor_referencia_brl)}
                      </span>
                    </div>
                    {oferta.descricao && (
                      <p className="text-sm text-gray-600 mt-2">{oferta.descricao}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAtiva(oferta)}
                      className="flex-1 sm:flex-initial"
                    >
                      {oferta.ativa ? <XCircle className="w-4 h-4 sm:mr-2" /> : <CheckCircle className="w-4 h-4 sm:mr-2" />}
                      <span className="hidden sm:inline">{oferta.ativa ? 'Desativar' : 'Ativar'}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(oferta)}
                      className="flex-1 sm:flex-initial"
                    >
                      <Edit2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(oferta)}
                      className="flex-1 sm:flex-initial"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Excluir</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Oferta</DialogTitle>
            <DialogDescription>
              Cadastre uma oferta para conversão aproximada de moedas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="codigo_oferta">Código da Oferta *</Label>
              <Input
                id="codigo_oferta"
                placeholder="Ex: abc123 (igual ao da Hotmart)"
                value={formData.codigo_oferta}
                onChange={(e) => setFormData({ ...formData, codigo_oferta: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use o mesmo código da oferta configurada na Hotmart
              </p>
            </div>

            <div>
              <Label htmlFor="nome">Nome da Oferta *</Label>
              <Input
                id="nome"
                placeholder="Ex: Plano Premium Anual"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="valor_referencia_brl">Valor de Referência (BRL) *</Label>
              <Input
                id="valor_referencia_brl"
                type="number"
                step="0.01"
                placeholder="Ex: 497.00"
                value={formData.valor_referencia_brl}
                onChange={(e) => setFormData({ ...formData, valor_referencia_brl: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Valor em reais que esta oferta representa
              </p>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Input
                id="descricao"
                placeholder="Descrição da oferta"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!formData.codigo_oferta || !formData.nome || !formData.valor_referencia_brl}
            >
              Criar Oferta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Oferta</DialogTitle>
            <DialogDescription>
              Atualize as informações da oferta
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Código da Oferta</Label>
              <Input
                value={formData.codigo_oferta}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                O código não pode ser alterado
              </p>
            </div>

            <div>
              <Label htmlFor="edit_nome">Nome da Oferta *</Label>
              <Input
                id="edit_nome"
                placeholder="Ex: Plano Premium Anual"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit_valor_referencia_brl">Valor de Referência (BRL) *</Label>
              <Input
                id="edit_valor_referencia_brl"
                type="number"
                step="0.01"
                placeholder="Ex: 497.00"
                value={formData.valor_referencia_brl}
                onChange={(e) => setFormData({ ...formData, valor_referencia_brl: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit_descricao">Descrição (opcional)</Label>
              <Input
                id="edit_descricao"
                placeholder="Descrição da oferta"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); setSelectedOferta(null); resetForm(); }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={!formData.nome || !formData.valor_referencia_brl}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir a oferta{" "}
              <span className="font-semibold">{selectedOferta?.nome}</span> (
              <span className="font-mono">{selectedOferta?.codigo_oferta}</span>)?
              <br /><br />
              <strong className="text-red-600">Esta ação não pode ser desfeita.</strong>
              <br />
              Webhooks futuros com esta oferta não terão conversão aproximada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedOferta(null); }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

