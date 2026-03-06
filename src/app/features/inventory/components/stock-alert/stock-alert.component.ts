import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-alert',
  templateUrl: './stock-alert.component.html',
  styleUrls: ['./stock-alert.component.scss']
})
export class StockAlertComponent implements OnInit {
  lowStockItems: InventoryItem[] = [];
  loading = false;

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLowStockItems();
  }

  loadLowStockItems(): void {
    this.loading = true;
    this.inventoryService.getLowStockItems().subscribe({
      next: (items) => {
        this.lowStockItems = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewItem(item: InventoryItem): void {
    this.router.navigate(['/inventory/detail', item.id]);
  }
}
