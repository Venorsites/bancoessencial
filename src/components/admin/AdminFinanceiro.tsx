import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, TrendingUp, TrendingDown, 
  Users, CreditCard, Package, Tag, RefreshCw, Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/config/api";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  periodo: string;
  data_inicio: string;
  data_fim: string;
  total_vendas: number;
  total_liquido: number;
  total_comissoes: number;
  total_devolvido: number;
  quantidade_vendas: number;
  quantidade_devolucoes: number;
  vendas_por_plano: { plano: string; valor: number; quantidade: number }[];
  vendas_por_oferta: { codigo: string; valor: number; quantidade: number }[];
  formas_pagamento: { tipo: string; quantidade: number }[];
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export function AdminFinanceiro() {
  const { token } = useAuth();
  const [periodo, setPeriodo] = useState('mes');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [periodo, token]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/financeiro/dashboard?periodo=${periodo}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dashboard financeiro');
      }

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    // Garantir que é um número válido
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  const formatPaymentType = (type: string) => {
    const types: Record<string, string> = {
      'CREDIT_CARD': 'Cartão de Crédito',
      'DEBIT_CARD': 'Cartão de Débito',
      'BOLETO': 'Boleto',
      'PIX': 'PIX',
      'PAYPAL': 'PayPal',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhum dado disponível</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Faturado",
      value: formatCurrency(dashboard.total_vendas),
      subtitle: `${dashboard.quantidade_vendas} vendas`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Líquido",
      value: formatCurrency(dashboard.total_liquido),
      subtitle: "Após comissões",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Comissões Pagas",
      value: formatCurrency(dashboard.total_comissoes),
      subtitle: "Afiliados e produtores",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Devoluções",
      value: formatCurrency(dashboard.total_devolvido),
      subtitle: `${dashboard.quantidade_devolucoes} devoluções`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-gray-600">Dashboard de vendas e faturamento</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Hoje</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
              <SelectItem value="total">Desde o Início</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Gráficos e Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Plano */}
        {dashboard.vendas_por_plano && dashboard.vendas_por_plano.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Vendas por Plano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.vendas_por_plano.map((plano, index) => {
                  const totalVendas = Number(dashboard.total_vendas) || 0;
                  const valorPlano = Number(plano.valor) || 0;
                  const percentage = totalVendas > 0 ? (valorPlano / totalVendas) * 100 : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-gray-700">{plano.plano}</span>
                          {plano.quantidade > 0 && (
                            <span className="text-xs text-gray-500 ml-2">({plano.quantidade} vendas)</span>
                          )}
                        </div>
                        <span className="text-gray-600 font-semibold">{formatCurrency(plano.valor)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {isNaN(percentage) ? '0%' : percentage.toFixed(1)}% do total
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Vendas por Oferta */}
        {dashboard.vendas_por_oferta && dashboard.vendas_por_oferta.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Vendas por Oferta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.vendas_por_oferta.map((oferta, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{oferta.codigo}</span>
                        {oferta.quantidade > 0 && (
                          <span className="text-xs text-gray-500 ml-2">({oferta.quantidade} vendas)</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(oferta.valor)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Formas de Pagamento */}
        {dashboard.formas_pagamento && dashboard.formas_pagamento.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Formas de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.formas_pagamento.map((forma, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{formatPaymentType(forma.tipo)}</span>
                    </div>
                    <Badge variant="secondary">{forma.quantidade} vendas</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumo do Período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Resumo do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{dashboard.periodo}</p>
                <p className="text-xs text-gray-500">
                  {new Date(dashboard.data_inicio).toLocaleDateString('pt-BR')} - {new Date(dashboard.data_fim).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Ticket Médio</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {dashboard.quantidade_vendas > 0 && dashboard.total_vendas > 0
                        ? formatCurrency(Number(dashboard.total_vendas) / Number(dashboard.quantidade_vendas))
                        : formatCurrency(0)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600">Margem Líquida</p>
                    <p className="text-lg font-semibold text-green-600">
                      {dashboard.total_vendas > 0 && dashboard.total_liquido !== null && dashboard.total_liquido !== undefined
                        ? `${((Number(dashboard.total_liquido) / Number(dashboard.total_vendas)) * 100).toFixed(1)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
              </div>

              {dashboard.quantidade_devolucoes > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600">Taxa de Devolução</p>
                  <p className="text-lg font-semibold text-red-600">
                    {(() => {
                      const total = Number(dashboard.quantidade_vendas) + Number(dashboard.quantidade_devolucoes);
                      if (total > 0) {
                        const taxa = (Number(dashboard.quantidade_devolucoes) / total) * 100;
                        return isNaN(taxa) ? '0%' : taxa.toFixed(1) + '%';
                      }
                      return '0%';
                    })()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

