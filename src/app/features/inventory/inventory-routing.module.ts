import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryDetailComponent } from './components/inventory-detail/inventory-detail.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';
import { SupplierManagementComponent } from './components/supplier-management/supplier-management.component';
import { DishManagementComponent } from './components/dish-management/dish-management.component';
import { DishDetailComponent } from './components/dish-detail/dish-detail.component';
import { DrinkManagementComponent } from './components/drink-management/drink-management.component';
import { DrinkDetailComponent } from './components/drink-detail/drink-detail.component';
import { AdditionManagementComponent } from './components/addition-management/addition-management.component';
import { DailyMenuComponent } from './components/daily-menu/daily-menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
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
      },
      {
        path: 'suppliers',
        component: SupplierManagementComponent
      },
      {
        path: 'dishes',
        component: DishManagementComponent
      },
      {
        path: 'dishes/:id',
        component: DishDetailComponent
      },
      {
        path: 'drinks',
        component: DrinkManagementComponent
      },
      {
        path: 'drinks/:id',
        component: DrinkDetailComponent
      },
      {
        path: 'additions',
        component: AdditionManagementComponent
      },
      {
        path: 'daily-menu',
        component: DailyMenuComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
