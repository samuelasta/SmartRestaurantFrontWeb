import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  /**
   * Subir imagen a Cloudinary
   * POST /api/images
   * @param file Archivo a subir
   * @returns Observable con la respuesta que contiene la URL de la imagen
   */
  uploadImage(file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ url: string }>>(this.apiUrl, formData);
  }

  /**
   * Eliminar imagen de Cloudinary
   * DELETE /api/images?id=...
   * @param imageId ID público de la imagen en Cloudinary
   */
  deleteImage(imageId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}?id=${imageId}`);
  }
}
