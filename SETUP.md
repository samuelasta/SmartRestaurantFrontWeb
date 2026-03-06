# Setup del Proyecto Frontend - SmartRestaurante

## Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v17 o superior)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
   - Editar `src/environments/environment.ts` para desarrollo
   - Editar `src/environments/environment.prod.ts` para producción

## Comandos Disponibles

### Desarrollo
```bash
npm start
# o
ng serve
```
El servidor de desarrollo estará disponible en `http://localhost:4200/`

### Compilación
```bash
npm run build
# o
ng build
```
Los archivos compilados estarán en el directorio `dist/`

### Compilación para Producción
```bash
ng build --configuration production
```

### Pruebas
```bash
npm test
# o
ng test
```

### Linting
```bash
ng lint
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/              # Servicios singleton, guards, interceptors
│   ├── shared/            # Componentes, directivas y pipes compartidos
│   └── features/          # Módulos de negocio
│       ├── auth/          # Módulo de autenticación
│       └── inventory/     # Módulo de inventario
├── assets/                # Recursos estáticos
├── environments/          # Configuración de entornos
└── styles/                # Estilos globales
```

## Características Principales

### Módulo Core
- Guards de autenticación y roles
- Interceptors HTTP (Auth, Error, Loading)
- Servicios globales (Storage, Notification, HttpClient)

### Módulo Shared
- Componentes de layout (Header, Footer, Sidebar)
- Componentes UI reutilizables (Button, Modal, Table, etc.)
- Directivas y pipes personalizados

### Módulo Auth
- Login
- Registro
- Verificación de cuenta
- Recuperación de contraseña
- Cambio de contraseña

### Módulo Inventory
- Listado de productos
- Detalle de producto
- Formulario de creación/edición
- Gestión de categorías
- Alertas de stock bajo

## Configuración del Backend

Por defecto, el frontend se conecta a `http://localhost:8080/api`

Para cambiar la URL del backend, edita:
- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

## Próximos Pasos

1. Ejecutar `npm install` para instalar todas las dependencias
2. Configurar la URL del backend en los archivos de environment
3. Ejecutar `npm start` para iniciar el servidor de desarrollo
4. Navegar a `http://localhost:4200/`

## Notas Importantes

- El proyecto usa lazy loading para los módulos de features
- Los guards protegen las rutas que requieren autenticación
- Los interceptors manejan automáticamente los tokens JWT
- El módulo Core solo debe importarse una vez en AppModule
