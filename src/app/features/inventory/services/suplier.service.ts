import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { 
  Suplier, 
  CreateSuplierDTO, 
  UpdateSuplierDTO,
  SuplierResponse 
} from '../models/suplier.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SuplierService {

  constructor(private httpClient: HttpClientService) {}

  /**
   * Listar todos los proveedores activos
   * GET /api/supliers
   */
  getAllSupliers(): Observable<ApiResponse<SuplierResponse[]>> {
    return this.httpClient.get<ApiResponse<SuplierResponse[]>>('/supliers');
  }

  /**
   * Obtener detalle de un proveedor
   * GET /api/supliers/{id}
   */
  getSuplierById(id: string): Observable<ApiResponse<Suplier>> {
    return this.httpClient.get<ApiResponse<Suplier>>(`/supliers/${id}`);
  }

  /**
   * Crear proveedor
   * POST /api/supliers
   */
  createSuplier(suplier: CreateSuplierDTO): Observable<ApiResponse<string>> {
    return this.httpClient.post<ApiResponse<string>>('/supliers', suplier);
  }

  /**
   * Actualizar proveedor
   * PUT /api/supliers/{id}
   */
  updateSuplier(id: string, suplier: UpdateSuplierDTO): Observable<ApiResponse<string>> {
    return this.httpClient.put<ApiResponse<string>>(`/supliers/${id}`, suplier);
  }

  /**
   * Eliminar (desactivar) proveedor
   * DELETE /api/supliers/{id}
   */
  deleteSuplier(id: string): Observable<ApiResponse<string>> {
    return this.httpClient.delete<ApiResponse<string>>(`/supliers/${id}`);
  }
}
