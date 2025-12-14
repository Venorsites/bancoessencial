import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, TrendingUp, TrendingDown, 
  Users, CreditCard, Package, Tag, RefreshCw, Calendar, AlertTriangle, Banknote
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

interface MoedaData {
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
  total_consolidado_brl?: number;
  liquido_consolidado_brl?: number;
  comissoes_consolidado_brl?: number;
  devolvido_consolidado_brl?: number;
  vendas_por_plano_consolidado?: { plano: string; valor: number; quantidade: number }[];
  vendas_por_oferta_consolidado?: { codigo: string; valor: number; quantidade: number }[];
  detalhes_consolidacao?: Array<{
    moeda: string;
    quantidade: number;
    valor_original: number;
    valor_brl: number;
  }>;
  por_moeda?: Record<string, MoedaData>;
  vendas_por_plano: { plano: string; valor: number; quantidade: number }[];
  vendas_por_oferta: { codigo: string; valor: number; quantidade: number }[];
  formas_pagamento: { tipo: string; quantidade: number }[];
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export function AdminFinanceiro() {
  const { token } = useAuth();
  const [periodo, setPeriodo] = useState('mes');
  const [moedaSelecionada, setMoedaSelecionada] = useState<string>('all');
  const [moedasDisponiveis, setMoedasDisponiveis] = useState<string[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoedasDisponiveis();
  }, [periodo, token]);

  useEffect(() => {
    loadDashboard();
  }, [periodo, moedaSelecionada, token]);

  const loadMoedasDisponiveis = async () => {
    try {
      const response = await fetch(`${API_URL}/financeiro/moedas-disponiveis?periodo=${periodo}`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const moedas = await response.json();
        setMoedasDisponiveis(moedas);
        
        // Se a moeda selecionada não estiver mais disponível, resetar para 'all'
        if (moedaSelecionada !== 'all' && !moedas.includes(moedaSelecionada)) {
          setMoedaSelecionada('all');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar moedas disponíveis:', error);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const url = moedaSelecionada === 'all' 
        ? `${API_URL}/financeiro/dashboard?periodo=${periodo}`
        : `${API_URL}/financeiro/dashboard?periodo=${periodo}&moeda=${moedaSelecionada}`;
      
      const response = await fetch(url, {
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

  const formatCurrency = (value: number | null | undefined, currency: string = 'BRL') => {
    // Garantir que é um número válido
    const numValue = Number(value);
    if (isNaN(numValue) || !isFinite(numValue)) {
      return formatCurrencyByCode(0, currency);
    }
    return formatCurrencyByCode(numValue, currency);
  };

  const formatCurrencyByCode = (value: number, currency: string) => {
    // Mapear códigos de moeda para locales apropriados
    const currencyMap: Record<string, { locale: string; currency: string }> = {
      'BRL': { locale: 'pt-BR', currency: 'BRL' },
      'USD': { locale: 'en-US', currency: 'USD' },
      'EUR': { locale: 'de-DE', currency: 'EUR' },
      'GBP': { locale: 'en-GB', currency: 'GBP' },
      'JPY': { locale: 'ja-JP', currency: 'JPY' },
      'CAD': { locale: 'en-CA', currency: 'CAD' },
      'AUD': { locale: 'en-AU', currency: 'AUD' },
    };

    const config = currencyMap[currency] || { locale: 'pt-BR', currency: currency || 'BRL' };

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
    }).format(value);
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'BRL': 'R$',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
    };
    return symbols[currency] || currency;
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

  // Determinar qual moeda mostrar
  const moedas = dashboard.por_moeda ? Object.keys(dashboard.por_moeda) : [];
  const mostrarTodasMoedas = moedaSelecionada === 'all' && moedas.length > 1;
  const moedaAtual = moedaSelecionada === 'all' 
    ? (moedas[0] || 'BRL')
    : (moedaSelecionada || moedas[0] || 'BRL');
  const dadosMoedaAtual = dashboard.por_moeda?.[moedaAtual];

  // Criar stats para a moeda selecionada
  const stats = dadosMoedaAtual ? [
    {
      title: `Total Faturado (${moedaAtual})`,
      value: formatCurrency(dadosMoedaAtual.total_vendas, moedaAtual),
      subtitle: `${dadosMoedaAtual.quantidade_vendas} vendas`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: `Total Líquido (${moedaAtual})`,
      value: formatCurrency(dadosMoedaAtual.total_liquido, moedaAtual),
      subtitle: "Após comissões",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: `Comissões Pagas (${moedaAtual})`,
      value: formatCurrency(dadosMoedaAtual.total_comissoes, moedaAtual),
      subtitle: "Afiliados e produtores",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: `Reembolsos (${moedaAtual})`,
      value: formatCurrency(dadosMoedaAtual.total_devolvido, moedaAtual),
      subtitle: `${dadosMoedaAtual.quantidade_devolucoes} reembolsos`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-gray-600">Dashboard de vendas e faturamento</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <Select value={moedaSelecionada} onValueChange={setMoedaSelecionada}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <DollarSign className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Selecione a moeda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Moedas</SelectItem>
              {moedasDisponiveis.map((moeda) => (
                <SelectItem key={moeda} value={moeda}>
                  {moeda} - {getCurrencySymbol(moeda)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

      {/* Card de Visão Consolidada (apenas quando "Todas as Moedas") */}
      {moedaSelecionada === 'all' && dashboard.total_consolidado_brl !== undefined && (
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Banknote className="w-6 h-6 text-purple-600" />
              Visão Consolidada (BRL Aproximado)
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Valores convertidos usando ofertas cadastradas. Esta é uma{" "}
              <span className="font-semibold text-gray-700">estimativa para referência</span> e não representa valores contábeis oficiais.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Total Faturado</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  ≈ {formatCurrency(dashboard.total_consolidado_brl || 0, 'BRL')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {dashboard.quantidade_vendas} vendas
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-blue-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Total Líquido</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  ≈ {formatCurrency(dashboard.liquido_consolidado_brl || 0, 'BRL')}
                </p>
                <p className="text-xs text-gray-500 mt-2">Após comissões</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-purple-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Comissões Pagas</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  ≈ {formatCurrency(dashboard.comissoes_consolidado_brl || 0, 'BRL')}
                </p>
                <p className="text-xs text-gray-500 mt-2">Afiliados + Produtores</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Reembolsos</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">
                  ≈ {formatCurrency(dashboard.devolvido_consolidado_brl || 0, 'BRL')}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {dashboard.quantidade_devolucoes} reembolsos
                </p>
              </div>
            </div>

            {/* Composição por moeda */}
            {moedas.length > 1 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Composição por Moeda
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {moedas.map((moeda) => {
                    const dados = dashboard.por_moeda![moeda];
                    return (
                      <div key={moeda} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600">{moeda}</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(dados.total_vendas, moeda)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {dados.quantidade_vendas}x
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Cards de Estatísticas - Removido quando "Todas as Moedas" está selecionado */}
      {!mostrarTodasMoedas && stats.length > 0 && (
        // Exibir cards da moeda selecionada
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
      )}
      
      {/* Gráficos e Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Plano */}
        {mostrarTodasMoedas ? (
          // Exibir vendas por plano consolidadas (soma de todas as moedas) quando "Todas as Moedas" está selecionado
          dashboard.vendas_por_plano_consolidado && dashboard.vendas_por_plano_consolidado.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Vendas por Plano (Consolidado)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.vendas_por_plano_consolidado.map((plano, index) => {
                    const totalVendas = Number(dashboard.total_consolidado_brl) || 0;
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
                          <span className="text-gray-600 font-semibold">{formatCurrency(plano.valor, 'BRL')}</span>
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
          ) : null
        ) : dadosMoedaAtual?.vendas_por_plano && dadosMoedaAtual.vendas_por_plano.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Vendas por Plano ({moedaAtual})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosMoedaAtual.vendas_por_plano.map((plano: any, index: number) => {
                  const totalVendas = Number(dadosMoedaAtual.total_vendas) || 0;
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
                        <span className="text-gray-600 font-semibold">{formatCurrency(plano.valor, moedaAtual)}</span>
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
        ) : null}
        
        {/* Vendas por Oferta */}
        {mostrarTodasMoedas ? (
          // Exibir vendas por oferta consolidadas (soma de todas as moedas) quando "Todas as Moedas" está selecionado
          dashboard.vendas_por_oferta_consolidado && dashboard.vendas_por_oferta_consolidado.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  Vendas por Oferta (Consolidado)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.vendas_por_oferta_consolidado.map((oferta: any, index: number) => (
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
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(oferta.valor, 'BRL')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null
        ) : dadosMoedaAtual?.vendas_por_oferta && dadosMoedaAtual.vendas_por_oferta.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Vendas por Oferta ({moedaAtual})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosMoedaAtual.vendas_por_oferta.map((oferta: any, index: number) => (
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
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(oferta.valor, moedaAtual)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
        
        {/* Formas de Pagamento - Mostrar consolidado quando "Todas as Moedas" */}
        {mostrarTodasMoedas ? (
          // Exibir formas de pagamento consolidadas (soma de todas as moedas) quando "Todas as Moedas" está selecionado
          dashboard.formas_pagamento && dashboard.formas_pagamento.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Formas de Pagamento (Consolidado)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.formas_pagamento.map((forma: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">{formatPaymentType(forma.tipo)}</span>
                      </div>
                      <Badge variant="secondary" className="text-white bg-purple-600">
                        {forma.quantidade} vendas
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null
        ) : dadosMoedaAtual?.formas_pagamento && dadosMoedaAtual.formas_pagamento.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Formas de Pagamento ({moedaAtual})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosMoedaAtual.formas_pagamento.map((forma: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{formatPaymentType(forma.tipo)}</span>
                    </div>
                    <Badge variant="secondary" className="text-white bg-purple-600">
                      {forma.quantidade} vendas
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

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
                      {(() => {
                        if (mostrarTodasMoedas) {
                          // Usar valores consolidados quando "Todas as Moedas" está selecionado
                          const qtd = dashboard.quantidade_vendas ?? 0;
                          const total = dashboard.total_consolidado_brl ?? 0;
                          return qtd > 0 && total > 0
                            ? formatCurrency(Number(total) / Number(qtd), 'BRL')
                            : formatCurrency(0, 'BRL');
                        } else {
                          // Usar valores da moeda selecionada
                          const qtd = dadosMoedaAtual?.quantidade_vendas ?? 0;
                          const total = dadosMoedaAtual?.total_vendas ?? 0;
                          return qtd > 0 && total > 0
                            ? formatCurrency(Number(total) / Number(qtd), moedaAtual)
                            : formatCurrency(0, moedaAtual);
                        }
                      })()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600">Margem Líquida</p>
                    <p className="text-lg font-semibold text-green-600">
                      {(() => {
                        if (mostrarTodasMoedas) {
                          // Usar valores consolidados quando "Todas as Moedas" está selecionado
                          const totalVendas = dashboard.total_consolidado_brl ?? 0;
                          const totalLiquido = dashboard.liquido_consolidado_brl ?? 0;
                          return totalVendas > 0 && totalLiquido !== null && totalLiquido !== undefined
                            ? `${((Number(totalLiquido) / Number(totalVendas)) * 100).toFixed(1)}%`
                            : '0%';
                        } else {
                          // Usar valores da moeda selecionada
                          const totalVendas = dadosMoedaAtual?.total_vendas ?? 0;
                          const totalLiquido = dadosMoedaAtual?.total_liquido ?? 0;
                          return totalVendas > 0 && totalLiquido !== null && totalLiquido !== undefined
                            ? `${((Number(totalLiquido) / Number(totalVendas)) * 100).toFixed(1)}%`
                            : '0%';
                        }
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {((mostrarTodasMoedas ? dashboard.quantidade_devolucoes : dadosMoedaAtual?.quantidade_devolucoes) ?? 0) > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600">Taxa de Reembolso</p>
                  <p className="text-lg font-semibold text-red-600">
                    {(() => {
                      if (mostrarTodasMoedas) {
                        // Usar valores consolidados quando "Todas as Moedas" está selecionado
                        const qtdVendas = dashboard.quantidade_vendas ?? 0;
                        const qtdDevolucoes = dashboard.quantidade_devolucoes ?? 0;
                        const total = qtdVendas + qtdDevolucoes;
                        if (total > 0) {
                          const taxa = (qtdDevolucoes / total) * 100;
                          return isNaN(taxa) ? '0%' : taxa.toFixed(1) + '%';
                        }
                        return '0%';
                      } else {
                        // Usar valores da moeda selecionada
                        const qtdVendas = dadosMoedaAtual?.quantidade_vendas ?? 0;
                        const qtdDevolucoes = dadosMoedaAtual?.quantidade_devolucoes ?? 0;
                        const total = qtdVendas + qtdDevolucoes;
                        if (total > 0) {
                          const taxa = (qtdDevolucoes / total) * 100;
                          return isNaN(taxa) ? '0%' : taxa.toFixed(1) + '%';
                        }
                        return '0%';
                      }
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

