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
  constructor(private http: HttpClientService) {}

  // Registrar empleado
  registerEmployee(request: RegisterEmployeeRequest): Observable<string> {
    return this.http.post<string>('/admin/register-employee', request, { responseType: 'text' as 'json' });
  }

  // Listar usuarios con filtros opcionales
  getUsers(role?: UserRole, status?: UserStatus): Observable<User[]> {
    let url = '/admin/users';
    const params: string[] = [];
    
    if (role) params.push(`role=${role}`);
    if (status) params.push(`status=${status}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return this.http.get<User[]>(url);
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/admin/users/${id}`);
  }

  // Actualizar usuario
  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`/admin/users/${id}`, request);
  }

  // Cambiar rol
  changeRole(id: number, request: ChangeRoleRequest): Observable<User> {
    return this.http.patch<User>(`/admin/users/${id}/role`, request);
  }

  // Desactivar usuario
  deactivateUser(id: number): Observable<User> {
    return this.http.patch<User>(`/admin/users/${id}/deactivate`, {});
  }

  // Activar usuario
  activateUser(id: number): Observable<User> {
    return this.http.patch<User>(`/admin/users/${id}/activate`, {});
  }
}
