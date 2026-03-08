import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar roles requeridos
    const requiredRoles = route.data['roles'] as Array<string>;
    const userRole = this.storageService.getUserRole();
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (!userRole || !requiredRoles.includes(userRole)) {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    // Verificar permisos requeridos
    const requiredPermissions = route.data['permissions'] as Array<string>;
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = this.permissionService.hasAnyPermission(requiredPermissions);
      if (!hasPermission) {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }
    
    return true;
  }
}
