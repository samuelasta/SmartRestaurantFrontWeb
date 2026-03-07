// Respuesta genérica del backend según especificación
export interface ApiResponse<T> {
  message: T;
  error: boolean;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Parámetros de paginación
export interface PaginationParams {
  page: number;
  size?: number;
}
