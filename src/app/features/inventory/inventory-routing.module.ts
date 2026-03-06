import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryDetailComponent } from './components/inventory-detail/inventory-detail.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: InventoryListComponent
      },
      {
        path: 'detail/:id',
        component: InventoryDetailComponent
      },
      {
        path: 'new',
        component: InventoryFormComponent
      },
      {
        path: 'edit/:id',
        component: InventoryFormComponent
      },
      {
        path: 'categories',
        component: CategoryManagementComponent
      },
      {
        path: 'alerts',
        component: StockAlertComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
