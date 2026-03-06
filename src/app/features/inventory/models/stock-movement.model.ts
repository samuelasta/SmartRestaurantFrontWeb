export interface StockMovement {
  id: number;
  inventoryItemId: number;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}
