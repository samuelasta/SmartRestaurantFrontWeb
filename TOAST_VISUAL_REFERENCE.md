# Referencia Visual - Sistema de Notificaciones Toast

## Apariencia de las Notificaciones

### 🟢 Success (Éxito)
```
┌─────────────────────────────────────────┐
│ ┌───┐                              ×   │
│ │ ✓ │  Producto creado exitosamente     │
│ └───┘                                   │
└─────────────────────────────────────────┘
```
- **Color**: Verde (#10b981)
- **Icono**: ✓ (check)
- **Borde izquierdo**: Verde sólido
- **Fondo del icono**: Verde claro (#d1fae5)

**Cuándo usar**:
- Operación completada exitosamente
- Datos guardados correctamente
- Acción confirmada
- Proceso finalizado

**Ejemplos**:
- "Producto creado exitosamente"
- "Perfil actualizado correctamente"
- "Pedido procesado con éxito"
- "Cambios guardados"

---

### 🔴 Error
```
┌─────────────────────────────────────────┐
│ ┌───┐                              ×   │
│ │ ✕ │  El email ya está registrado      │
│ └───┘                                   │
└─────────────────────────────────────────┘
```
- **Color**: Rojo (#ef4444)
- **Icono**: ✕ (cruz)
- **Borde izquierdo**: Rojo sólido
- **Fondo del icono**: Rojo claro (#fee2e2)

**Cuándo usar**:
- Error en la operación
- Validación fallida del servidor
- Credenciales incorrectas
- Recurso no encontrado
- Error del servidor

**Ejemplos**:
- "El email ya está registrado"
- "Credenciales incorrectas"
- "No se pudo conectar con el servidor"
- "Error al procesar el pago"

---

### 🟡 Warning (Advertencia)
```
┌─────────────────────────────────────────┐
│ ┌───┐                              ×   │
│ │ ⚠ │  Stock bajo: solo quedan 3 unid.  │
│ └───┘                                   │
└─────────────────────────────────────────┘
```
- **Color**: Amarillo/Naranja (#f59e0b)
- **Icono**: ⚠ (triángulo de advertencia)
- **Borde izquierdo**: Amarillo sólido
- **Fondo del icono**: Amarillo claro (#fef3c7)

**Cuándo usar**:
- Advertencias importantes
- Validaciones del cliente
- Campos incompletos
- Acciones que requieren atención
- Límites alcanzados

**Ejemplos**:
- "Complete todos los campos requeridos"
- "Stock bajo: solo quedan 3 unidades"
- "La sesión expirará en 5 minutos"
- "Algunos cambios no se guardaron"

---

### 🔵 Info (Información)
```
┌─────────────────────────────────────────┐
│ ┌───┐                              ×   │
│ │ ℹ │  Procesando solicitud...          │
│ └───┘                                   │
└─────────────────────────────────────────┘
```
- **Color**: Azul (#3b82f6)
- **Icono**: ℹ (información)
- **Borde izquierdo**: Azul sólido
- **Fondo del icono**: Azul claro (#dbeafe)

**Cuándo usar**:
- Información general
- Procesos en curso
- Recordatorios
- Tips o sugerencias
- Confirmaciones neutrales

**Ejemplos**:
- "Procesando solicitud..."
- "Tiene 5 tareas pendientes"
- "Recuerde guardar los cambios"
- "Nueva versión disponible"

---

## Comportamiento Visual

### Animación de Entrada
```
[Fuera de pantalla] ──→ [Desliza desde derecha] ──→ [Posición final]
     (invisible)              (0.3s)                  (visible)
```

### Animación de Salida
```
[Posición final] ──→ [Desliza hacia derecha] ──→ [Fuera de pantalla]
    (visible)              (0.3s)                  (invisible)
```

### Múltiples Notificaciones
```
┌─────────────────────────────────────────┐  ← Más reciente (arriba)
│ ┌───┐                              ×   │
│ │ ✓ │  Producto creado exitosamente     │
│ └───┘                                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ┌───┐                              ×   │
│ │ ℹ │  Guardando cambios...             │
│ └───┘                                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐  ← Más antigua (abajo)
│ ┌───┐                              ×   │
│ │ ⚠ │  Verifique los datos              │
│ └───┘                                   │
└─────────────────────────────────────────┘
```

---

## Posicionamiento

### Desktop (> 768px)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                    ┌──────────────┐ │
│                                    │ Toast 1      │ │
│                                    └──────────────┘ │
│                                                     │
│                                    ┌──────────────┐ │
│                                    │ Toast 2      │ │
│                                    └──────────────┘ │
│                                                     │
│                                                     │
│                                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```
- Posición: Superior derecha
- Margen: 20px desde arriba y derecha
- Ancho máximo: 400px
- Gap entre toasts: 10px

### Mobile (≤ 768px)
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ Toast 1 (ancho completo)        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Toast 2 (ancho completo)        │ │
│ └─────────────────────────────────┘ │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```
- Posición: Superior centro
- Margen: 10px desde todos los lados
- Ancho: 100% (menos márgenes)
- Gap entre toasts: 10px

---

## Interacciones

### Hover sobre el Toast
```
┌─────────────────────────────────────────┐
│ ┌───┐                          ┌───┐   │
│ │ ✓ │  Producto creado         │ × │   │  ← Botón resaltado
│ └───┘                          └───┘   │
└─────────────────────────────────────────┘
```
- El botón de cerrar se resalta con fondo gris claro

### Click en el botón de cerrar
```
[Toast visible] ──→ [Animación salida] ──→ [Removido del DOM]
                         (0.3s)
```

### Auto-cierre (5 segundos)
```
[Aparece] ──→ [Visible 5s] ──→ [Animación salida] ──→ [Removido]
   0s            5s                5.3s                5.6s
```

---

## Anatomía del Toast

```
┌─────────────────────────────────────────────────────┐
│ │                                                    │
│ │  ┌────────┐  ┌──────────────────────┐  ┌──────┐  │
│ │  │        │  │                      │  │      │  │
│ │  │  Icon  │  │      Message         │  │  ×   │  │
│ │  │        │  │                      │  │      │  │
│ │  └────────┘  └──────────────────────┘  └──────┘  │
│ │                                                    │
│ │   32x32px         Flex: 1              24x24px    │
│ │   Circular        Word wrap            Button     │
│ │   Colored bg      Max 2 lines          Hover      │
│ │                                                    │
└─────────────────────────────────────────────────────┘
 ↑
 Borde izquierdo (4px, color según tipo)
```

### Dimensiones:
- **Padding**: 16px
- **Border-radius**: 8px
- **Box-shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)
- **Min-width**: 300px (desktop)
- **Max-width**: 400px (desktop)
- **Borde izquierdo**: 4px sólido

### Espaciado interno:
- **Icon → Message**: 12px
- **Message → Close button**: 12px

---

## Ejemplos de Mensajes Reales

### ✅ Casos de Éxito
```
┌─────────────────────────────────────────┐
│ ✓  Usuario registrado exitosamente      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓  Contraseña actualizada correctamente │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✓  Pedido #1234 procesado con éxito     │
└─────────────────────────────────────────┘
```

### ❌ Casos de Error
```
┌─────────────────────────────────────────┐
│ ✕  El email ya está registrado          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✕  No se pudo conectar con el servidor  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✕  Credenciales incorrectas             │
└─────────────────────────────────────────┘
```

### ⚠️ Casos de Advertencia
```
┌─────────────────────────────────────────┐
│ ⚠  Complete todos los campos requeridos │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚠  Stock bajo: solo quedan 3 unidades   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ⚠  La sesión expirará en 5 minutos      │
└─────────────────────────────────────────┘
```

### ℹ️ Casos Informativos
```
┌─────────────────────────────────────────┐
│ ℹ  Procesando solicitud...              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ℹ  Tiene 5 tareas pendientes            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ℹ  Sincronización completada            │
└─────────────────────────────────────────┘
```

---

## Paleta de Colores

### Success (Verde)
- **Principal**: #10b981
- **Fondo icono**: #d1fae5
- **Texto**: #333333

### Error (Rojo)
- **Principal**: #ef4444
- **Fondo icono**: #fee2e2
- **Texto**: #333333

### Warning (Amarillo)
- **Principal**: #f59e0b
- **Fondo icono**: #fef3c7
- **Texto**: #333333

### Info (Azul)
- **Principal**: #3b82f6
- **Fondo icono**: #dbeafe
- **Texto**: #333333

### Elementos comunes
- **Fondo toast**: #ffffff
- **Texto**: #333333
- **Botón cerrar**: #666666
- **Botón cerrar hover**: rgba(0, 0, 0, 0.05)
- **Sombra**: rgba(0, 0, 0, 0.15)

---

## Accesibilidad

### Contraste de Colores
Todos los colores cumplen con WCAG 2.1 nivel AA:
- ✅ Texto sobre fondo blanco: 4.5:1 mínimo
- ✅ Iconos sobre fondo coloreado: 3:1 mínimo
- ✅ Borde sobre fondo blanco: 3:1 mínimo

### Navegación por Teclado
```
Tab ──→ [Enfoca botón cerrar] ──→ Enter/Space ──→ [Cierra toast]
```

### Lectores de Pantalla
```
"Notificación de éxito: Producto creado exitosamente. Botón cerrar."
```

---

## Personalización Rápida

### Cambiar Duración
```typescript
// En toast.component.ts, línea 37
setTimeout(() => {
  this.removeNotification(toast.id);
}, 5000); // ← Cambiar este valor (en milisegundos)
```

### Cambiar Posición
```scss
// En toast.component.scss
.toast-container {
  position: fixed;
  top: 20px;     // ← Superior
  right: 20px;   // ← Derecha
  
  // Para inferior derecha:
  // bottom: 20px;
  // right: 20px;
  
  // Para superior izquierda:
  // top: 20px;
  // left: 20px;
}
```

### Cambiar Colores
```scss
// En toast.component.scss
.toast-success {
  border-left: 4px solid #10b981; // ← Color del borde
  
  .toast-icon {
    background-color: #d1fae5;    // ← Fondo del icono
    color: #10b981;               // ← Color del icono
  }
}
```

---

## Comparación con Otros Sistemas

### vs Alert Nativo del Navegador
```
Alert Nativo:          Toast:
┌──────────────┐      ┌─────────────────────────┐
│ ⚠ Alerta     │      │ ✓ Operación exitosa     │
│              │      └─────────────────────────┘
│ Mensaje      │      
│              │      ✅ No bloquea la UI
│  [Aceptar]   │      ✅ Auto-cierre
└──────────────┘      ✅ Múltiples simultáneos
                      ✅ Mejor diseño
❌ Bloquea UI         ✅ Más profesional
❌ Requiere click
❌ Feo
```

### vs Console.log
```
Console.log:           Toast:
(Solo en DevTools)     (Visible para el usuario)

❌ Usuario no lo ve    ✅ Usuario lo ve
❌ Solo para devs      ✅ Para usuarios finales
✅ Para debugging      ✅ Para feedback
```

---

## Mejores Prácticas Visuales

### ✅ Hacer
- Mensajes cortos y claros (máximo 2 líneas)
- Usar el tipo correcto de notificación
- Incluir contexto relevante ("Producto 'iPhone' eliminado")
- Mantener consistencia en el tono

### ❌ Evitar
- Mensajes técnicos para usuarios finales
- Notificaciones excesivas (spam)
- Mensajes genéricos ("Error", "OK")
- Texto muy largo que requiera scroll

---

## Inspiración de Diseño

Este diseño está inspirado en:
- Material Design (Google)
- Ant Design (Alibaba)
- Chakra UI
- Tailwind UI

Con adaptaciones para mejor UX y accesibilidad.
