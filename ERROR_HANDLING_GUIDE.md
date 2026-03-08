# Guía de Manejo de Errores - Frontend

## Descripción General

El sistema de manejo de errores está completamente configurado para capturar automáticamente los errores del backend y mostrarlos al usuario mediante notificaciones Toast.

## Arquitectura

### 1. Error Interceptor (`error.interceptor.ts`)

El interceptor captura automáticamente todas las respuestas HTTP con errores y:

- Extrae el mensaje de error del backend
- Maneja casos especiales (sin conexión, timeout, etc.)
- Muestra notificaciones al usuario
- Redirige según el código de estado (ej: 401 → login)

#### Prioridad de Extracción de Mensajes:

1. `error.response.data.message` - Mensaje del backend
2. `error.response.data.details[]` - Detalles adicionales
3. `error.error` - Error como string directo
4. Mensaje genérico según código HTTP

### 2. Notification Service (`notification.service.ts`)

Servicio centralizado para mostrar notificaciones:

```typescript
// Inyectar el servicio
constructor(private notificationService: NotificationService) {}

// Mostrar notificaciones
this.notificationService.showSuccess('Operación exitosa');
this.notificationService.showError('Error al procesar');
this.notificationService.showWarning('Advertencia importante');
this.notificationService.showInfo('Información relevante');
```

### 3. Toast Component (`toast.component`)

Componente visual que muestra las notificaciones:

- Auto-cierre después de 5 segundos
- Animaciones suaves de entrada/salida
- Botón de cierre manual
- Diseño responsive
- Colores según tipo de notificación

## Uso en Componentes

### Manejo Automático

Los errores HTTP se manejan automáticamente. No necesitas hacer nada especial:

```typescript
// El interceptor captura automáticamente el error
this.authService.login(credentials).subscribe({
  next: (response) => {
    // Manejar respuesta exitosa
  }
  // No necesitas el bloque error, el interceptor lo maneja
});
```

### Manejo Manual de Errores Específicos

Si necesitas lógica adicional para ciertos errores:

```typescript
this.authService.login(credentials).subscribe({
  next: (response) => {
    this.notificationService.showSuccess('Inicio de sesión exitoso');
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    // El interceptor ya mostró el error
    // Aquí puedes agregar lógica adicional
    if (error.status === 401) {
      this.loginForm.reset();
    }
  }
});
```

### Notificaciones Manuales

Para operaciones que no son HTTP:

```typescript
// Validación del lado del cliente
if (!this.form.valid) {
  this.notificationService.showWarning('Por favor complete todos los campos');
  return;
}

// Operación exitosa
this.notificationService.showSuccess('Datos guardados correctamente');

// Información general
this.notificationService.showInfo('Recuerde guardar los cambios');
```

## Mensajes de Error del Backend

El sistema espera que el backend envíe errores en este formato:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El email ya está registrado",
  "path": "/api/auth/register",
  "details": ["El campo email debe ser único"],
  "code": "EMAIL_ALREADY_EXISTS"
}
```

### Códigos HTTP Soportados

| Código | Mensaje por Defecto |
|--------|---------------------|
| 0 | No se pudo conectar con el servidor |
| 400 | Solicitud inválida. Verifique los datos enviados |
| 401 | No autorizado. Por favor inicie sesión nuevamente |
| 403 | No tiene permisos para realizar esta acción |
| 404 | Recurso no encontrado |
| 409 | Conflicto con el estado actual del recurso |
| 422 | Los datos proporcionados no son válidos |
| 429 | Demasiadas solicitudes. Por favor intente más tarde |
| 500 | Error interno del servidor |
| 502 | Error de comunicación con el servidor |
| 503 | Servicio no disponible temporalmente |
| 504 | Tiempo de espera agotado |
| Otros | Ha ocurrido un error inesperado |

## Casos Especiales

### 1. Autenticación 2FA

El interceptor no muestra error cuando detecta `is2faRequired`:

```typescript
if (error.error && error.error.is2faRequired) {
  // El componente maneja el flujo de 2FA
  return throwError(() => error);
}
```

### 2. Errores de Red

Cuando no hay conexión o el servidor no responde:

```typescript
if (error.status === 0) {
  return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
}
```

### 3. Redirección Automática

El interceptor redirige automáticamente en ciertos casos:

- **401 (No autorizado)**: Redirige a `/auth/login` (excepto si ya estás en `/auth/`)
- **403 (Prohibido)**: Opcional, puedes descomentar para redirigir a página de acceso denegado

## Personalización

### Cambiar Duración del Toast

En `toast.component.ts`, línea 37:

```typescript
// Cambiar de 5000ms (5 segundos) a otro valor
setTimeout(() => {
  this.removeNotification(toast.id);
}, 5000); // Modificar este valor
```

### Cambiar Posición del Toast

En `toast.component.scss`:

```scss
.toast-container {
  position: fixed;
  top: 20px;    // Cambiar posición vertical
  right: 20px;  // Cambiar posición horizontal
  // Para posición inferior derecha:
  // bottom: 20px;
  // right: 20px;
}
```

### Agregar Sonidos

En `toast.component.ts`, método `addNotification`:

```typescript
private addNotification(notification: Notification): void {
  const toast: ToastNotification = {
    ...notification,
    id: this.notificationId++,
    show: true
  };

  this.notifications.push(toast);

  // Agregar sonido
  if (notification.type === 'error') {
    const audio = new Audio('assets/sounds/error.mp3');
    audio.play();
  }

  setTimeout(() => {
    this.removeNotification(toast.id);
  }, 5000);
}
```

## Ejemplos Completos

### Ejemplo 1: Registro de Usuario

```typescript
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.form.valid) {
      this.notificationService.showWarning('Complete todos los campos requeridos');
      return;
    }

    this.authService.register(this.form.value).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Registro exitoso. Bienvenido!');
        this.router.navigate(['/dashboard']);
      }
      // El error se maneja automáticamente por el interceptor
    });
  }
}
```

### Ejemplo 2: Actualización de Perfil

```typescript
export class ProfileComponent {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  updateProfile(): void {
    this.userService.updateProfile(this.profileData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Perfil actualizado correctamente');
      },
      error: (error) => {
        // El interceptor ya mostró el error
        // Lógica adicional si es necesario
        if (error.status === 422) {
          this.highlightInvalidFields();
        }
      }
    });
  }
}
```

### Ejemplo 3: Eliminación con Confirmación

```typescript
export class ProductListComponent {
  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  deleteProduct(id: number): void {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    this.productService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto eliminado correctamente');
        this.loadProducts(); // Recargar lista
      }
      // El error se maneja automáticamente
    });
  }
}
```

## Testing

### Probar el Sistema de Notificaciones

1. **Error 401**: Intenta acceder a un recurso sin autenticación
2. **Error 404**: Solicita un recurso inexistente
3. **Error 500**: Simula un error del servidor
4. **Sin conexión**: Desconecta la red y realiza una petición
5. **Notificación manual**: Usa el servicio directamente

```typescript
// En el componente de prueba
testNotifications(): void {
  this.notificationService.showSuccess('Prueba de éxito');
  setTimeout(() => this.notificationService.showError('Prueba de error'), 1000);
  setTimeout(() => this.notificationService.showWarning('Prueba de advertencia'), 2000);
  setTimeout(() => this.notificationService.showInfo('Prueba de información'), 3000);
}
```

## Troubleshooting

### Las notificaciones no aparecen

1. Verifica que `<app-toast></app-toast>` esté en `app.component.html`
2. Confirma que `SharedModule` esté importado en `AppModule`
3. Revisa la consola del navegador para errores

### Los mensajes del backend no se muestran

1. Verifica que el backend envíe el campo `message` en la respuesta de error
2. Revisa la estructura del error en la consola del navegador
3. Confirma que el `ErrorInterceptor` esté registrado en `CoreModule`

### El interceptor no se ejecuta

Verifica en `core.module.ts` o `app.module.ts`:

```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }
]
```

## Mejoras Futuras

- [ ] Agregar persistencia de notificaciones importantes
- [ ] Implementar notificaciones con acciones (ej: "Deshacer")
- [ ] Agregar soporte para notificaciones push
- [ ] Implementar cola de notificaciones con prioridad
- [ ] Agregar analytics para tracking de errores
- [ ] Implementar retry automático para ciertos errores

## Recursos

- [Angular HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor)
- [RxJS Error Handling](https://rxjs.dev/guide/error-handling)
- [Angular Best Practices](https://angular.io/guide/styleguide)
