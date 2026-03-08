import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { PermissionService } from '@core/services/permission.service';
import { UserRole } from '@features/auth/models/user-role.enum';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  permission: string; // Permiso requerido para ver la tarjeta
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  userName: string = '';
  userEmail: string = '';

  // Tarjetas del dashboard con permisos
  dashboardCards: DashboardCard[] = [
    {
      title: 'Inventario',
      description: 'Gestión de productos del inventario',
      icon: '📦',
      route: '/inventory/list',
      color: '#3498db',
      permission: 'inventory:read'
    },
    {
      title: 'Proveedores',
      description: 'Administración de proveedores',
      icon: '🚚',
      route: '/inventory/suppliers',
      color: '#9b59b6',
      permission: 'supplier:read'
    },
    {
      title: 'Platos',
      description: 'Gestión del menú de platos',
      icon: '🍝',
      route: '/inventory/dishes',
      color: '#e67e22',
      permission: 'dish:read'
    },
    {
      title: 'Bebidas',
      description: 'Gestión del menú de bebidas',
      icon: '🥤',
      route: '/inventory/drinks',
      color: '#1abc9c',
      permission: 'drink:read'
    },
    {
      title: 'Adiciones',
      description: 'Extras y adiciones para pedidos',
      icon: '➕',
      route: '/inventory/additions',
      color: '#e74c3c',
      permission: 'addition:read'
    },
    {
      title: 'Menú del Día',
      description: 'Gestión del menú diario',
      icon: '🍽️',
      route: '/inventory/daily-menu',
      color: '#8e44ad',
      permission: 'daily_menu:read'
    },
    {
      title: 'Categorías',
      description: 'Administración de categorías',
      icon: '📁',
      route: '/inventory/categories',
      color: '#f39c12',
      permission: 'category:read'
    },
    {
      title: 'Alertas de Stock',
      description: 'Productos con stock bajo',
      icon: '⚠️',
      route: '/inventory/alerts',
      color: '#c0392b',
      permission: 'stock_alert:read'
    },
    {
      title: 'Movimientos de Inventario',
      description: 'Historial de entradas y salidas',
      icon: '📊',
      route: '/inventory/movements',
      color: '#16a085',
      permission: 'inventory_movement:read'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar empleados y permisos',
      icon: '👥',
      route: '/admin/users',
      color: '#2c3e50',
      permission: 'user:read'
    },
    {
      title: 'Auditoría de Seguridad',
      description: 'Logs y eventos del sistema',
      icon: '🛡️',
      route: '/admin/audit-logs',
      color: '#34495e',
      permission: 'audit:read'
    }
  ];

  constructor(
    private router: Router,
    private storageService: StorageService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.userRole = this.storageService.getUserRole();
    const user = this.storageService.getUser();
    this.userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Usuario';
    this.userEmail = user?.email || '';

    // Si es cliente, redirigir a vista de cliente
    if (this.permissionService.isCustomer()) {
      this.router.navigate(['/customer/home']);
    }
  }

  getRoleDisplayName(role: string): string {
    const roleNames: Record<string, string> = {
      'ADMIN': 'Administrador',
      'KITCHEN': 'Cocina',
      'WAITER': 'Mesero',
      'CUSTOMER': 'Cliente'
    };
    return roleNames[role] || role;
  }

  getVisibleCards(): DashboardCard[] {
    return this.dashboardCards.filter(card => 
      this.permissionService.hasPermission(card.permission)
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  canWrite(module: string): boolean {
    return this.permissionService.canWrite(module);
  }

  isReadOnly(): boolean {
    return this.userRole === UserRole.WAITER;
  }
}
