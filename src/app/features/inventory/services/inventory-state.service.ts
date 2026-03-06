import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryStateService {
  private inventoryItemsSubject = new BehaviorSubject<InventoryItem[]>([]);
  public inventoryItems$ = this.inventoryItemsSubject.asObservable();

  private selectedItemSubject = new BehaviorSubject<InventoryItem | null>(null);
  public selectedItem$ = this.selectedItemSubject.asObservable();

  constructor() {}

  setInventoryItems(items: InventoryItem[]): void {
    this.inventoryItemsSubject.next(items);
  }

  addInventoryItem(item: InventoryItem): void {
    const currentItems = this.inventoryItemsSubject.value;
    this.inventoryItemsSubject.next([...currentItems, item]);
  }

  updateInventoryItem(updatedItem: InventoryItem): void {
    const currentItems = this.inventoryItemsSubject.value;
    const index = currentItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      currentItems[index] = updatedItem;
      this.inventoryItemsSubject.next([...currentItems]);
    }
  }

  removeInventoryItem(id: number): void {
    const currentItems = this.inventoryItemsSubject.value;
    this.inventoryItemsSubject.next(currentItems.filter(item => item.id !== id));
  }

  setSelectedItem(item: InventoryItem | null): void {
    this.selectedItemSubject.next(item);
  }

  get currentInventoryItems(): InventoryItem[] {
    return this.inventoryItemsSubject.value;
  }
}
