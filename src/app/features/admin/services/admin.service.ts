import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { User } from '@features/auth/models/user.model';
import { UserRole } from '@features/auth/models/user-role.enum';
import { UserStatus } from '@features/auth/models/user-status.enum';
import { RegisterEmployeeRequest } from '../models/register-employee-request.model';
import { UpdateUserRequest } from '../models/update-user-request.model';
import { ChangeRoleRequest } from '../models/change-role-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = '/api/admin';

  constructor(private http: HttpClientService) {}

  // Registrar empleado
  registerEmployee(request: RegisterEmployeeRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register-employee`, request);
  }

  // Listar usuarios con filtros opcionales
  getUsers(role?: UserRole, status?: UserStatus): Observable<any> {
    let url = `${this.API_URL}/users`;
    const params: string[] = [];
    
    if (role) params.push(`role=${role}`);
    if (status) params.push(`status=${status}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get(url);
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/users/${id}`);
  }

  // Actualizar usuario
  updateUser(id: number, request: UpdateUserRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/users/${id}`, request);
  }

  // Cambiar rol
  changeRole(id: number, request: ChangeRoleRequest): Observable<any> {
    return this.http.patch(`${this.API_URL}/users/${id}/role`, request);
  }

  // Desactivar usuario
  deactivateUser(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/users/${id}/deactivate`, {});
  }

  // Activar usuario
  activateUser(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}/users/${id}/activate`, {});
  }
}
