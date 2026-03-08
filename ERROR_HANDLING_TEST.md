# Guía de Pruebas - Sistema de Manejo de Errores

## Verificación Rápida

### 1. Verificar que el Toast Component está visible

1. Abre la aplicación en el navegador
2. Abre las DevTools (F12)
3. En la consola, ejecuta:
```javascript
document.querySelector('app-toast')
```
4. Deberías ver el elemento HTML del componente

### 2. Probar Notificaciones Manualmente

Abre la consola del navegador y ejecuta:

```javascript
// Obtener el servicio de notificaciones (solo para pruebas)
const notificationService = ng.probe(document.querySelector('app-root')).injector.get('NotificationService');

// Probar cada tipo de notificación
notificationService.showSuccess('Prueba de éxito');
notificationService.showError('Prueba de error');
notificationService.showWarning('Prueba de advertencia');
notificationService.showInfo('Prueba de información');
```

### 3. Crear Componente de Prueba (Opcional)

Crea un botón temporal en cualquier componente:

```typescript
// En el componente
constructor(private notificationService: NotificationService) {}

testNotifications(): void {
  this.notificationService.showSuccess('✓ Operación exitosa');
  
  setTimeout(() => {
    this.notificationService.showError('✕ Error de prueba');
  }, 1000);
  
  setTimeout(() => {
    this.notificationService.showWarning('⚠ Advertencia de prueba');
  }, 2000);
  
  setTimeout(() => {
    this.notificationService.showInfo('ℹ Información de prueba');
  }, 3000);
}
```

```html
<!-- En el template -->
<button (click)="testNotifications()">Probar Notificaciones</button>
```

## Pruebas de Errores HTTP

### Prueba 1: Error 404 (No Encontrado)

```typescript
// En cualquier servicio o componente
this.http.get('http://localhost:8080/api/recurso-inexistente').subscribe();
```

**Resultado esperado**: Toast rojo con mensaje "Recurso no encontrado"

### Prueba 2: Error 401 (No Autorizado)

```typescript
// Intenta acceder a un endpoint protegido sin token
this.http.get('http://localhost:8080/api/admin/users').subscribe();
```

**Resultado esperado**: 
- Toast rojo con mensaje "No autorizado. Por favor inicie sesión nuevamente"
- Redirección a `/auth/login`

### Prueba 3: Error 500 (Error del Servidor)

Simula un error en el backend o usa:

```typescript
// Forzar un error del servidor
this.http.post('http://localhost:8080/api/test-error', {}).subscribe();
```

**Resultado esperado**: Toast rojo con mensaje del backend o "Error interno del servidor"

### Prueba 4: Error de Red (Sin Conexión)

1. Desconecta tu conexión a internet o detén el backend
2. Intenta hacer cualquier petición HTTP

```typescript
this.http.get('http://localhost:8080/api/products').subscribe();
```

**Resultado esperado**: Toast rojo con "No se pudo conectar con el servidor. Verifique su conexión a internet"

### Prueba 5: Error con Mensaje Personalizado del Backend

El backend debe enviar:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El email ya está registrado en el sistema",
  "path": "/api/auth/register"
}
```

**Resultado esperado**: Toast rojo con "El email ya está registrado en el sistema"

### Prueba 6: Error con Detalles Adicionales

El backend debe enviar:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Errores de validación",
  "details": [
    "El campo email es requerido",
    "La contraseña debe tener al menos 8 caracteres"
  ],
  "path": "/api/auth/register"
}
```

**Resultado esperado**: Toast rojo con "Errores de validación: El campo email es requerido, La contraseña debe tener al menos 8 caracteres"

## Pruebas de Casos Especiales

### Caso 1: Múltiples Errores Simultáneos

```typescript
// Ejecutar varias peticiones que fallarán
this.http.get('/api/error1').subscribe();
this.http.get('/api/error2').subscribe();
this.http.get('/api/error3').subscribe();
```

**Resultado esperado**: Múltiples toasts apilados, cada uno con su mensaje

### Caso 2: Error durante 2FA

```typescript
// El backend responde con is2faRequired
{
  "is2faRequired": true,
  "message": "Se requiere código 2FA"
}
```

**Resultado esperado**: NO debe mostrarse toast (el componente maneja el flujo)

### Caso 3: Timeout

```typescript
// Configurar timeout corto
this.http.get('/api/slow-endpoint', { 
  timeout: 1000 
}).subscribe();
```

**Resultado esperado**: Toast con mensaje de timeout

## Checklist de Verificación

- [ ] El componente `<app-toast>` está en `app.component.html`
- [ ] `ToastComponent` está declarado y exportado en `SharedModule`
- [ ] `ErrorInterceptor` está registrado en `CoreModule`
- [ ] `NotificationService` está disponible como singleton (`providedIn: 'root'`)
- [ ] Los estilos del toast se cargan correctamente
- [ ] Las notificaciones se auto-cierran después de 5 segundos
- [ ] El botón de cerrar manual funciona
- [ ] Las animaciones de entrada/salida funcionan
- [ ] Los colores son correctos según el tipo de notificación
- [ ] El diseño es responsive en móviles

## Pruebas en Diferentes Navegadores

Verifica que funcione en:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (si estás en Mac)
- [ ] Versión móvil (Chrome Mobile/Safari Mobile)

## Pruebas de Accesibilidad

1. **Navegación por teclado**:
   - Presiona Tab hasta llegar al botón de cerrar
   - Presiona Enter para cerrar la notificación

2. **Lector de pantalla**:
   - Activa un lector de pantalla (NVDA, JAWS, VoiceOver)
   - Verifica que se anuncie el mensaje de la notificación

3. **Contraste de colores**:
   - Usa herramientas como WAVE o Lighthouse
   - Verifica que el contraste sea suficiente

## Debugging

### Si las notificaciones no aparecen:

1. **Verifica en la consola del navegador**:
```javascript
// Debe retornar el servicio
ng.probe(document.querySelector('app-root')).injector.get('NotificationService')
```

2. **Verifica que el componente existe**:
```javascript
// Debe retornar el elemento
document.querySelector('app-toast')
```

3. **Verifica los estilos**:
```javascript
// Debe mostrar los estilos del toast
getComputedStyle(document.querySelector('.toast-container'))
```

4. **Verifica el interceptor**:
- Abre Network tab en DevTools
- Haz una petición que falle
- Verifica que el interceptor capture el error

### Si los mensajes del backend no se muestran:

1. **Inspecciona la respuesta de error**:
```typescript
// En el interceptor, agrega temporalmente:
console.log('Error completo:', error);
console.log('Error.error:', error.error);
console.log('Mensaje extraído:', this.extractErrorMessage(error));
```

2. **Verifica el formato del backend**:
- Usa Postman o curl para hacer la petición
- Verifica que el JSON tenga el campo `message`

3. **Verifica los headers**:
- El backend debe enviar `Content-Type: application/json`

## Métricas de Éxito

El sistema funciona correctamente si:

1. ✓ Todos los errores HTTP muestran una notificación
2. ✓ Los mensajes del backend se extraen correctamente
3. ✓ Los errores de red se manejan apropiadamente
4. ✓ Las notificaciones se auto-cierran
5. ✓ El usuario puede cerrar manualmente
6. ✓ Múltiples notificaciones se apilan correctamente
7. ✓ El diseño es responsive
8. ✓ No hay errores en la consola
9. ✓ La experiencia de usuario es fluida

## Comandos Útiles para Testing

### Simular errores desde la consola del navegador:

```javascript
// Inyectar HttpClient
const http = ng.probe(document.querySelector('app-root')).injector.get('HttpClient');

// Error 404
http.get('http://localhost:8080/api/not-found').subscribe();

// Error 500
http.post('http://localhost:8080/api/error', {}).subscribe();

// Error de red (con backend detenido)
http.get('http://localhost:8080/api/test').subscribe();
```

### Ver todas las notificaciones activas:

```javascript
// En la consola
const toastComponent = ng.probe(document.querySelector('app-toast')).componentInstance;
console.log('Notificaciones activas:', toastComponent.notifications);
```

## Reporte de Problemas

Si encuentras algún problema, documenta:

1. Navegador y versión
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Captura de pantalla o video
5. Mensajes de error en la consola
6. Respuesta del backend (Network tab)

## Próximos Pasos

Una vez que todas las pruebas pasen:

1. Integra el sistema en todos tus componentes
2. Remueve console.logs de debugging
3. Documenta casos especiales en tu equipo
4. Considera agregar analytics para tracking de errores
5. Implementa tests unitarios y e2e
