import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UploadImageResponse {
  success: boolean;
  url: string;
  message: string;
}

export interface UploadImagesResponse {
  success: boolean;
  urls: string[];
  count: number;
  message: string;
}

/**
 * Faz upload de uma única imagem
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post<UploadImageResponse>(
      `${API_URL}/upload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Para enviar cookies de autenticação
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao fazer upload');
    }

    return response.data.url;
  } catch (error: any) {
    // Melhorar tratamento de erros
    if (error.response) {
      // Erro do servidor
      const message = error.response.data?.message || error.response.data?.error || 'Erro ao fazer upload';
      throw new Error(message);
    } else if (error.request) {
      // Erro de rede
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    } else {
      // Outro erro
      throw new Error(error.message || 'Erro desconhecido ao fazer upload');
    }
  }
}

/**
 * Faz upload de múltiplas imagens
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axios.post<UploadImagesResponse>(
    `${API_URL}/upload/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao fazer upload');
  }

  return response.data.urls;
}

