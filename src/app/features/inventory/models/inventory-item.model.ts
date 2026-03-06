import { Category } from './category.model';

export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  sku: string;
  category: Category;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}
