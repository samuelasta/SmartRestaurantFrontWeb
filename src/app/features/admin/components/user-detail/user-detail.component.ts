import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuditService } from '../../services/audit.service';
import { User } from '@features/auth/models/user.model';
import { AuditLogResponse } from '../../models/audit-log.model';
import { NotificationService } from '@core/services/notification.service';
import { UserStatus } from '@features/auth/models/user-status.enum';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  recentLogs: AuditLogResponse[] = [];
  loading = false;
  logsLoading = false;
  UserStatus = UserStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private auditService: AuditService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(+userId);
      this.loadRecentLogs(+userId);
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.adminService.getUserById(id).subscribe({
      next: (response) => {
        if (!response.error) {
          this.user = response.message as User;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuario:', err);
        this.loading = false;
        this.notificationService.showError('Error al cargar el usuario');
        this.goBack();
      }
    });
  }

  loadRecentLogs(userId: number): void {
    this.logsLoading = true;
    this.auditService.getRecentLogsByUser(userId).subscribe({
      next: (response) => {
        if (!response.error) {
          this.recentLogs = response.message as AuditLogResponse[];
        }
        this.logsLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar logs:', err);
        this.logsLoading = false;
      }
    });
  }

  deactivateUser(): void {
    if (!this.user) return;
    
    if (confirm('¿Está seguro de desactivar este usuario?')) {
      this.adminService.deactivateUser(this.user.id).subscribe({
        next: (response) => {
          if (!response.error) {
            this.notificationService.showSuccess('Usuario desactivado exitosamente');
            this.loadUser(this.user!.id);
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

  activateUser(): void {
    if (!this.user) return;
    
    if (confirm('¿Está seguro de activar este usuario?')) {
      this.adminService.activateUser(this.user.id).subscribe({
        next: (response) => {
          if (!response.error) {
            this.notificationService.showSuccess('Usuario activado exitosamente');
            this.loadUser(this.user!.id);
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

  editUser(): void {
    if (this.user) {
      this.router.navigate(['/admin/users'], { queryParams: { edit: this.user.id } });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
