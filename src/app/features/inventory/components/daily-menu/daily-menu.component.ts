import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DailyMenuService } from '../../services/daily-menu.service';
import { DishService } from '../../services/dish.service';
import { DailyMenuDish } from '../../models/daily-menu.model';
import { DishResponse } from '../../models/dish.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-daily-menu',
  templateUrl: './daily-menu.component.html',
  styleUrls: ['./daily-menu.component.scss']
})
export class DailyMenuComponent implements OnInit {
  dailyMenuDishes: DailyMenuDish[] = [];
  availableDishes: DishResponse[] = [];
  loading = false;
  loadingAvailable = false;
  currentPage = 1;
  hasMorePages = true;
  pageSize = 10;
  isAddModalOpen = false;

  constructor(
    private dailyMenuService: DailyMenuService,
    private dishService: DishService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDailyMenu();
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  loadDailyMenu(): void {
    this.loading = true;
    this.dailyMenuService.getDailyMenuDishes(this.currentPage - 1).subscribe({
      next: (response: any) => {
        console.log('📦 [DAILY MENU] Respuesta completa:', response);
        console.log('📦 [DAILY MENU] Claves del objeto:', Object.keys(response));
        console.log('📦 [DAILY MENU] response.data:', response.data);
        console.log('📦 [DAILY MENU] response.message:', response.message);
        
        // Intentar con ambos formatos: data o message
        const dishes = response.data || response.message;
        console.log('📦 [DAILY MENU] dishes:', dishes);
        console.log('📦 [DAILY MENU] Es array?:', Array.isArray(dishes));
        
        if (!response.error && Array.isArray(dishes)) {
          this.dailyMenuDishes = dishes;
          this.hasMorePages = dishes.length >= this.pageSize;
          console.log('✅ [DAILY MENU] Platos cargados:', this.dailyMenuDishes.length);
        } else {
          this.dailyMenuDishes = [];
          this.hasMorePages = false;
          console.log('⚠️ [DAILY MENU] No hay platos o formato incorrecto');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ [DAILY MENU] Error:', err);
        this.loading = false;
        this.dailyMenuDishes = [];
        this.hasMorePages = false;
      }
    });
  }

  loadAvailableDishes(): void {
    this.loadingAvailable = true;
    this.dishService.getDishes(0).subscribe({
      next: (response) => {
        console.log('📦 [AVAILABLE DISHES] Respuesta completa:', response);
        console.log('📦 [AVAILABLE DISHES] response.message:', response.message);
        
        if (!response.error && Array.isArray(response.message)) {
          this.availableDishes = response.message;
          console.log('✅ [AVAILABLE DISHES] Platos disponibles:', this.availableDishes.length);
        } else {
          this.availableDishes = [];
          console.log('⚠️ [AVAILABLE DISHES] No hay platos disponibles');
        }
        this.loadingAvailable = false;
      },
      error: (err) => {
        console.error('❌ [AVAILABLE DISHES] Error:', err);
        this.loadingAvailable = false;
        this.availableDishes = [];
      }
    });
  }

  openAddModal(): void {
    this.loadAvailableDishes();
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  addDishToMenu(dishId: string): void {
    console.log('➕ [ADD DISH] Agregando plato con ID:', dishId);
    this.dailyMenuService.addDishToMenu(dishId).subscribe({
      next: (response) => {
        console.log('✅ [ADD DISH] Respuesta:', response);
        if (!response.error) {
          this.notificationService.showSuccess('Plato agregado al menú diario');
          this.loadDailyMenu();
          this.closeAddModal();
        } else {
          this.notificationService.showError(response.data as string);
        }
      },
      error: (err) => {
        console.error('❌ [ADD DISH] Error:', err);
        this.notificationService.showError('Error al agregar plato al menú');
      }
    });
  }

  removeDishFromMenu(dishId: string): void {
    if (confirm('¿Está seguro de eliminar este plato del menú diario?')) {
      this.dailyMenuService.removeDishFromMenu(dishId).subscribe({
        next: (response) => {
          if (!response.error) {
            this.notificationService.showSuccess('Plato eliminado del menú diario');
            this.loadDailyMenu();
          } else {
            this.notificationService.showError(response.data as string);
          }
        },
        error: () => {
          this.notificationService.showError('Error al eliminar plato del menú');
        }
      });
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadDailyMenu();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDailyMenu();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('placeholder')) {
      img.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
    }
  }

  viewDishDetail(dishId: string): void {
    this.router.navigate(['/inventory/dishes', dishId]);
  }
}
