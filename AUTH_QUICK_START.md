# 🚀 Quick Start - Auth Module Frontend

## Inicio Rápido

### 1. Instalar Dependencias

```bash
cd Frontend
npm install
```

### 2. Configurar URL del Backend

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',  // ← Verifica que apunte a tu backend
  apiTimeout: 30000
};
```

### 3. Iniciar el Frontend

```bash
npm start
```

El frontend estará disponible en `http://localhost:4200`

---

## 🎯 Funcionalidades Disponibles

### ✅ Login Básico
- Ruta: `/auth/login`
- Email + Contraseña
- Soporte para 2FA
- Redirección automática según rol

### ✅ Registro
- Ruta: `/auth/register`
- Solo crea usuarios con rol CUSTOMER
- Validación de contraseña fuerte
- Verificación de email requerida

### ✅ Recuperación de Contraseña
- Ruta: `/auth/forgot-password`
- Envía código OTP por email
- Restablecimiento con código

### ✅ Verificación de Email
- Ruta: `/auth/verify-email`
- Ingreso de código OTP
- Activación de cuenta

### ⚠️ Social Login (Preparado)
- Botones visibles en `/auth/login`
- Requiere configuración de SDKs
- Ver sección "Configurar Social Login" abajo

---

## 🔐 Flujo de Autenticación

### Login Normal

```
1. Usuario ingresa email/password
2. Click en "Iniciar Sesión"
3. Si requiere 2FA:
   - Mostrar formulario de código
   - Usuario ingresa código OTP
   - Verificar código
4. Backend retorna tokens
5. Frontend obtiene info del usuario (GET /auth/me)
6. Guardar usuario en localStorage
7. Redirigir según rol:
   - ADMIN → /admin/dashboard
   - KITCHEN → /kitchen/dashboard
   - WAITER → /waiter/dashboard
   - CUSTOMER → /customer/home
```

### Registro

```
1. Usuario completa formulario
2. Click en "Registrarse"
3. Backend crea usuario con status PENDING
4. Backend envía email con código OTP
5. Redirigir a /auth/verify-email
6. Usuario ingresa código
7. Backend activa cuenta (PENDING → ACTIVE)
8. Usuario puede hacer login
```

---

## 🌐 Configurar Social Login (Opcional)

### Opción 1: Google Login

#### Instalar SDK

```bash
npm install @abacritt/angularx-social-login
```

#### Configurar en app.module.ts

```typescript
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@NgModule({
  imports: [
    // ... otros imports
    SocialLoginModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('TU_GOOGLE_CLIENT_ID')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ]
})
```

#### Actualizar social-auth.service.ts

```typescript
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

constructor(private socialAuthService: SocialAuthService) {}

loginWithGoogle(): Observable<SocialLoginRequest> {
  return from(this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)).pipe(
    map(user => ({
      provider: 'GOOGLE' as const,
      accessToken: user.idToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.photoUrl
    }))
  );
}
```

### Opción 2: Facebook Login

#### Agregar SDK en index.html

```html
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId: 'TU_FACEBOOK_APP_ID',
      cookie: true,
      xfbml: true,
      version: 'v12.0'
    });
  };
</script>
<script async defer crossorigin="anonymous" 
  src="https://connect.facebook.net/es_LA/sdk.js"></script>
```

#### Actualizar social-auth.service.ts

```typescript
loginWithFacebook(): Observable<SocialLoginRequest> {
  return from(new Promise((resolve, reject) => {
    FB.login((response: any) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'email,first_name,last_name,picture' }, (user: any) => {
          resolve({
            provider: 'FACEBOOK',
            accessToken: response.authResponse.accessToken,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            profilePicture: user.picture?.data?.url
          });
        });
      } else {
        reject(new Error('Facebook login cancelado'));
      }
    }, { scope: 'email,public_profile' });
  }));
}
```

### Opción 3: GitHub Login

GitHub requiere un flujo OAuth completo que debe manejarse en el backend. Por ahora, el botón está preparado pero no funcional.

---

## 🧪 Testing

### Test 1: Login Básico

1. Ir a `http://localhost:4200/auth/login`
2. Ingresar credenciales:
   - Email: `admin@example.com`
   - Password: `Admin123!`
3. Click "Iniciar Sesión"
4. Verificar redirección a dashboard

### Test 2: Registro

1. Ir a `http://localhost:4200/auth/register`
2. Completar formulario
3. Click "Registrarse"
4. Verificar redirección a verificación de email
5. Ingresar código OTP del email
6. Verificar activación de cuenta

### Test 3: Recuperación de Contraseña

1. Ir a `http://localhost:4200/auth/forgot-password`
2. Ingresar email
3. Click "Enviar Código"
4. Verificar redirección a reset password
5. Ingresar código OTP y nueva contraseña
6. Verificar cambio exitoso

---

## 🔧 Configuración Avanzada

### Cambiar Rutas de Redirección

Edita `role-redirect.service.ts`:

```typescript
private readonly ROLE_ROUTES: Record<UserRole, string> = {
  [UserRole.ADMIN]: '/admin/dashboard',      // ← Cambiar aquí
  [UserRole.KITCHEN]: '/kitchen/dashboard',  // ← Cambiar aquí
  [UserRole.WAITER]: '/waiter/dashboard',    // ← Cambiar aquí
  [UserRole.CUSTOMER]: '/customer/home'      // ← Cambiar aquí
};
```

### Personalizar Validaciones

Edita `custom-validators.ts`:

```typescript
static passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Personalizar requisitos aquí
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;  // ← Cambiar longitud mínima
    
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;
    
    return !passwordValid ? { passwordStrength: true } : null;
  };
}
```

---

## 📊 Estado de Implementación

### ✅ Completado
- [x] Login básico
- [x] Login con 2FA
- [x] Registro público (CUSTOMER)
- [x] Verificación de email
- [x] Recuperación de contraseña
- [x] Cambio de contraseña
- [x] Redirección por roles
- [x] Guards de autenticación
- [x] Interceptors (Auth, Error, Loading)
- [x] Manejo de contraseñas temporales
- [x] Diseño moderno y responsive

### ⚠️ Preparado (Requiere Configuración)
- [ ] Social Login con Google
- [ ] Social Login con Facebook
- [ ] Social Login con GitHub

### 📋 Pendiente
- [ ] Remember me
- [ ] Logout en todos los dispositivos
- [ ] Historial de sesiones
- [ ] Cambio de foto de perfil

---

## 🐛 Troubleshooting

### Error: "Cannot GET /auth/me"

**Causa**: El backend no está corriendo o la URL es incorrecta

**Solución**:
1. Verificar que el backend esté corriendo en `http://localhost:8080`
2. Verificar `environment.ts` tenga la URL correcta

### Error: CORS

**Causa**: El backend no permite peticiones desde `http://localhost:4200`

**Solución**: Verificar configuración CORS en `application.yml` del backend:
```yaml
cors:
  allowed-origins: http://localhost:4200
```

### Error: "Token inválido"

**Causa**: El token JWT expiró o es inválido

**Solución**: Hacer logout y login nuevamente

### Social Login no funciona

**Causa**: SDKs no instalados o configurados

**Solución**: Ver sección "Configurar Social Login" arriba

---

## 📚 Documentación Completa

- `AUTH_MODULE_SUMMARY.md` - Resumen completo del módulo
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Guía de implementación backend
- `Backend/SOCIAL_LOGIN_SETUP.md` - Configuración de OAuth
- `Backend/QUICK_START.md` - Inicio rápido del backend

---

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que el backend esté corriendo
2. Verifica la consola del navegador para errores
3. Verifica la consola del backend para logs
4. Consulta la documentación completa

---

¡Listo para usar! 🎉
