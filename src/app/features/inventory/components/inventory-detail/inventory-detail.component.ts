import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {
  item: InventoryItem | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadItem(id);
    }
  }

  loadItem(id: number): void {
    this.loading = true;
    this.inventoryService.getById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/inventory/list']);
      }
    });
  }

  editItem(): void {
    if (this.item) {
      this.router.navigate(['/inventory/edit', this.item.id]);
    }
  }

  deleteItem(): void {
    if (this.item && confirm('¿Está seguro de eliminar este producto?')) {
      this.inventoryService.delete(this.item.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Producto eliminado exitosamente');
          this.router.navigate(['/inventory/list']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/inventory/list']);
  }
}
