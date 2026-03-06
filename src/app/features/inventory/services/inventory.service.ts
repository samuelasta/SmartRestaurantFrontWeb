import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { InventoryItem } from '../models/inventory-item.model';
import { StockMovement } from '../models/stock-movement.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private httpClient: HttpClientService) {}

  getAll(): Observable<InventoryItem[]> {
    return this.httpClient.get<InventoryItem[]>('/inventory');
  }

  getById(id: number): Observable<InventoryItem> {
    return this.httpClient.get<InventoryItem>(`/inventory/${id}`);
  }

  create(item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.httpClient.post<InventoryItem>('/inventory', item);
  }

  update(id: number, item: Partial<InventoryItem>): Observable<InventoryItem> {
    return this.httpClient.put<InventoryItem>(`/inventory/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/inventory/${id}`);
  }

  getLowStockItems(): Observable<InventoryItem[]> {
    return this.httpClient.get<InventoryItem[]>('/inventory/low-stock');
  }

  getStockMovements(itemId: number): Observable<StockMovement[]> {
    return this.httpClient.get<StockMovement[]>(`/inventory/${itemId}/movements`);
  }

  adjustStock(itemId: number, quantity: number, reason: string): Observable<void> {
    return this.httpClient.post<void>(`/inventory/${itemId}/adjust`, { quantity, reason });
  }
}
