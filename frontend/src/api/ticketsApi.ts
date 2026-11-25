
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  TicketFilters,
} from '../types/ticket';

const BASE_URL = '/api/tickets';

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    throw new Error(
      'Unable to connect to the server. Please try again later.'
    );
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(
        'The server is currently unavailable. Please try again later.'
      );
    }

    if (response.status === 404) {
      throw new Error('The requested ticket was not found.');
    }

    const body = await response.json().catch(() => null);

    throw new Error(
      body?.detail ??
      body?.title ??
      'Something went wrong. Please try again.'
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const ticketsApi = {
  getAll(
    filters: TicketFilters = {},
    signal?: AbortSignal
  ): Promise<Ticket[]> {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set('status', filters.status);
    }

    if (filters.priority) {
      params.set('priority', filters.priority);
    }

    if (filters.search?.trim()) {
      params.set('search', filters.search.trim());
    }

    const query = params.toString();

    return request<Ticket[]>(
      `${BASE_URL}${query ? `?${query}` : ''}`,
      { signal }
    );
  },

  getById(id: number): Promise<Ticket> {
    return request<Ticket>(`${BASE_URL}/${id}`);
  },

  create(data: CreateTicketRequest): Promise<Ticket> {
    return request<Ticket>(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  updateStatus(
    id: number,
    data: UpdateTicketStatusRequest
  ): Promise<void> {
    return request<void>(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  delete(id: number): Promise<void> {
    return request<void>(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },
};
