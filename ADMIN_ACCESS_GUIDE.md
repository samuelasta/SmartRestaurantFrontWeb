# 🎯 Guía de Acceso al Módulo de Administración

## 📍 ¿Dónde encontrar las opciones de administración?

### 1. **Barra de Navegación Superior (Navbar)**

Después de iniciar sesión, verás una barra de navegación en la parte superior con:

```
🍴 Restaurant Manager | Dashboard | Inventario | Administración | Auditoría | [Usuario] ▼
```

#### Opciones disponibles para ADMIN:
- **Dashboard** → `/dashboard` - Vista principal con todas las tarjetas
- **Inventario** → `/inventory` - Gestión de productos
- **Administración** → `/admin/users` - Gestión de usuarios
- **Auditoría** → `/admin/audit-logs` - Logs de seguridad

#### Menú de Usuario (clic en tu nombre):
- 👤 Mi Perfil → `/auth/profile`
- 🏠 Dashboard → `/dashboard`
- 👥 Gestión de Usuarios → `/admin/users` (solo ADMIN)
- 🛡️ Auditoría → `/admin/audit-logs` (solo ADMIN)
- 🚪 Cerrar Sesión

---

### 2. **Dashboard Principal** (`/dashboard`)

Después de iniciar sesión, verás tarjetas con todas las secciones disponibles según tu rol:

#### Tarjetas para ADMIN:
1. 📦 **Inventario** - Gestión de productos
2. 🚚 **Proveedores** - Administración de proveedores
3. 🍝 **Platos** - Gestión del menú de platos
4. 🥤 **Bebidas** - Gestión del menú de bebidas
5. ➕ **Adiciones** - Extras y adiciones
6. 🍽️ **Menú del Día** - Gestión del menú diario
7. 📁 **Categorías** - Administración de categorías
8. ⚠️ **Alertas de Stock** - Productos con stock bajo
9. 👥 **Gestión de Usuarios** - Administrar empleados ← NUEVO
10. 🛡️ **Auditoría de Seguridad** - Logs del sistema ← NUEVO

---

## 🔐 Rutas de Administración

### Gestión de Usuarios
```
URL: http://localhost:4200/admin/users
```

**Funcionalidades:**
- ✅ Ver lista de todos los usuarios
- ✅ Filtrar por rol (ADMIN, KITCHEN, WAITER, CUSTOMER)
- ✅ Filtrar por estado (ACTIVE, INACTIVE, PENDING, BANNED)
- ✅ Registrar nuevo empleado
- ✅ Editar información de usuario
- ✅ Cambiar rol de usuario
- ✅ Activar/Desactivar usuario
- ✅ Ver detalles completos de un usuario

### Auditoría de Seguridad
```
URL: http://localhost:4200/admin/audit-logs
```

**Funcionalidades:**
- ✅ Ver todos los logs de auditoría
- ✅ Filtrar por tipo de vista:
  - Todos los logs
  - Eventos fallidos
  - Eventos críticos
  - Por tipo de evento
  - Por rango de fechas
- ✅ Paginación de resultados
- ✅ Ver detalles de cada evento

### Mi Perfil
```
URL: http://localhost:4200/auth/profile
```

**Funcionalidades:**
- ✅ Ver información personal
- ✅ Editar nombre y apellido
- ✅ Ver estado de cuenta
- ✅ Acceso rápido a cambio de contraseña

---

## 🚀 Cómo Acceder (Paso a Paso)

### Opción 1: Desde el Dashboard
1. Inicia sesión en `http://localhost:4200`
2. Serás redirigido al dashboard
3. Busca las tarjetas **"Gestión de Usuarios"** o **"Auditoría de Seguridad"**
4. Haz clic en la tarjeta deseada

### Opción 2: Desde la Navbar
1. Inicia sesión en `http://localhost:4200`
2. En la barra superior, haz clic en **"Administración"** o **"Auditoría"**
3. Serás redirigido a la sección correspondiente

### Opción 3: Desde el Menú de Usuario
1. Inicia sesión en `http://localhost:4200`
2. Haz clic en tu nombre en la esquina superior derecha
3. Selecciona **"Gestión de Usuarios"** o **"Auditoría"**

### Opción 4: URL Directa
1. Inicia sesión primero
2. Navega directamente a:
   - `http://localhost:4200/admin/users`
   - `http://localhost:4200/admin/audit-logs`
   - `http://localhost:4200/auth/profile`

---

## 🎨 Elementos Visuales

### Navbar (Barra Superior)
- **Color**: Gradiente púrpura (#667eea → #764ba2)
- **Posición**: Fija en la parte superior
- **Contenido**: Logo, menú de navegación, información del usuario

### Dashboard Cards
- **Diseño**: Grid responsive de tarjetas
- **Colores**: Cada sección tiene su color distintivo
- **Interacción**: Hover effect y cursor pointer

### Dropdown de Usuario
- **Activación**: Clic en el nombre del usuario
- **Contenido**: Perfil, Dashboard, Opciones de Admin, Cerrar Sesión
- **Animación**: Slide down suave

---

## ⚠️ Notas Importantes

1. **Solo usuarios con rol ADMIN** pueden ver:
   - Tarjetas de "Gestión de Usuarios" y "Auditoría" en el dashboard
   - Links de "Administración" y "Auditoría" en la navbar
   - Opciones de admin en el menú de usuario

2. **Todos los usuarios autenticados** pueden ver:
   - Dashboard
   - Inventario (según su rol)
   - Mi Perfil
   - Cerrar Sesión

3. **La navbar se oculta** en las páginas de autenticación:
   - Login
   - Registro
   - Verificación de cuenta
   - Recuperación de contraseña

---

## 🐛 Solución de Problemas

### Pantalla en blanco
1. Abre la consola del navegador (F12)
2. Revisa si hay errores de compilación
3. Verifica que el servidor de desarrollo esté corriendo: `ng serve`
4. Limpia la caché: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)

### No veo las opciones de admin
1. Verifica que tu usuario tenga rol **ADMIN**
2. Cierra sesión y vuelve a iniciar sesión
3. Revisa la consola del navegador para errores

### La navbar no aparece
1. Verifica que estés en una ruta autenticada (no en `/auth/login`)
2. Revisa que el SharedModule esté importado en app.module.ts
3. Verifica que no haya errores de compilación

---

## 📱 Responsive Design

La navbar y el dashboard están optimizados para:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (< 768px)

En dispositivos móviles:
- El menú de navegación se oculta
- Solo se muestra el logo y el menú de usuario
- Las tarjetas del dashboard se apilan verticalmente

---

## ✅ Checklist de Verificación

- [ ] El servidor de desarrollo está corriendo (`ng serve`)
- [ ] Has iniciado sesión con un usuario ADMIN
- [ ] La navbar aparece en la parte superior
- [ ] Puedes ver tu nombre y rol en la navbar
- [ ] El dashboard muestra las tarjetas de administración
- [ ] Puedes hacer clic en las tarjetas y navegar
- [ ] El menú dropdown del usuario funciona
- [ ] Puedes acceder a `/admin/users` y `/admin/audit-logs`

---

## 🎉 ¡Listo!

Ahora tienes acceso completo al módulo de administración desde múltiples puntos de entrada. La interfaz es intuitiva y sigue los patrones de diseño del resto de la aplicación.
