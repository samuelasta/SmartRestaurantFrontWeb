import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [RoleGuard],
    data: { permissions: ['user:read'] }
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    canActivate: [RoleGuard],
    data: { permissions: ['user:read'] }
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent,
    canActivate: [RoleGuard],
    data: { permissions: ['audit:read'] }
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
