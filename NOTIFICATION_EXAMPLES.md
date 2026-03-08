# Ejemplos Prácticos de Uso del Sistema de Notificaciones

## 1. Operaciones CRUD Básicas

### Crear Producto

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html'
})
export class ProductCreateComponent {
  productForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    // Validación del formulario
    if (this.productForm.invalid) {
      this.notificationService.showWarning('Por favor complete todos los campos correctamente');
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.productService.create(this.productForm.value).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Producto creado exitosamente');
        this.router.navigate(['/products', response.id]);
      },
      error: () => {
        // El interceptor ya mostró el error del backend
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
```

### Actualizar Producto

```typescript
updateProduct(): void {
  if (this.productForm.invalid) {
    this.notificationService.showWarning('Verifique los datos del formulario');
    return;
  }

  this.productService.update(this.productId, this.productForm.value).subscribe({
    next: (response) => {
      this.notificationService.showSuccess('Producto actualizado correctamente');
      this.originalData = { ...response }; // Guardar para detectar cambios
    }
    // Error manejado automáticamente
  });
}
```

### Eliminar Producto

```typescript
deleteProduct(product: Product): void {
  // Confirmación antes de eliminar
  const confirmed = confirm(`¿Está seguro de eliminar "${product.name}"?`);
  
  if (!confirmed) {
    return;
  }

  this.productService.delete(product.id).subscribe({
    next: () => {
      this.notificationService.showSuccess(`"${product.name}" eliminado correctamente`);
      this.loadProducts(); // Recargar la lista
    }
    // Error manejado automáticamente
  });
}
```

## 2. Autenticación y Autorización

### Login

```typescript
login(): void {
  if (this.loginForm.invalid) {
    this.notificationService.showWarning('Ingrese email y contraseña');
    return;
  }

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      this.notificationService.showSuccess(`Bienvenido, ${response.user.name}!`);
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      // El interceptor muestra el error
      // Limpiar contraseña por seguridad
      this.loginForm.patchValue({ password: '' });
    }
  });
}
```

### Registro

```typescript
register(): void {
  if (this.registerForm.invalid) {
    this.notificationService.showWarning('Complete todos los campos requeridos');
    return;
  }

  // Validación adicional de contraseñas
  if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
    this.notificationService.showError('Las contraseñas no coinciden');
    return;
  }

  this.authService.register(this.registerForm.value).subscribe({
    next: (response) => {
      this.notificationService.showSuccess('Cuenta creada exitosamente. Bienvenido!');
      this.router.navigate(['/dashboard']);
    }
    // Error manejado automáticamente
  });
}
```

### Cambio de Contraseña

```typescript
changePassword(): void {
  if (this.passwordForm.invalid) {
    this.notificationService.showWarning('Complete todos los campos');
    return;
  }

  const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

  if (newPassword !== confirmPassword) {
    this.notificationService.showError('Las contraseñas nuevas no coinciden');
    return;
  }

  if (currentPassword === newPassword) {
    this.notificationService.showWarning('La nueva contraseña debe ser diferente a la actual');
    return;
  }

  this.authService.changePassword(currentPassword, newPassword).subscribe({
    next: () => {
      this.notificationService.showSuccess('Contraseña actualizada correctamente');
      this.passwordForm.reset();
    }
    // Error manejado automáticamente
  });
}
```

## 3. Operaciones con Archivos

### Subir Imagen

```typescript
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    this.notificationService.showError('Solo se permiten archivos de imagen');
    return;
  }

  // Validar tamaño (5MB máximo)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    this.notificationService.showError('La imagen no debe superar los 5MB');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  this.imageService.upload(formData).subscribe({
    next: (response) => {
      this.notificationService.showSuccess('Imagen subida correctamente');
      this.imageUrl = response.url;
    },
    error: (error) => {
      // El interceptor muestra el error del backend
      // Limpiar el input
      input.value = '';
    }
  });
}
```

### Exportar Datos

```typescript
exportToExcel(): void {
  this.notificationService.showInfo('Generando archivo Excel...');

  this.reportService.exportToExcel(this.filters).subscribe({
    next: (blob) => {
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      this.notificationService.showSuccess('Archivo descargado correctamente');
    }
    // Error manejado automáticamente
  });
}
```

## 4. Operaciones en Lote

### Eliminar Múltiples Items

```typescript
deleteSelected(): void {
  const selectedIds = this.getSelectedIds();

  if (selectedIds.length === 0) {
    this.notificationService.showWarning('Seleccione al menos un elemento');
    return;
  }

  const confirmed = confirm(`¿Eliminar ${selectedIds.length} elemento(s)?`);
  
  if (!confirmed) {
    return;
  }

  this.productService.deleteMultiple(selectedIds).subscribe({
    next: () => {
      this.notificationService.showSuccess(`${selectedIds.length} elemento(s) eliminado(s)`);
      this.clearSelection();
      this.loadProducts();
    }
    // Error manejado automáticamente
  });
}
```

### Actualizar Estado en Lote

```typescript
updateStatusBatch(status: string): void {
  const selectedIds = this.getSelectedIds();

  if (selectedIds.length === 0) {
    this.notificationService.showWarning('Seleccione al menos un pedido');
    return;
  }

  this.orderService.updateStatusBatch(selectedIds, status).subscribe({
    next: () => {
      this.notificationService.showSuccess(
        `Estado actualizado para ${selectedIds.length} pedido(s)`
      );
      this.clearSelection();
      this.loadOrders();
    }
    // Error manejado automáticamente
  });
}
```

## 5. Validaciones del Cliente

### Validación de Formulario Complejo

```typescript
validateAndSubmit(): void {
  // Validación básica
  if (this.form.invalid) {
    this.notificationService.showWarning('Complete todos los campos requeridos');
    this.form.markAllAsTouched();
    return;
  }

  // Validaciones de negocio
  const formValue = this.form.value;

  if (formValue.startDate > formValue.endDate) {
    this.notificationService.showError('La fecha de inicio debe ser anterior a la fecha de fin');
    return;
  }

  if (formValue.discount > formValue.price) {
    this.notificationService.showError('El descuento no puede ser mayor al precio');
    return;
  }

  if (formValue.stock < formValue.minStock) {
    this.notificationService.showWarning(
      'El stock es menor al mínimo recomendado. ¿Desea continuar?'
    );
    // Aquí podrías mostrar un modal de confirmación
  }

  // Si todo está bien, enviar
  this.submitForm();
}
```

## 6. Manejo de Estados de Carga

### Con Indicador de Progreso

```typescript
export class DataSyncComponent {
  isSyncing = false;
  syncProgress = 0;

  constructor(
    private syncService: SyncService,
    private notificationService: NotificationService
  ) {}

  syncData(): void {
    this.isSyncing = true;
    this.syncProgress = 0;

    this.notificationService.showInfo('Iniciando sincronización...');

    this.syncService.sync().subscribe({
      next: (progress) => {
        this.syncProgress = progress.percentage;
      },
      error: () => {
        // Error manejado automáticamente
        this.isSyncing = false;
        this.syncProgress = 0;
      },
      complete: () => {
        this.notificationService.showSuccess('Sincronización completada');
        this.isSyncing = false;
        this.syncProgress = 100;
      }
    });
  }
}
```

## 7. Manejo de Errores Específicos

### Manejo Personalizado por Código de Error

```typescript
createOrder(): void {
  this.orderService.create(this.orderData).subscribe({
    next: (response) => {
      this.notificationService.showSuccess('Pedido creado exitosamente');
      this.router.navigate(['/orders', response.id]);
    },
    error: (error) => {
      // El interceptor ya mostró el mensaje
      // Pero podemos agregar lógica específica
      
      if (error.status === 409) {
        // Conflicto - producto sin stock
        this.highlightOutOfStockItems();
      } else if (error.status === 422) {
        // Validación - resaltar campos inválidos
        this.highlightInvalidFields(error.error.details);
      } else if (error.status === 402) {
        // Pago requerido
        this.router.navigate(['/payment']);
      }
    }
  });
}

private highlightInvalidFields(details: string[]): void {
  details.forEach(detail => {
    // Extraer nombre del campo del mensaje
    const fieldMatch = detail.match(/campo (\w+)/);
    if (fieldMatch) {
      const fieldName = fieldMatch[1];
      const control = this.form.get(fieldName);
      if (control) {
        control.setErrors({ serverError: detail });
      }
    }
  });
}
```

## 8. Notificaciones Informativas

### Recordatorios y Avisos

```typescript
export class DashboardComponent implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.checkPendingTasks();
    this.checkLowStock();
  }

  private checkPendingTasks(): void {
    this.taskService.getPendingCount().subscribe({
      next: (count) => {
        if (count > 0) {
          this.notificationService.showInfo(
            `Tiene ${count} tarea(s) pendiente(s)`
          );
        }
      }
    });
  }

  private checkLowStock(): void {
    this.inventoryService.getLowStockProducts().subscribe({
      next: (products) => {
        if (products.length > 0) {
          this.notificationService.showWarning(
            `${products.length} producto(s) con stock bajo`
          );
        }
      }
    });
  }
}
```

## 9. Operaciones Asíncronas Encadenadas

### Múltiples Operaciones Secuenciales

```typescript
import { forkJoin, switchMap } from 'rxjs';

processOrder(): void {
  this.notificationService.showInfo('Procesando pedido...');

  // 1. Validar stock
  this.inventoryService.validateStock(this.orderItems).pipe(
    switchMap(() => {
      // 2. Crear pedido
      this.notificationService.showInfo('Creando pedido...');
      return this.orderService.create(this.orderData);
    }),
    switchMap((order) => {
      // 3. Procesar pago
      this.notificationService.showInfo('Procesando pago...');
      return this.paymentService.process(order.id, this.paymentData);
    }),
    switchMap((payment) => {
      // 4. Enviar confirmación
      return this.emailService.sendConfirmation(payment.orderId);
    })
  ).subscribe({
    next: () => {
      this.notificationService.showSuccess(
        'Pedido procesado y confirmación enviada'
      );
      this.router.navigate(['/orders/success']);
    }
    // Cualquier error en la cadena se maneja automáticamente
  });
}
```

## 10. Retry y Recuperación

### Reintentar Operación Fallida

```typescript
import { retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

saveData(): void {
  this.dataService.save(this.data).pipe(
    retry(2) // Reintentar 2 veces antes de fallar
  ).subscribe({
    next: () => {
      this.notificationService.showSuccess('Datos guardados correctamente');
    },
    error: (error) => {
      // Después de 2 reintentos fallidos
      this.notificationService.showError(
        'No se pudo guardar. ¿Desea guardar localmente?'
      );
      this.offerLocalSave();
    }
  });
}

private offerLocalSave(): void {
  const confirmed = confirm('¿Guardar los datos localmente?');
  if (confirmed) {
    localStorage.setItem('unsaved_data', JSON.stringify(this.data));
    this.notificationService.showInfo('Datos guardados localmente');
  }
}
```

## Consejos de Uso

1. **No abuses de las notificaciones**: Solo muestra mensajes relevantes
2. **Sé específico**: "Producto 'iPhone 13' eliminado" es mejor que "Eliminado"
3. **Usa el tipo correcto**: 
   - Success: Operación completada
   - Error: Algo salió mal
   - Warning: Advertencia o precaución
   - Info: Información general
4. **Evita notificaciones duplicadas**: El interceptor ya maneja errores HTTP
5. **Mensajes cortos**: Máximo 2 líneas de texto
6. **Contexto útil**: Incluye información que ayude al usuario a entender qué pasó

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should emit success notification', (done) => {
    service.notification$.subscribe(notification => {
      expect(notification.type).toBe('success');
      expect(notification.message).toBe('Test message');
      done();
    });

    service.showSuccess('Test message');
  });
});
```
