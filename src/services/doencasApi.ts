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
  forma_uso?: string[] | string;
}

export const doencasApi = {
  async getAll(searchTerm?: string, categoria?: string, activeOnly: boolean = true): Promise<DoencaGeral[]> {
    let url = `${API_URL}/doencas-geral`;
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
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar doenças');
    }

    return response.json();
  },

  async getById(id: string): Promise<DoencaGeral> {
    const response = await fetch(`${API_URL}/doencas-geral/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar doença');
    }

    return response.json();
  },

  async create(data: CreateDoencaGeralData, token: string): Promise<DoencaGeral> {
    const response = await fetch(`${API_URL}/doencas-geral`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar doença');
    }

    return response.json();
  },

  async update(id: string, data: Partial<CreateDoencaGeralData>, token: string): Promise<DoencaGeral> {
    const response = await fetch(`${API_URL}/doencas-geral/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar doença');
    }

    return response.json();
  },

  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/doencas-geral/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar doença');
    }
  },

  async toggleActivation(id: string, ativo: boolean, data_liberacao?: string, token?: string): Promise<DoencaGeral> {
    const response = await fetch(`${API_URL}/doencas-geral/${id}/toggle-activation`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ativo, data_liberacao }),
    });

    if (!response.ok) {
      throw new Error('Erro ao alterar status da doença');
    }

    return response.json();
  },

  async scheduleRelease(id: string, data_liberacao: string, token: string): Promise<DoencaGeral> {
    const response = await fetch(`${API_URL}/doencas-geral/${id}/schedule-release`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ data_liberacao }),
    });

    if (!response.ok) {
      throw new Error('Erro ao agendar liberação da doença');
    }

    return response.json();
  },
};

