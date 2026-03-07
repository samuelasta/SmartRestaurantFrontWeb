import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { UserRole } from '@features/auth/models/user-role.enum';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  // Tarjetas del dashboard
  dashboardCards: DashboardCard[] = [
    {
      title: 'Inventario',
      description: 'Gestión de productos del inventario',
      icon: '📦',
      route: '/inventory/list',
      color: '#3498db',
      roles: [UserRole.ADMIN, UserRole.KITCHEN]
    },
    {
      title: 'Proveedores',
      description: 'Administración de proveedores',
      icon: '🚚',
      route: '/inventory/suppliers',
      color: '#9b59b6',
      roles: [UserRole.ADMIN, UserRole.KITCHEN]
    },
    {
      title: 'Platos',
      description: 'Gestión del menú de platos',
      icon: '🍝',
      route: '/inventory/dishes',
      color: '#e67e22',
      roles: [UserRole.ADMIN, UserRole.KITCHEN]
    },
    {
      title: 'Bebidas',
      description: 'Gestión del menú de bebidas',
      icon: '🥤',
      route: '/inventory/drinks',
      color: '#1abc9c',
      roles: [UserRole.ADMIN, UserRole.KITCHEN]
    },
    {
      title: 'Adiciones',
      description: 'Extras y adiciones para pedidos',
      icon: '➕',
      route: '/inventory/additions',
      color: '#e74c3c',
      roles: [UserRole.ADMIN, UserRole.KITCHEN]
    },
    {
      title: 'Menú del Día',
      description: 'Gestión del menú diario',
      icon: '🍽️',
      route: '/inventory/daily-menu',
      color: '#8e44ad',
      roles: [UserRole.ADMIN, UserRole.KITCHEN, UserRole.WAITER]
    },
    {
      title: 'Categorías',
      description: 'Administración de categorías',
      icon: '📁',
      route: '/inventory/categories',
      color: '#f39c12',
      roles: [UserRole.ADMIN]
    },
    {
      title: 'Alertas de Stock',
      description: 'Productos con stock bajo',
      icon: '⚠️',
      route: '/inventory/alerts',
      color: '#c0392b',
      roles: [UserRole.ADMIN, UserRole.KITCHEN, UserRole.WAITER]
    }
  ];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userRole = this.storageService.getUserRole();
    const user = this.storageService.getUser();
    this.userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Usuario';
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
    // Si no hay rol definido, mostrar todas las tarjetas (para testing)
    if (!this.userRole) {
      console.warn('No user role found, showing all cards for testing');
      return this.dashboardCards;
    }
    return this.dashboardCards.filter(card => card.roles.includes(this.userRole as UserRole));
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
