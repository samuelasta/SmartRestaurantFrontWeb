import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Categoría eliminada exitosamente');
          this.loadCategories();
        }
      });
    }
  }
}
