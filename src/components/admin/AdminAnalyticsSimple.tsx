import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function AdminAnalyticsSimple() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!token) {
          throw new Error('Token não encontrado');
        }

        console.log('Fazendo requisição para analytics...');
        const response = await fetch('http://localhost:3000/analytics/overview', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Resposta recebida:', response.status);

        if (!response.ok) {
          throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Dados recebidos:', result);
        setData(result);
      } catch (err: any) {
        console.error('Erro ao buscar dados:', err);
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="p-4">
        <p>Carregando dados de analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Dados de Analytics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded">
          <p className="font-semibold">Total de Usuários</p>
          <p className="text-2xl">{data.totalUsers}</p>
        </div>
        <div className="p-3 bg-green-50 rounded">
          <p className="font-semibold">Total de Óleos</p>
          <p className="text-2xl">{data.totalOils}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded">
          <p className="font-semibold">Total de Compras</p>
          <p className="text-2xl">{data.totalPurchases}</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded">
          <p className="font-semibold">Receita Total</p>
          <p className="text-2xl">R$ {data.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}

