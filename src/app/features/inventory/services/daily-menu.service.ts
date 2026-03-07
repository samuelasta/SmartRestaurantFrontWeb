import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { DailyMenuResponse } from '../models/daily-menu.model';

@Injectable({
  providedIn: 'root'
})
export class DailyMenuService {
  private readonly API_URL = '/dailyMenus';

  constructor(private httpClient: HttpClientService) {}

  // Obtener platos del menú diario (paginado)
  getDailyMenuDishes(page: number): Observable<DailyMenuResponse> {
    return this.httpClient.get<DailyMenuResponse>(`${this.API_URL}/${page}/page`);
  }

  // Agregar plato al menú diario
  addDishToMenu(dishId: string): Observable<DailyMenuResponse> {
    return this.httpClient.post<DailyMenuResponse>(`${this.API_URL}/${dishId}/dishes`, {});
  }

  // Eliminar plato del menú diario
  removeDishFromMenu(dishId: string): Observable<DailyMenuResponse> {
    return this.httpClient.delete<DailyMenuResponse>(`${this.API_URL}/${dishId}/dishes`);
  }
}
