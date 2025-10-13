import { API_URL } from '@/config/api';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  async changePassword(userId: string, data: ChangePasswordData, token: string) {
    const response = await fetch(`${API_URL}/users/${userId}/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao alterar senha');
    }

    return response.json();
  },
};
