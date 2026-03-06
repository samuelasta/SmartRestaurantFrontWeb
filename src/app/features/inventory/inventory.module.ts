import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InventoryRoutingModule } from './inventory-routing.module';
import { SharedModule } from '@shared/shared.module';

import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryDetailComponent } from './components/inventory-detail/inventory-detail.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';

@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryDetailComponent,
    InventoryFormComponent,
    CategoryManagementComponent,
    StockAlertComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class InventoryModule { }
