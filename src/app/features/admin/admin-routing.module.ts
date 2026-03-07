import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserManagementComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent
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
