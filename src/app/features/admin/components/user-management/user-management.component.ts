import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { User } from '@features/auth/models/user.model';
import { UserRole } from '@features/auth/models/user-role.enum';
import { UserStatus } from '@features/auth/models/user-status.enum';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  isModalOpen = false;
  selectedUserId: number | null = null;
  
  // Filtros
  selectedRole: UserRole | null = null;
  selectedStatus: UserStatus | null = null;
  
  // Enums para el template
  UserRole = UserRole;
  UserStatus = UserStatus;
  
  roles = [
    { value: UserRole.ADMIN, label: 'Administrador' },
    { value: UserRole.KITCHEN, label: 'Cocina' },
    { value: UserRole.WAITER, label: 'Mesero' },
    { value: UserRole.CUSTOMER, label: 'Cliente' }
  ];
  
  statuses = [
    { value: UserStatus.ACTIVE, label: 'Activo' },
    { value: UserStatus.INACTIVE, label: 'Inactivo' },
    { value: UserStatus.PENDING, label: 'Pendiente' },
    { value: UserStatus.BANNED, label: 'Baneado' }
  ];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers(this.selectedRole || undefined, this.selectedStatus || undefined).subscribe({
      next: (response) => {
        if (!response.error) {
          this.users = response.message as User[];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
        this.loading = false;
        this.notificationService.showError('Error al cargar los usuarios');
      }
    });
  }

  openCreateModal(): void {
    this.selectedUserId = null;
    this.isModalOpen = true;
  }

  openEditModal(id: number): void {
    this.selectedUserId = id;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUserId = null;
  }

  onUserSaved(): void {
    this.loadUsers();
  }

  viewUserDetail(id: number): void {
    this.router.navigate(['/admin/users', id]);
  }

  deactivateUser(id: number): void {
    if (confirm('¿Está seguro de desactivar este usuario?')) {
      this.adminService.deactivateUser(id).subscribe({
        next: (response) => {
          if (!response.error) {
            this.notificationService.showSuccess('Usuario desactivado exitosamente');
            this.loadUsers();
          } else {
            this.notificationService.showError(response.message as string);
          }
        },
        error: () => {
          this.notificationService.showError('Error al desactivar el usuario');
        }
      });
    }
  }

  activateUser(id: number): void {
    if (confirm('¿Está seguro de activar este usuario?')) {
      this.adminService.activateUser(id).subscribe({
        next: (response) => {
          if (!response.error) {
            this.notificationService.showSuccess('Usuario activado exitosamente');
            this.loadUsers();
          } else {
            this.notificationService.showError(response.message as string);
          }
        },
        error: () => {
          this.notificationService.showError('Error al activar el usuario');
        }
      });
    }
  }

  onRoleFilterChange(): void {
    this.loadUsers();
  }

  onStatusFilterChange(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.selectedRole = null;
    this.selectedStatus = null;
    this.loadUsers();
  }

  getRoleBadgeClass(role: UserRole): string {
    const classes: { [key in UserRole]: string } = {
      [UserRole.ADMIN]: 'badge-admin',
      [UserRole.KITCHEN]: 'badge-kitchen',
      [UserRole.WAITER]: 'badge-waiter',
      [UserRole.CUSTOMER]: 'badge-customer'
    };
    return classes[role] || '';
  }

  getStatusBadgeClass(status: UserStatus): string {
    const classes: { [key in UserStatus]: string } = {
      [UserStatus.ACTIVE]: 'badge-success',
      [UserStatus.INACTIVE]: 'badge-warning',
      [UserStatus.PENDING]: 'badge-info',
      [UserStatus.BANNED]: 'badge-danger'
    };
    return classes[status] || '';
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
