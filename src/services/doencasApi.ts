import { API_URL } from '@/config/api';

export interface DoencaGeral {
  id: string;
  nome: string;
  categoria: string;
  descricao_short: string;
  oleos_recomendados: string[];
  sintomas_comuns: string[];
  forma_uso?: string;
  ativo: boolean;
  data_liberacao?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDoencaGeralData {
  nome: string;
  categoria: string;
  descricao_short: string;
  oleos_recomendados?: string[];
  sintomas_comuns?: string[];
  forma_uso?: string;
}

function createDoencasApi(endpoint: string) {
  return {
  async getAll(searchTerm?: string, categoria?: string, activeOnly: boolean = true): Promise<DoencaGeral[]> {
      let url = `${API_URL}/${endpoint}`;
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    if (categoria) {
      params.append('categoria', categoria);
    }
    if (activeOnly) {
      params.append('active', 'true');
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar doenças');
    }

    return response.json();
  },

  async getById(id: string): Promise<DoencaGeral> {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar doença');
    }

    return response.json();
  },

    async create(data: CreateDoencaGeralData, token?: string): Promise<DoencaGeral> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Só adiciona Authorization se token for válido e não for 'cookie'
      if (token && token !== 'cookie') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Fazendo POST para:', `${API_URL}/${endpoint}`);
      console.log('Headers:', headers);
      console.log('Credentials: include');
      
      const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include', // IMPORTANTE: Enviar cookies
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || `Erro ao criar doença (${response.status})`;
      console.error('Erro ao criar doença:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(errorMessage);
    }

    return response.json();
  },

  async update(id: string, data: Partial<CreateDoencaGeralData>, token?: string): Promise<DoencaGeral> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Só adiciona Authorization se token for válido e não for 'cookie'
      if (token && token !== 'cookie') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || 'Erro ao atualizar doença';
      console.error('Erro ao atualizar doença:', errorData);
      throw new Error(errorMessage);
    }

    return response.json();
  },

    async delete(id: string, token?: string): Promise<void> {
      const headers: HeadersInit = {};
      
      // Só adiciona Authorization se token for válido e não for 'cookie'
      if (token && token !== 'cookie') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.error || 'Erro ao deletar doença';
        throw new Error(errorMessage);
    }
  },

  async toggleActivation(id: string, ativo: boolean, data_liberacao?: string, token?: string): Promise<DoencaGeral> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Só adiciona Authorization se token for válido e não for 'cookie'
      if (token && token !== 'cookie') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/${endpoint}/${id}/toggle-activation`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ ativo, data_liberacao }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || 'Erro ao alterar status da doença';
      throw new Error(errorMessage);
    }

    return response.json();
  },

    async scheduleRelease(id: string, data_liberacao: string, token?: string): Promise<DoencaGeral> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Só adiciona Authorization se token for válido e não for 'cookie'
      if (token && token !== 'cookie') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/${endpoint}/${id}/schedule-release`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({ data_liberacao }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || 'Erro ao agendar liberação da doença';
      throw new Error(errorMessage);
    }

    return response.json();
  },
};
}

export const doencasApi = createDoencasApi('doencas-geral');
export const doencasGestacaoApi = createDoencasApi('doencas-gestacao');
export const doencasMenopausaApi = createDoencasApi('doencas-menopausa');
export const doencasPediatricaApi = createDoencasApi('doencas-pediatrica');

