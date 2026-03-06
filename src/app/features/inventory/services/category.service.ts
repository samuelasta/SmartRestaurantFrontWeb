import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClientService) {}

  getAll(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('/categories');
  }

  getById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`/categories/${id}`);
  }

  create(category: Partial<Category>): Observable<Category> {
    return this.httpClient.post<Category>('/categories', category);
  }

  update(id: number, category: Partial<Category>): Observable<Category> {
    return this.httpClient.put<Category>(`/categories/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/categories/${id}`);
  }
}
