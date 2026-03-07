import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./features/inventory/inventory.module').then(m => m.InventoryModule)
  },
  // Ruta de dashboard por defecto para usuarios autenticados
  {
    path: 'dashboard',
    redirectTo: '/inventory',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    redirectTo: '/inventory'
  },
  {
    path: 'kitchen',
    redirectTo: '/inventory'
  },
  {
    path: 'waiter',
    redirectTo: '/inventory'
  },
  {
    path: 'customer',
    redirectTo: '/inventory'
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
