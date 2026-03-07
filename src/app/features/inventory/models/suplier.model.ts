// Modelo de Proveedor según especificación del backend
export interface Suplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  state: 'ACTIVE' | 'INACTIVE';
}

// DTO para crear proveedor
export interface CreateSuplierDTO {
  name: string;
  address: string;
  phone: string;
  email: string;
}

// DTO para actualizar proveedor
export interface UpdateSuplierDTO {
  name: string;
  address: string;
  phone: string;
  email: string;
}

// Respuesta de proveedor
export interface SuplierResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}
