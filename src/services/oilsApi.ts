import { API_URL } from '@/config/api';

export interface Oil {
  id: string;
  avatar?: string;
  nome: string;
  nome_cientifico: string;
  descricao: string;
  familia_botanica: string;
  forma_extracao: string;
  aroma: string;
  parte_planta: string;
  familia_quimica: string;
  composto_quimico?: string;
  categoria_aromatica?: string;
  psicoaromas?: string;
  estetica?: string;
  saude_fisica?: string;
  espirituais?: string;
  ambientais?: string;
  contraindicacao?: string;
  contraindicacoes_preocupacoes?: string;
  composicao_quimica_majoritaria?: string;
  substitutos?: string;
  combinacoes?: string;
  galeria_fotos?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOilData {
  avatar?: string;
  nome: string;
  nome_cientifico: string;
  descricao: string;
  familia_botanica: string;
  forma_extracao: string;
  aroma: string;
  parte_planta: string;
  familia_quimica: string;
  composto_quimico?: string;
  categoria_aromatica?: string;
  psicoaromas?: string;
  estetica?: string;
  saude_fisica?: string;
  espirituais?: string;
  ambientais?: string;
  contraindicacao?: string;
  contraindicacoes_preocupacoes?: string;
  composicao_quimica_majoritaria?: string;
  substitutos?: string;
  combinacoes?: string;
  galeria_fotos?: string;
}

export const oilsApi = {
  async getAll(searchTerm?: string): Promise<Oil[]> {
    const url = searchTerm
      ? `${API_URL}/oils?search=${encodeURIComponent(searchTerm)}`
      : `${API_URL}/oils`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar óleos');
    }

    return response.json();
  },

  async getById(id: string): Promise<Oil> {
    const response = await fetch(`${API_URL}/oils/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar óleo');
    }

    return response.json();
  },

  async create(data: CreateOilData, token: string): Promise<Oil> {
    const response = await fetch(`${API_URL}/oils`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar óleo');
    }

    return response.json();
  },

  async update(id: string, data: Partial<CreateOilData>, token: string): Promise<Oil> {
    const response = await fetch(`${API_URL}/oils/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar óleo');
    }

    return response.json();
  },

  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/oils/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar óleo');
    }
  },
};

