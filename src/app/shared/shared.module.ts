import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Layout components
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

// UI components
import { ButtonComponent } from './components/ui/button/button.component';
import { ModalComponent } from './components/ui/modal/modal.component';
import { TableComponent } from './components/ui/table/table.component';
import { FormFieldComponent } from './components/ui/form-field/form-field.component';
import { LoadingSpinnerComponent } from './components/ui/loading-spinner/loading-spinner.component';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';

// Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

@NgModule({
  declarations: [
    // Layout
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MainLayoutComponent,
    // UI
    ButtonComponent,
    ModalComponent,
    TableComponent,
    FormFieldComponent,
    LoadingSpinnerComponent,
    // Directives
    HasRoleDirective,
    // Pipes
    DateFormatPipe,
    CurrencyFormatPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Layout
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MainLayoutComponent,
    // UI
    ButtonComponent,
    ModalComponent,
    TableComponent,
    FormFieldComponent,
    LoadingSpinnerComponent,
    // Directives
    HasRoleDirective,
    // Pipes
    DateFormatPipe,
    CurrencyFormatPipe
  ]
})
export class SharedModule { }
