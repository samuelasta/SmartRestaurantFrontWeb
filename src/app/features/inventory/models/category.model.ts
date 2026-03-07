// Modelo de Categoría según especificación del backend
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  state: 'ACTIVE' | 'INACTIVE';
}

// DTO para crear categoría
export interface CreateCategoryDTO {
  name: string;
  description: string;
}

// DTO para actualizar categoría
export interface UpdateCategoryDTO {
  name: string;
  description: string;
}

// Respuesta de categoría
export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
}
