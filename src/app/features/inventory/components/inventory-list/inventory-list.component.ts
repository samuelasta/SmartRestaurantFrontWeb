import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryStateService } from '../../services/inventory-state.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  loading = false;
  columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoría' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'unitPrice', label: 'Precio' }
  ];

  constructor(
    private inventoryService: InventoryService,
    private inventoryStateService: InventoryStateService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.inventoryStateService.setInventoryItems(items);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onRowClick(item: InventoryItem): void {
    this.router.navigate(['/inventory/detail', item.id]);
  }

  navigateToNew(): void {
    this.router.navigate(['/inventory/new']);
  }
}
