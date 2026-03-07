# 📋 Documentación del Backend de Inventario - Smart Restaurant

> **Nota Importante**: Este documento es exclusivamente para el desarrollo del **módulo de inventario**. El sistema de autenticación (login, registro, tokens, permisos) ya está implementado y **NO debe incluirse** en el frontend de inventario.

---

## 1. TECNOLOGÍAS UTILIZADAS

### Stack Tecnológico del Backend

| Tecnología | Detalle |
|------------|---------|
| **Lenguaje** | Java 21 |
| **Framework** | Spring Boot 3.4.2 |
| **ORM** | Spring Data JPA |
| **Base de Datos** | PostgreSQL |
| **Validaciones** | Jakarta Bean Validation + Hibernate Validator |
| **Mapeo Objecto-DTO** | MapStruct |
| **Build Tool** | Maven |
| **Lombok** | Para generación automática de getters/setters |

---

## 2. ESTRUCTURA DE DATOS (MODELOS/ENTIDADES)

### 2.1 Enum State
Todos los recursos tienen un campo `state` de tipo enumerado:
```java
public enum State {
    ACTIVE,   // Recurso disponible/visible
    INACTIVE  // Recurso eliminado/deshabilitado
}
```

### 2.2 Enum Type (Movimientos de Inventario)
```java
public enum Type {
    ENTRY,  // Entrada de inventario
    EXIT    // Salida de inventario
}
```

---

### 2.3 Entidad: Product (Producto)

**Descripción**: Representa los productos del inventario (materias primas).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK, Nullable=false | Identificador único |
| `name` | String | Nullable=false, Longitud=100 | Nombre del producto |
| `description` | String | Nullable=false, Longitud=100 | Descripción del producto |
| `price` | double | Nullable=false, Positive | Precio del producto |
| `weight` | double | Nullable=false, Positive | Cantidad en stock (peso/unidades) |
| `photos` | List\<String\> | Nullable=false | URLs de fotos del producto |
| `state` | State | Nullable=false | Estado ACTIVE/INACTIVE |
| `minimumStock` | double | Nullable=false, Positive | Stock mínimo para alerta |
| `suplier` | Suplier | ManyToOne | Proveedor asociado |

**Relaciones**:
- `Product` → `Suplier` (ManyToOne): Un producto tiene un proveedor
- `Product` → `Recipe` (OneToMany): Un producto puede estar en varias recetas

---

### 2.4 Entidad: Suplier (Proveedor)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK | Identificador único |
| `name` | String | Nullable=false, Longitud=30 | Nombre del proveedor |
| `address` | String | Nullable=false, Longitud=50 | Dirección del proveedor |
| `phone` | String | Nullable=false, Longitud=10 | Teléfono de contacto |
| `email` | String | Nullable=false, @Email | Correo electrónico |
| `state` | State | Nullable=false | Estado ACTIVE/INACTIVE |

---

### 2.5 Entidad: Category (Categoría)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK | Identificador único |
| `name` | String | Nullable=false, Longitud=100 | Nombre de la categoría |
| `description` | String | Nullable=false, Longitud=300 | Descripción de la categoría |
| `createdAt` | LocalDateTime | Nullable=false | Fecha de creación |
| `state` | State | Nullable=false | Estado ACTIVE/INACTIVE |

**Relaciones**:
- `Category` → `Dish` (OneToMany): Una categoría puede tener muchos platos
- `Category` → `Drink` (OneToMany): Una categoría puede tener muchas bebidas

---

### 2.6 Entidad: Dish (Plato)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK | Identificador único |
| `name` | String | Nullable=false, Longitud=50 | Nombre del plato |
| `description` | String | Nullable=false, Longitud=500 | Descripción del plato |
| `price` | String | Nullable=false, Positive | Precio del plato |
| `photos` | List\<String\> | Nullable=false | URLs de fotos del plato |
| `state` | State | Nullable=false | Estado ACTIVE/INACTIVE |
| `category` | Category | ManyToOne | Categoría del plato |

**Relaciones**:
- `Dish` → `Category` (ManyToOne): Un plato pertenece a una categoría
- `Dish` → `Recipe` (OneToMany, EAGER): Un plato tiene varias recetas (ingredientes)

---

### 2.7 Entidad: Drink (Bebida)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK | Identificador único |
| `name` | String | Nullable=false, Longitud=50 | Nombre de la bebida |
| `description` | String | Nullable=false, Longitud=500 | Descripción de la bebida |
| `mililiters` | double | Nullable=false, Positive | Volumen en mililitros |
| `alcohol` | boolean | Nullable=false | Indica si contiene alcohol |
| `state` | State | Nullable=false | Estado ACTIVE/INACTIVE |
| `photos` | List\<String\> | Nullable=false | URLs de fotos de la bebida |
| `units` | int | Nullable=false, Positive | Cantidad de unidades en stock |
| `category` | Category | ManyToOne, Nullable=false | Categoría de la bebida |

---

### 2.8 Entidad: Addition (Adición/Extra)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK, Unique=true | Identificador único |
| `name` | String | Nullable=false, Longitud=100 | Nombre de la adición |
| `description` | String | Nullable=false, Longitud=500 | Descripción de la adición |
| `price` | double | Nullable=false | Precio de la adición |
| `createdAt` | LocalDateTime | Nullable=false | Fecha de creación |
| `state` | State | Nullable=false | Estado ACTIVE/INACTIVE |
| `photos` | List\<String\> | Nullable=false | URLs de fotos |

---

### 2.9 Entidad: Recipe (Receta)

**Descripción**: Define los ingredientes (products) necesarios para preparar un plato.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK | Identificador único |
| `dish` | Dish | ManyToOne | Plato al que pertenece |
| `product` | Product | ManyToOne | Producto ingrediente |
| `weight` | double | Nullable=false | Cantidad del producto necesaria |
| `unit` | String | Nullable=false | Unidad de medida |
| `state` | State | Nullable=false | Estado (por defecto ACTIVE) |

**Relaciones**:
- `Recipe` → `Dish` (ManyToOne)
- `Recipe` → `Product` (ManyToOne)

---

### 2.10 Entidad: InventoryMovement (Movimiento de Inventario)

**Descripción**: Registra entradas y salidas de productos del inventario.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | String | PK | Identificador único |
| `productId` | String | Nullable=false | ID del producto involucrado |
| `type` | Type | Nullable=false | ENTRY o EXIT |
| `weight` | double | Nullable=false, Positive | Cantidad movida |
| `timeAt` | LocalDateTime | Nullable=false | Fecha/hora del movimiento |
| `user` | User | ManyToOne, Nullable=false | Usuario que realizó el movimiento |
| `reason` | String | Nullable=false, Longitud=100 | Razón del movimiento |

---

## 3. DATA TRANSFER OBJECTS (DTOS)

### 3.1 Estructura de Respuesta Global

Todos los endpoints devuelven un objeto con esta estructura:

```java
public record ResponseDTO<T>(T message, Boolean error) {}
```

**Ejemplo de respuesta exitosa:**
```json
{
  "message": [
    { "id": "1", "name": "Producto 1", ... }
  ],
  "error": false
}
```

**Ejemplo de respuesta con error:**
```json
{
  "message": "Producto no encontrado",
  "error": true
}
```

---

### 3.2 DTOs de PRODUCT

#### CreateProductDTO (Crear Producto)
```java
public record CreateProductDTO(
    @NotBlank @Length(min = 1, max = 50)
    String name,
    
    @NotBlank @Length(min = 10, max = 500)
    String description,
    
    @Positive @NotNull
    double price,
    
    @Positive @NotNull
    double weight,
    
    @NotNull @Size(min = 1, max = 10)
    List<String> photos,
    
    @Positive @NotNull
    double minimumStock
) {}
```

#### UpdateProductDTO (Actualizar Producto)
```java
public record UpdateProductDTO(
    @NotBlank @Length(min = 1, max = 50)
    String name,
    
    @NotBlank @Length(min = 10, max = 500)
    String description,
    
    @Positive @NotNull
    double price,
    
    @Positive @NotNull
    double weight,
    
    @NotNull @Size(min = 1, max = 10)
    List<String> photos,
    
    @Positive @NotNull
    double minimumStock
) {}
```

#### GetProductDTO (Listar Productos - Resumen)
```java
public record GetProductDTO(
    String id,
    String name,
    double price,
    double weight,
    String photo,
    double minimumStock,
    String state
) {}
```

#### GetProductDetailDTO (Detalle de Producto)
```java
public record GetProductDetailDTO(
    String id,
    String name,
    String description,
    double price,
    double weight,
    List<String> photos,
    double minimumStock,
    String state,
    GetSuplierDTO suplier
) {}
```

#### StockMovementDTO (Movimiento de Stock)
```java
public record StockMovementDTO(
    @Positive @NotNull
    double weight
) {}
```

---

### 3.3 DTOs de CATEGORÍA

#### CreateCategoryDTO
```java
public record CreateCategoryDTO(
    @NotBlank @Length(min = 1, max = 100)
    String name,
    
    @NotBlank @Length(min = 10, max = 500)
    String description
) {}
```

#### UpdateCategoryDTO
```java
public record UpdateCategoryDTO(
    @NotBlank @Length(min = 1, max = 100)
    String name,
    
    @NotBlank @Length(min = 10, max = 500)
    String description
) {}
```

#### GetCategoriesDTO
```java
public record GetCategoriesDTO(
    String id,
    String name,
    String description
) {}
```

---

### 3.4 DTOs de PROVEEDOR

#### CreateSuplierDTO
```java
public record CreateSuplierDTO(
    @NotBlank @Length(min = 1, max = 50)
    String name,
    
    @NotBlank @Length(min = 1, max = 50)
    String address,
    
    @NotBlank @Length(min = 1, max = 10)
    String phone,
    
    @NotBlank @Email @Length(min = 1, max = 50)
    String email
) {}
```

#### UpdateSuplierDTO
```java
public record UpdateSuplierDTO(
    @NotBlank @Length(min = 1, max = 50)
    String name,
    
    @NotBlank @Length(min = 1, max = 50)
    String address,
    
    @NotBlank @Length(min = 1, max = 10)
    String phone,
    
    @NotBlank @Email @Length(min = 1, max = 50)
    String email
) {}
```

#### GetSuplierDTO
```java
public record GetSuplierDTO(
    String id,
    String name,
    String address,
    String phone,
    String email
) {}
```

---

### 3.5 DTOs de PLATO

#### CreateDishDTO
```java
public record CreateDishDTO(
    @NotBlank @Length(min = 1, max = 100)
    String name,
    
    @NotBlank @Length(min = 10, max = 100)
    String description,
    
    @Positive @NotNull
    double price,
    
    @NotEmpty @Size(min = 1, max = 10)
    List<String> photos,
    
    @NotEmpty
    List<CreateRecipeDTO> ingredients
) {}
```

#### UpdateDishDTO
```java
public record UpdateDishDTO(
    @NotBlank @Length(min = 1, max = 100)
    String name,
    
    @NotBlank @Length(min = 10, max = 100)
    String description,
    
    @Positive @NotNull
    double price,
    
    @NotEmpty @Size(min = 1, max = 10)
    List<String> photos,
    
    @NotEmpty
    List<CreateRecipeDTO> ingredients
) {}
```

#### GetDishDTO
```java
public record GetDishDTO(
    String id,
    String name,
    String price,
    String photo
) {}
```

#### GetDishDetailDTO
```java
public record GetDishDetailDTO(
    String id,
    String name,
    String description,
    String price,
    List<String> photos,
    List<GetRecipeDTO> ingredients,
    String categoryName
) {}
```

#### CreateRecipeDTO (Ingredientes de Plato)
```java
public record CreateRecipeDTO(
    String product_id,
    double quantity,
    String unit
) {}
```

#### GetRecipeDTO
```java
public record GetRecipeDTO(
    String productId,
    String productName,
    double quantity,
    String unit
) {}
```

---

### 3.6 DTOs de BEBIDA

#### CreateDrinkDTO
```java
public record CreateDrinkDTO(
    @NotBlank @Length(min = 1, max = 50)
    String name,
    
    @NotBlank @Length(min = 10, max = 500)
    String description,
    
    @Positive @NotNull
    double mililiters,
    
    @NotNull
    boolean alcohol,
    
    @NotNull @Size(min = 1, max = 3)
    List<String> photos,
    
    @NotNull @Positive
    int units
) {}
```

#### UpdateDrinkDTO
```java
public record UpdateDrinkDTO(
    @NotBlank @Length(min = 1, max = 50)
    String name,
    
    @NotBlank @Length(min = 10, max = 500)
    String description,
    
    @Positive @NotNull
    double mililiters,
    
    @NotNull
    boolean alcohol,
    
    @NotNull @Size(min = 1, max = 3)
    List<String> photos,
    
    @NotNull @Positive
    int units
) {}
```

#### GetDrinkDTO
```java
public record GetDrinkDTO(
    String id,
    String name,
    double mililiters,
    boolean alcohol,
    String photo,
    int units,
    String state
) {}
```

#### GetDrinkDetailDTO
```java
public record GetDrinkDetailDTO(
    String id,
    String name,
    String description,
    double mililiters,
    boolean alcohol,
    String photo,
    int units,
    String state,
    String categoryName
) {}
```

---

### 3.7 DTOs de ADICIÓN

#### CreateAdditionDTO
```java
public record CreateAdditionDTO(
    @Length(min = 1, max = 100) @NotBlank(message = "El nombre no puede estar vacío")
    String name,
    
    @Length(max = 500) @NotBlank(message = "La descripción no puede estar vacía")
    String description,
    
    @NotNull @Positive
    double price
) {}
```

#### UpdateAdditionDTO
```java
public record UpdateAdditionDTO(
    @Length(min = 1, max = 100) @NotBlank(message = "El nombre no puede estar vacío")
    String name,
    
    @Length(max = 500) @NotBlank(message = "La descripción no puede estar vacía")
    String description,
    
    @NotNull @Positive
    double price
) {}
```

#### GetAdditionDTO
```java
public record GetAdditionDTO(
    String id,
    String name,
    String photo,
    double price
) {}
```

#### GetAdditionDetailDTO
```java
public record GetAdditionDetailDTO(
    String id,
    String name,
    String description,
    List<String> photos,
    double price
) {}
```

---

### 3.8 DTOs de MOVIMIENTO DE INVENTARIO

#### GetInventoryMovementDTO
```java
public record GetInventoryMovementDTO(
    String id,
    String productId,
    String type,        // "ENTRY" o "EXIT"
    double weight,
    LocalDateTime timeAt,
    String userName,
    String reason
) {}
```

---

## 4. ENDPOINTS (API REST)

### 4.1 Endpoints de PRODUCTOS

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/products/{idSuplier}/supliers` | Crear producto asociado a proveedor |
| `PUT` | `/api/products/{id}` | Actualizar producto |
| `DELETE` | `/api/products/{id}` | Eliminar (desactivar) producto |
| `GET` | `/api/products/{page}/page` | Listar productos paginados (10 por página) |
| `PATCH` | `/api/products/{id}/add` | Añadir stock al producto |
| `PATCH` | `/api/products/{id}/discount` | Descontar stock del producto |
| `GET` | `/api/products/{id}` | Obtener detalle de un producto |

**Ejemplo - Crear Producto:**
```http
POST /api/products/{idSuplier}/supliers
Content-Type: application/json

{
  "name": "Arroz",
  "description": "Arroz blanco de primera calidad",
  "price": 5000.0,
  "weight": 50.0,
  "photos": ["https://cloudinary.com/img1.jpg"],
  "minimumStock": 10.0
}
```

**Ejemplo - Añadir Stock:**
```http
PATCH /api/products/{id}/add
Content-Type: application/json

{
  "weight": 25.0
}
```

**Ejemplo - Descontar Stock:**
```http
PATCH /api/products/{id}/discount
Content-Type: application/json

{
  "weight": 10.0
}
```

---

### 4.2 Endpoints de CATEGORÍAS

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/categories` | Listar todas las categorías activas |
| `POST` | `/api/categories` | Crear nueva categoría |
| `PUT` | `/api/categories/{id}` | Actualizar categoría |
| `DELETE` | `/api/categories/{id}` | Eliminar (desactivar) categoría |
| `GET` | `/api/categories/{id}` | Obtener detalle de categoría |

---

### 4.3 Endpoints de PROVEEDORES

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/supliers` | Listar todos los proveedores activos |
| `POST` | `/api/supliers` | Crear nuevo proveedor |
| `PUT` | `/api/supliers/{id}` | Actualizar proveedor |
| `DELETE` | `/api/supliers/{id}` | Eliminar (desactivar) proveedor |
| `GET` | `/api/supliers/{id}` | Obtener detalle de proveedor |

---

### 4.4 Endpoints de PLATOS

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/dishes/{page}/page` | Listar platos paginados (10 por página) |
| `POST` | `/api/dishes/{categoryId}/categories` | Crear plato en categoría |
| `PUT` | `/api/dishes/{id}` | Actualizar plato |
| `DELETE` | `/api/dishes/{id}` | Eliminar (desactivar) plato |
| `GET` | `/api/dishes/{id}` | Obtener detalle de plato |

**Ejemplo - Crear Plato:**
```http
POST /api/dishes/{categoryId}/categories
Content-Type: application/json

{
  "name": "Bandeja Paisa",
  "description": "Plato tradicional paisa con todos los acompañamiento",
  "price": 25000.0,
  "photos": ["https://cloudinary.com/plato1.jpg"],
  "ingredients": [
    { "product_id": "id-producto-1", "quantity": 200, "unit": "g" },
    { "product_id": "id-producto-2", "quantity": 100, "unit": "g" }
  ]
}
```

---

### 4.5 Endpoints de BEBIDAS

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/drinks/{page}/page` | Listar bebidas paginadas (10 por página) |
| `POST` | `/api/drinks/{categorieId}/categories` | Crear bebida en categoría |
| `PUT` | `/api/drinks/{id}` | Actualizar bebida |
| `DELETE` | `/api/drinks/{id}` | Eliminar (desactivar) bebida |
| `GET` | `/api/drinks/{id}` | Obtener detalle de bebida |

---

### 4.6 Endpoints de ADICIONES

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/additions/{page}/page` | Listar adiciones paginadas (10 por página) |
| `POST` | `/api/additions` | Crear nueva adición |
| `PUT` | `/api/additions/{id}` | Actualizar adición |
| `DELETE` | `/api/additions/{id}` | Eliminar (desactivar) adición |
| `GET` | `/api/additions/{id}` | Obtener detalle de adición |

---

### 4.7 Endpoints de MOVIMIENTOS DE INVENTARIO

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/inventory/all` | Listar todos los movimientos de inventario |

---

## 5. VALIDACIONES

### 5.1 Validaciones de Format

| Campo | Tipo de Validación | Anotación |
|-------|-------------------|-----------|
| email | Formato de correo electrónico | `@Email` |
| phone | Longitud exacta | `@Length(min = 1, max = 10)` |
| description | Longitud específica | `@Length(min = 10, max = 500)` |

### 5.2 Validaciones de Rango

| Campo | Validación | Anotación |
|-------|------------|-----------|
| price | Debe ser positivo | `@Positive @NotNull` |
| weight | Debe ser positivo | `@Positive @NotNull` |
| minimumStock | Debe ser positivo | `@Positive @NotNull` |
| mililiters | Debe ser positivo | `@Positive @NotNull` |
| units | Debe ser positivo | `@Positive @NotNull` |
| photos (Product) | 1-10 fotos | `@Size(min = 1, max = 10)` |
| photos (Dish) | 1-10 fotos | `@Size(min = 1, max = 10)` |
| photos (Drink) | 1-3 fotos | `@Size(min = 1, max = 3)` |
| name (Product) | 1-50 caracteres | `@Length(min = 1, max = 50)` |
| name (Category) | 1-100 caracteres | `@Length(min = 1, max = 100)` |

### 5.3 Validaciones de Obligatoriedad

| Campo | Validación | Anotación |
|-------|------------|-----------|
| name | No puede estar vacío | `@NotBlank` |
| description | No puede estar vacío | `@NotBlank` |
| price | No puede ser null | `@NotNull` |
| photos | No puede estar vacío | `@NotNull` |
| ingredients (Dish) | No puede estar vacío | `@NotEmpty` |

### 5.4 Mensajes de Error Personalizados

```java
// Addition
"El nombre no puede estar vacío"
"La descripción no puede estar vacía"

// Category
@Length(min = 1, max = 100)  // nombre
@Length(min = 10, max = 500) // descripción

// Suplier
@Email // formato de email inválido
```

---

## 6. REGLAS DE NEGOCIO

### 6.1 Gestión de Stock de Productos

1. **Añadir Stock (ENTRY)**:
   - Suma la cantidad especificada al peso actual
   - Registra el movimiento en `InventoryMovement` con tipo `ENTRY`
   - **Alerta de inventario bajo**: Si el stock después de añadir es menor que `minimumStock`, se crea una `Notification`

2. **Descontar Stock (EXIT)**:
   - Resta la cantidad especificada al peso actual
   - **Validación**: No permite dejar stock negativo (throw `ValueConflictException`)
   - Registra el movimiento en `InventoryMovement` con tipo `EXIT`
   - **Alerta de inventario bajo**: Si el stock después de descontar es menor que `minimumStock`, se crea una `Notification`

### 6.2 Notificaciones de Stock Bajo

Cuando el stock de un producto baja del mínimo (`minimumStock`):
- Se crea una notificación con:
  - `type`: "Bajo nivel de stock de: {nombre_producto}"
  - `description`: "Revisa el inventario - el producto {nombre} ha llegado al stock mínimo: {minimumStock}"
  - `createdAt`: Fecha actual

### 6.3 Creación de Entidades

1. **Producto**:
   - Requiere un `Suplier` existente y activo
   - Si ya existe un producto con el mismo nombre y estado ACTIVE, no se permite crear

2. **Plato**:
   - Requiere una `Category` existente y activa
   - Requiere al menos un ingrediente en la receta
   - Los ingredientes deben ser productos existentes

3. **Bebida**:
   - Requiere una `Category` existente y activa

4. **Proveedor**:
   - El email debe ser único en el sistema

### 6.4 Eliminación (Soft Delete)

Todas las operaciones de eliminación son **soft deletes**:
- Se cambia el `state` de `ACTIVE` a `INACTIVE`
- No se elimina físicamente el registro
- Los listados solo muestran entidades con `state = ACTIVE`

### 6.5 Paginación

- Todos los endpoints de listados usan paginación
- Tamaño de página: **10 elementos**
- Página 0-indexed (comienza en 0)

---

## 7. CASOS DE USO

### 7.1 Gestión de Productos

| Caso de Uso | Descripción |
|-------------|-------------|
| Crear Producto | Crear un nuevo producto asociado a un proveedor |
| Listar Productos | Ver todos los productos activos paginados |
| Ver Detalle Producto | Ver información completa de un producto |
| Actualizar Producto | Modificar datos de un producto |
| Eliminar Producto | Desactivar un producto (soft delete) |
| Añadir Stock | Incrementar cantidad de producto |
| Descontar Stock | Reducir cantidad de producto |

### 7.2 Gestión de Categorías

| Caso de Uso | Descripción |
|-------------|-------------|
| Crear Categoría | Crear una nueva categoría |
| Listar Categorías | Ver todas las categorías activas |
| Ver Detalle Categoría | Ver información de una categoría |
| Actualizar Categoría | Modificar datos de una categoría |
| Eliminar Categoría | Desactivar una categoría |

### 7.3 Gestión de Proveedores

| Caso de Uso | Descripción |
|-------------|-------------|
| Crear Proveedor | Registrar un nuevo proveedor |
| Listar Proveedores | Ver todos los proveedores activos |
| Ver Detalle Proveedor | Ver información de un proveedor |
| Actualizar Proveedor | Modificar datos de un proveedor |
| Eliminar Proveedor | Desactivar un proveedor |

### 7.4 Gestión de Platos

| Caso de Uso | Descripción |
|-------------|-------------|
| Crear Plato | Crear plato con receta (ingredientes) |
| Listar Platos | Ver todos los platos activos paginados |
| Ver Detalle Plato | Ver plato con sus ingredientes |
| Actualizar Plato | Modificar plato y/o receta |
| Eliminar Plato | Desactivar plato (también desactiva recetas) |

### 7.5 Gestión de Bebidas

| Caso de Uso | Descripción |
|-------------|-------------|
| Crear Bebida | Crear nueva bebida en categoría |
| Listar Bebidas | Ver todas las bebidas activas paginadas |
| Ver Detalle Bebida | Ver información completa de bebida |
| Actualizar Bebida | Modificar datos de bebida |
| Eliminar Bebida | Desactivar bebida |

### 7.6 Gestión de Adiciones

| Caso de Uso | Descripción |
|-------------|-------------|
| Crear Adición | Crear nueva adición/extra |
| Listar Adiciones | Ver todas las adiciones activas paginadas |
| Ver Detalle Adición | Ver información completa de adición |
| Actualizar Adición | Modificar datos de adición |
| Eliminar Adición | Desactivar adición |

### 7.7 Consultas

| Caso de Uso | Descripción |
|-------------|-------------|
| Ver Movimientos | Consultar histórico de movimientos de inventario |

---

## 8. ERRORES Y MENSAJES

### 8.1 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| `200` | OK | Operaciones exitosas de lectura/actualización |
| `201` | Created | Creación exitosa de recursos |
| `400` | Bad Request | Validaciones fallidas o parámetros inválidos |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto de datos (ej: stock insuficiente) |
| `500` | Internal Server Error | Errores no manejados |

### 8.2 Excepciones Personalizadas

| Excepción | Código HTTP | Descripción |
|-----------|-------------|-------------|
| `ResourceNotFoundException` | 404 | Recurso no encontrado en la base de datos |
| `BadRequestException` | 400 | Solicitud inválida o parámetros incorrectos |
| `ValueConflictException` | 409 | Conflicto de valores (ej: stock negativo) |
| `UnauthorizedException` | 401 | No autorizado (no implementado en inventario) |
| `ForbiddenException` | 403 | Acceso prohibido (no implementado en inventario) |

### 8.3 Mensajes de Error del Sistema

| Código | Mensaje | Causa |
|--------|---------|-------|
| 404 | "El proveedor no existe" | Proveedor no encontrado o inactivo |
| 404 | "El producto ya existe" | Producto con mismo nombre ya activo |
| 404 | "Product not found" | Producto no encontrado |
| 404 | "producto no encontrado" | Producto no encontrado o inactivo |
| 404 | "No existen productos encontrados" | No hay productos activos |
| 400 | "pagina invalida (negativa), debe ser >= 0" | Página negativa |
| 409 | "No hay suficiente para descontar" | Stock resultante sería negativo |
| 404 | "No hay platos registrados" | No hay platos activos |
| 404 | "No existe esta categoría" | Categoría no encontrada o inactiva |
| 404 | "Ya existe este plato" | Plato con mismo nombre |
| 404 | "No se encuentra el plato" | Plato no encontrado |
| 404 | "No existe, no puede ser eliminado" | Plato inactivo |
| 404 | "Plato no encontrado" | Plato no encontrado o inactivo |
| 404 | "No hay bebidas registradas" | No hay bebidas activas |
| 404 | "No existe la categoría" | Categoría no encontrada o inactiva |
| 400 | "Drink already exists" | Bebida con mismo nombre ya activa |
| 404 | "Drink does not exist" | Bebida no encontrada o inactiva |
| 404 | "No hay adiciones registradas" | No hay adiciones activas |
| 400 | "Already active addition" | Adición con mismo nombre ya activa |
| 400 | "Addition not found" | Adición no encontrada |
| 400 | "Addition does not exist" | Adición inactiva |
| 404 | "La categoría ya existe" | Categoría con mismo nombre activa |
| 400 | "Categoria no encontrada" | Categoría no encontrada o inactiva |
| 404 | "Ya existe el proveedor" | Email de proveedor ya registrado |
| 404 | "Proveedor no encontrado" | Proveedor no encontrado o inactivo |
| 404 | "Producto no encontrado" | Producto para receta no encontrado |

### 8.4 Estructura de Respuesta de Error

```json
{
  "message": "Mensaje de error específico",
  "error": true
}
```

### 8.5 Errores de Validación (400)

Cuando falla una validación de bean, el formato es:

```json
{
  "message": [
    { "field": "nombre_campo", "message": "mensaje de validación" }
  ],
  "error": true
}
```

**Ejemplo:**
```json
{
  "message": [
    { "field": "name", "message": "El nombre no puede estar vacío" },
    { "field": "price", "message": "must be greater than 0" }
  ],
  "error": true
}
```

---

## 9. CONSIDERACIONES IMPORTANTES PARA EL FRONTEND

### 9.1 Autenticación

- **NO** implementar funcionalidades de login, registro o gestión de usuarios
- Los endpoints requieren token JWT en headers (ya manejado por el sistema de auth)
- El frontend de inventario debe obtener el token de sesión activa

### 9.2 Paginación

- Todos los listados (excepto categorías y proveedores) usan paginación
- Formato: `/endpoint/{page}/page` donde page es 0-indexed
- Por defecto, 10 elementos por página

### 9.3 Imágenes

- El sistema usa Cloudinary para almacenamiento de imágenes
- Los DTOs devuelven URLs (Strings) de las imágenes
- El frontend debe manejar la carga y muestra de estas URLs

### 9.4 Estados

- Todos los recursos tienen estado ACTIVE/INACTIVE
- Las operaciones de "eliminar" son soft deletes
- Los listados solo muestran elementos activos

### 9.5 Notificaciones

- Las notificaciones de stock bajo se generan automáticamente
- El frontend podría implementar un panel de notificaciones para mostrar alertas

---

## 10. EJEMPLOS DE PETICIONES COMPLETAS

### 10.1 Crear Producto Completo

```http
POST /api/products/PROV001/supliers
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "name": "Pollo",
  "description": "Pollo fresco de granja",
  "price": 12000.0,
  "weight": 25.5,
  "photos": [
    "https://res.cloudinary.com/demo/image/upload/v1/pollo.jpg"
  ],
  "minimumStock": 5.0
}
```

**Respuesta (201):**
```json
{
  "message": "Producto creado",
  "error": false
}
```

### 10.2 Listar Productos

```http
GET /api/products/0/page
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta (200):**
```json
{
  "message": [
    { "id": "1", "name": "Pollo", "price": 12000.0, "weight": 25.5, "photo": "url...", "minimumStock": 5.0, "state": "ACTIVE" },
    { "id": "2", "name": "Arroz", "price": 5000.0, "weight": 50.0, "photo": "url...", "minimumStock": 10.0, "state": "ACTIVE" }
  ],
  "error": false
}
```

### 10.3 Añadir Stock

```http
PATCH /api/products/1/add
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "weight": 10.0
}
```

**Respuesta (200):**
```json
{
  "message": "Stock añadido",
  "error": false
}
```

### 10.4 Crear Plato con Receta

```http
POST /api/dishes/CAT001/categories
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "name": "Pollo Asado",
  "description": "Pollo asado con hierbas aromáticas",
  "price": 18000.0,
  "photos": ["https://res.cloudinary.com/demo/pollo-asado.jpg"],
  "ingredients": [
    { "product_id": "1", "quantity": 500, "unit": "g" },
    { "product_id": "2", "quantity": 200, "unit": "g" }
  ]
}
```

**Respuesta (200):**
```json
{
  "message": "Plato creado",
  "error": false
}
```

---

> **Documento generado automáticamente para facilitar el desarrollo del frontend del módulo de inventario de Smart Restaurant.**
