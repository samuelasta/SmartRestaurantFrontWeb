import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { StorageService } from '@core/services/storage.service';
import { User } from '@features/auth/models/user.model';
import { UserRole } from '@features/auth/models/user-role.enum';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  isDropdownOpen = false;
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Solo cargar del storage, no hacer llamada automática al servidor
    const cachedUser = this.storageService.getUser();
    if (cachedUser) {
      this.user = cachedUser;
    }
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        // Actualizar en storage
        this.storageService.setUser(this.user);
      },
      error: (err) => {
        // Si es 401, el token expiró o no es válido - limpiar storage silenciosamente
        if (err.status === 401) {
          this.storageService.removeToken();
          this.storageService.removeUser();
          this.user = null;
        } else {
          // Para otros errores, mantener el usuario del storage si existe
          console.error('❌ Error al cargar usuario:', err);
          if (!this.user) {
            const cachedUser = this.storageService.getUser();
            if (cachedUser) {
              this.user = cachedUser;
            }
          }
        }
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToProfile(): void {
    this.isDropdownOpen = false;
    this.router.navigate(['/auth/profile']);
  }

  navigateToDashboard(): void {
    this.isDropdownOpen = false;
    this.router.navigate(['/dashboard']);
  }

  navigateToAdmin(): void {
    this.isDropdownOpen = false;
    this.router.navigate(['/admin/users']);
  }

  navigateToAudit(): void {
    this.isDropdownOpen = false;
    this.router.navigate(['/admin/audit-logs']);
  }

  logout(): void {
    if (confirm('¿Está seguro de cerrar sesión?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.notificationService.showSuccess('Sesión cerrada exitosamente');
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.notificationService.showError('Error al cerrar sesión');
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.user?.role === UserRole.ADMIN;
  }
}
