// src/services/api/ApiService.ts

const API_BASE_URL = '/api'; // Proxied by Vite in development

export class ApiService {
  /**
   * Helper for GET requests
   */
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return this.handleResponse<T>(response);
  }

  /**
   * Helper for POST requests
   */
  static async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Helper for PUT requests
   */
  static async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }
  
  /**
   * Helper for DELETE requests
   */
  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return this.handleResponse<T>(response);
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API Request failed (${response.status}): ${errorText}`);
    }
    return response.json();
  }
}
