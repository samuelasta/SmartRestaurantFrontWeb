import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserFormModalComponent } from './components/user-management/user-form-modal.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AuditLogsComponent } from './components/audit-logs/audit-logs.component';

// Services
import { AdminService } from './services/admin.service';
import { AuditService } from './services/audit.service';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserFormModalComponent,
    UserDetailComponent,
    AuditLogsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  providers: [
    AdminService,
    AuditService
  ]
})
export class AdminModule { }
