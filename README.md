# SmartRestaurante Frontend

Sistema de gestión para restaurantes - Frontend desarrollado en Angular.

## Arquitectura

El proyecto sigue una arquitectura modular con:

- **Core Module**: Servicios singleton, guards e interceptors
- **Shared Module**: Componentes, directivas y pipes reutilizables
- **Feature Modules**: Módulos de negocio (Auth, Inventory)

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/              # Servicios singleton y configuración
│   ├── shared/            # Componentes y utilidades compartidas
│   └── features/          # Módulos de negocio
│       ├── auth/          # Autenticación
│       └── inventory/     # Inventario
```

## Comandos

- `npm install` - Instalar dependencias
- `npm start` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm test` - Ejecutar pruebas

## Desarrollo

Este proyecto fue generado con Angular CLI.
