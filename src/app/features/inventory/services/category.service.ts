import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { 
  Category, 
  CreateCategoryDTO, 
  UpdateCategoryDTO,
  CategoryResponse 
} from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClientService) {}

  /**
   * Listar todas las categorías activas
   * GET /api/categories
   */
  getAllCategories(): Observable<ApiResponse<CategoryResponse[]>> {
    return this.httpClient.get<ApiResponse<CategoryResponse[]>>('/categories');
  }

  /**
   * Obtener detalle de una categoría
   * GET /api/categories/{id}
   */
  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    return this.httpClient.get<ApiResponse<Category>>(`/categories/${id}`);
  }

  /**
   * Crear categoría
   * POST /api/categories
   */
  createCategory(category: CreateCategoryDTO): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>('/categories', category);
  }

  /**
   * Actualizar categoría
   * PUT /api/categories/{id}
   */
  updateCategory(id: string, category: UpdateCategoryDTO): Observable<ApiResponse<string>> {
    return this.httpClient.put<ApiResponse<string>>(`/categories/${id}`, category);
  }

  /**
   * Eliminar (desactivar) categoría
   * DELETE /api/categories/{id}
   */
  deleteCategory(id: string): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`/categories/${id}`);
  }
}
