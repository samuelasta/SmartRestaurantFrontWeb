import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { 
  Product, 
  CreateProductDTO, 
  UpdateProductDTO, 
  ProductListResponse,
  StockMovementDTO 
} from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClientService) {}

  /**
   * Listar productos paginados
   * GET /api/products/{page}/page
   */
  getProducts(page: number = 0): Observable<ApiResponse<ProductListResponse[]>> {
    return this.httpClient.get<ApiResponse<ProductListResponse[]>>(`/products/${page}/page`);
  }

  /**
   * Obtener detalle de un producto
   * GET /api/products/{id}
   */
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.httpClient.get<ApiResponse<Product>>(`/products/${id}`);
  }

  /**
   * Crear producto asociado a proveedor
   * POST /api/products/{idSuplier}/supliers
   */
  createProduct(suplierId: string, product: CreateProductDTO): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>(`/products/${suplierId}/supliers`, product);
  }

  /**
   * Actualizar producto
   * PUT /api/products/{id}
   */
  updateProduct(id: string, product: UpdateProductDTO): Observable<ApiResponse<string>> {
    return this.httpClient.put<ApiResponse<string>>(`/products/${id}`, product);
  }

  /**
   * Eliminar (desactivar) producto
   * DELETE /api/products/{id}
   */
  deleteProduct(id: string): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`/products/${id}`);
  }

  /**
   * Añadir stock al producto
   * PATCH /api/products/{id}/add
   */
  addStock(id: string, movement: StockMovementDTO): Observable<ApiResponse<string>> {
    return this.httpClient.patch<ApiResponse<string>>(`/products/${id}/add`, movement);
  }

  /**
   * Descontar stock del producto
   * PATCH /api/products/{id}/discount
   */
  discountStock(id: string, movement: StockMovementDTO): Observable<ApiResponse<string>> {
    return this.httpClient.patch<ApiResponse<string>>(`/products/${id}/discount`, movement);
  }
}
