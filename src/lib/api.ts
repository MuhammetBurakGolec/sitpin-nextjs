const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint: string, options: RequestInit = {}, token?: string) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Bookmarks
  async getBookmarks(
    token?: string,
    params?: { categoryId?: string; search?: string }
  ) {
    const searchParams = new URLSearchParams();
    if (params?.categoryId)
      searchParams.append('categoryId', params.categoryId);
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    return this.request(`/bookmarks${query ? `?${query}` : ''}`, {}, token);
  }

  async createBookmark(
    data: {
      title: string;
      url: string;
      description?: string;
      categoryId?: string;
    },
    token?: string
  ) {
    return this.request(
      '/bookmarks',
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      token
    );
  }

  async updateBookmark(
    id: string,
    data: {
      title: string;
      url: string;
      description?: string;
      categoryId?: string;
    },
    token?: string
  ) {
    return this.request(
      `/bookmarks/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data)
      },
      token
    );
  }

  async deleteBookmark(id: string, token?: string) {
    return this.request(
      `/bookmarks/${id}`,
      {
        method: 'DELETE'
      },
      token
    );
  }

  // Categories
  async getCategories(token?: string) {
    return this.request('/categories', {}, token);
  }

  async createCategory(data: { name: string; color: string }, token?: string) {
    return this.request(
      '/categories',
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      token
    );
  }

  async deleteCategory(id: string, token?: string) {
    return this.request(
      `/categories/${id}`,
      {
        method: 'DELETE'
      },
      token
    );
  }

  // Utils
  async getFavicon(url: string, token?: string) {
    return this.request(
      `/utils/favicon?url=${encodeURIComponent(url)}`,
      {},
      token
    );
  }

  async getMetadata(url: string, token?: string) {
    return this.request(
      `/utils/metadata?url=${encodeURIComponent(url)}`,
      {},
      token
    );
  }
}

export const apiService = new ApiService();
