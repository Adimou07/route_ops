// API Service for connecting to AdonisJS backend
const API_BASE_URL = 'http://localhost:3333/api/v1';

// Generic API error handler
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error or server is unreachable');
  }
}

// Projects API
export const projectsApi = {
  getAll: () => fetchApi<any[]>('/projects'),
  
  getById: (id: string | number) => fetchApi<any>(`/projects/${id}`),
  
  create: (data: any) => fetchApi<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Tasks API
export const tasksApi = {
  getAll: () => fetchApi<any[]>('/tasks'),
  
  getByProject: (projectId: string | number) => fetchApi<any[]>(`/projects/${projectId}/tasks`),
  
  create: (data: any) => fetchApi<any>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Customers API
export const customersApi = {
  getAll: () => fetchApi<any[]>('/customers'),
  
  getById: (id: string | number) => fetchApi<any>(`/customers/${id}`),
  
  create: (data: any) => fetchApi<any>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/customers/${id}`, {
    method: 'DELETE',
  }),
};

// Suppliers API
export const suppliersApi = {
  getAll: () => fetchApi<any[]>('/suppliers'),
  
  getById: (id: string | number) => fetchApi<any>(`/suppliers/${id}`),
  
  create: (data: any) => fetchApi<any>('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/suppliers/${id}`, {
    method: 'DELETE',
  }),
};

// Manufacturers API
export const manufacturersApi = {
  getAll: () => fetchApi<any[]>('/manufacturers'),
  
  getById: (id: string | number) => fetchApi<any>(`/manufacturers/${id}`),
  
  create: (data: any) => fetchApi<any>('/manufacturers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/manufacturers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/manufacturers/${id}`, {
    method: 'DELETE',
  }),
};

// RFQs API
export const rfqsApi = {
  getAll: () => fetchApi<any[]>('/rfqs'),
  
  getById: (id: string | number) => fetchApi<any>(`/rfqs/${id}`),
  
  create: (data: any) => fetchApi<any>('/rfqs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/rfqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/rfqs/${id}`, {
    method: 'DELETE',
  }),
};

// Sales Orders API
export const salesOrdersApi = {
  getAll: () => fetchApi<any[]>('/sales-orders'),
  
  getById: (id: string | number) => fetchApi<any>(`/sales-orders/${id}`),
  
  create: (data: any) => fetchApi<any>('/sales-orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/sales-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/sales-orders/${id}`, {
    method: 'DELETE',
  }),
};

// Purchase Orders API
export const purchaseOrdersApi = {
  getAll: () => fetchApi<any[]>('/purchase-orders'),
  
  getById: (id: string | number) => fetchApi<any>(`/purchase-orders/${id}`),
  
  create: (data: any) => fetchApi<any>('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/purchase-orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/purchase-orders/${id}`, {
    method: 'DELETE',
  }),
};

// Invoices API
export const invoicesApi = {
  getAll: () => fetchApi<any[]>('/invoices'),
  
  getById: (id: string | number) => fetchApi<any>(`/invoices/${id}`),
  
  create: (data: any) => fetchApi<any>('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string | number, data: any) => fetchApi<any>(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/invoices/${id}`, {
    method: 'DELETE',
  }),
};

// Documents API
export const documentsApi = {
  getAll: () => fetchApi<any[]>('/documents'),
  
  getById: (id: string | number) => fetchApi<any>(`/documents/${id}`),
  
  getByLinkedEntity: (table: string, id: string | number) => 
    fetchApi<any[]>(`/documents?linked_table=${table}&linked_id=${id}`),
  
  create: (data: any) => fetchApi<any>('/documents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string | number) => fetchApi<void>(`/documents/${id}`, {
    method: 'DELETE',
  }),
};

export { ApiError };
