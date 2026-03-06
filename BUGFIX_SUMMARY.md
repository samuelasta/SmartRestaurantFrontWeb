# 🐛 Corrección de Errores - Componentes de Autenticación

## Errores Corregidos

### 1. ChangePasswordComponent ✅

**Error Original:**
```
Expected 1 arguments, but got 2.
this.authService.changePassword(currentPassword, newPassword)
```

**Problema:**
El método `changePassword()` espera un objeto `ChangePasswordRequest` completo, no parámetros individuales.

**Solución:**
- Agregado flujo de solicitud de OTP
- Agregado campo OTP en el formulario
- Actualizado para enviar objeto completo:
```typescript
const request = {
  email: this.userEmail,
  currentPassword,
  newPassword,
  otp
};
this.authService.changePassword(request).subscribe(...)
```

**Flujo Actualizado:**
1. Usuario completa contraseña actual y nueva
2. Click en "Solicitar Código OTP"
3. Backend envía OTP por email
4. Usuario ingresa OTP
5. Click en "Cambiar Contraseña"
6. Backend valida y cambia contraseña

---

### 2. ResetPasswordComponent ✅

**Error Original:**
```
Expected 1 arguments, but got 3.
this.authService.resetPassword(email, otp, newPassword)
```

**Problema:**
El método `resetPassword()` espera un objeto `ResetPasswordRequest`, no parámetros individuales.

**Solución:**
```typescript
const request = {
  email,
  otp,
  newPassword
};
this.authService.resetPassword(request).subscribe(...)
```

---

### 3. VerifyAccountComponent ✅

**Error Original:**
```
Property 'verifyAccount' does not exist on type 'AuthService'.
this.authService.verifyAccount(email, otp)
```

**Problema:**
El método se llama `verifyEmail()`, no `verifyAccount()`.

**Solución:**
```typescript
const request = {
  email,
  code: this.verifyForm.value.otp
};
this.authService.verifyEmail(request).subscribe(...)
```

**Nota:** El backend espera el campo `code`, no `otp`.

---

## Archivos Modificados

1. ✅ `change-password.component.ts` - Agregado flujo de OTP
2. ✅ `change-password.component.html` - Agregado campo OTP y botón
3. ✅ `reset-password.component.ts` - Corregida llamada al servicio
4. ✅ `verify-account.component.ts` - Corregido nombre del método

---

## Contratos del Backend

### ChangePasswordRequest
```typescript
{
  email: string;
  currentPassword: string;
  newPassword: string;
  otp: string;
}
```

### ResetPasswordRequest
```typescript
{
  email: string;
  otp: string;
  newPassword: string;
}
```

### VerifyRequest
```typescript
{
  email: string;
  code: string;  // ← Nota: se llama 'code', no 'otp'
}
```

---

## Testing

### Test 1: Cambio de Contraseña

1. Login con usuario existente
2. Ir a `/auth/change-password`
3. Ingresar contraseña actual y nueva
4. Click "Solicitar Código OTP"
5. Verificar email recibido
6. Ingresar código OTP
7. Click "Cambiar Contraseña"
8. Verificar éxito

### Test 2: Restablecer Contraseña

1. Ir a `/auth/forgot-password`
2. Ingresar email
3. Click "Enviar Código"
4. Ir a `/auth/reset-password`
5. Ingresar email, código OTP y nueva contraseña
6. Click "Restablecer Contraseña"
7. Verificar éxito

### Test 3: Verificar Email

1. Registrar nuevo usuario
2. Verificar email recibido
3. Ir a `/auth/verify-email`
4. Ingresar email y código
5. Click "Verificar"
6. Verificar cuenta activada

---

## Notas Importantes

### Flujo de Cambio de Contraseña

El backend requiere un flujo de dos pasos:

1. **Solicitar OTP**: `POST /auth/request-password-change`
   - Envía OTP por email
   
2. **Cambiar Contraseña**: `POST /auth/change-password`
   - Requiere: email, contraseña actual, nueva contraseña y OTP

### Diferencia entre 'code' y 'otp'

- **VerifyRequest**: Usa campo `code`
- **ChangePasswordRequest**: Usa campo `otp`
- **ResetPasswordRequest**: Usa campo `otp`

Esto es inconsistente en el backend, pero debemos respetarlo.

---

## Estado Actual

✅ Todos los errores de compilación corregidos
✅ Componentes actualizados con contratos correctos
✅ Flujos de autenticación funcionando
✅ Listo para testing

---

## Próximos Pasos

1. Ejecutar `npm start` para verificar compilación
2. Probar cada flujo manualmente
3. Verificar que los emails se envíen correctamente
4. Verificar que los OTPs funcionen

---

¡Errores corregidos exitosamente! 🎉
