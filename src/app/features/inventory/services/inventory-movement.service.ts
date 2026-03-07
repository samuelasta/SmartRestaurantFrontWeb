import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { InventoryMovementResponse } from '../models/inventory-movement.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryMovementService {

  constructor(private httpClient: HttpClientService) {}

  /**
   * Listar todos los movimientos de inventario
   * GET /api/inventory/all
   */
  getAllMovements(): Observable<ApiResponse<InventoryMovementResponse[]>> {
    return this.httpClient.get<ApiResponse<InventoryMovementResponse[]>>('/inventory/all');
  }
}
