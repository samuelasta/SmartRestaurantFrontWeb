# Guía de Implementación Backend - Social Login y Endpoints Faltantes

## 📋 RESUMEN EJECUTIVO

Después de analizar el backend actual de SmartRestaurante, he identificado las siguientes funcionalidades que deben implementarse para completar el módulo de autenticación del frontend:

### ✅ Endpoints Existentes (Funcionando)
- Login básico con email/password
- Registro público (solo CUSTOMER)
- Verificación 2FA
- Verificación de email
- Recuperación y restablecimiento de contraseña
- Cambio de contraseña voluntario
- Registro de empleados por admin
- Gestión de usuarios (CRUD completo)

### ❌ Endpoints Faltantes

1. **GET /auth/me** - Obtener información del usuario actual
2. **POST /auth/social-login** - Login/Registro con proveedores sociales
3. **GET /auth/roles** - Listar roles disponibles (opcional, se puede inferir del enum)

---

## 🔐 1. ENDPOINT: Obtener Usuario Actual

### Especificación

```java
/**
 * Obtiene la información del usuario actualmente autenticado
 * 
 * @return UserResponse con la información del usuario
 */
@GetMapping("/me")
public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication)
```

### Implementación Propuesta

#### AuthenticationController.java

```java
@GetMapping("/me")
public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
    String email = authentication.getName();
    return ResponseEntity.ok(authenticationService.getCurrentUser(email));
}
```

#### AuthenticationService.java

```java
public UserResponse getCurrentUser(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    
    return UserResponse.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .role(user.getRole())
            .roleDisplayName(user.getRole().getDisplayName())
            .status(user.getStatus())
            .statusDisplayName(user.getStatus().getDisplayName())
            .isEmailVerified(user.isEmailVerified())
            .requiresPasswordChange(user.isRequiresPasswordChange())
            .failedLoginAttempts(user.getFailedLoginAttempts())
            .lockReason(user.getLockReason())
            .lockedAt(user.getLockedAt())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
}
```

---

## 🌐 2. SOCIAL LOGIN - Implementación Completa

### Arquitectura Propuesta

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend    │─────▶│  Provider   │
│   Angular   │      │  Spring Boot │      │ (Google/FB) │
└─────────────┘      └──────────────┘      └─────────────┘
      │                      │                      │
      │  1. Obtener token    │                      │
      │◀─────────────────────┼──────────────────────┘
      │                      │
      │  2. Enviar token     │
      ├─────────────────────▶│
      │                      │
      │                      │  3. Validar token
      │                      ├──────────────────────▶
      │                      │
      │                      │  4. Obtener info user
      │                      │◀──────────────────────
      │                      │
      │                      │  5. Crear/Actualizar user
      │                      │
      │  6. Retornar tokens  │
      │◀─────────────────────│
```

### 2.1. Modelo de Datos

#### Crear nueva entidad: SocialAccount.java

```java
package com.smartRestaurant.auth.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "social_accounts")
public class SocialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SocialProvider provider;

    @Column(nullable = false, unique = true, length = 255)
    private String providerId;

    @Column(length = 255)
    private String profilePictureUrl;

    @Column(nullable = false)
    private LocalDateTime linkedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        linkedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

#### Crear enum: SocialProvider.java

```java
package com.smartRestaurant.auth.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SocialProvider {
    GOOGLE("Google"),
    FACEBOOK("Facebook"),
    GITHUB("GitHub");

    private final String displayName;
}
```

### 2.2. DTOs

#### SocialLoginRequest.java

```java
package com.smartRestaurant.auth.dto.request;

import com.smartRestaurant.auth.model.enums.SocialProvider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginRequest {

    @NotNull(message = "El proveedor es obligatorio")
    private SocialProvider provider;

    @NotBlank(message = "El token de acceso es obligatorio")
    private String accessToken;

    // Campos opcionales que pueden venir del frontend
    @Email
    private String email;
    
    private String firstName;
    private String lastName;
    private String profilePicture;
}
```

#### SocialUserInfo.java (DTO interno)

```java
package com.smartRestaurant.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialUserInfo {
    private String providerId;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private boolean emailVerified;
}
```

### 2.3. Repositorio

#### SocialAccountRepository.java

```java
package com.smartRestaurant.auth.repository;

import com.smartRestaurant.auth.model.entity.SocialAccount;
import com.smartRestaurant.auth.model.enums.SocialProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    
    Optional<SocialAccount> findByProviderAndProviderId(SocialProvider provider, String providerId);
    
    boolean existsByProviderAndProviderId(SocialProvider provider, String providerId);
}
```

### 2.4. Servicio de Validación de Tokens

#### SocialAuthValidator.java

```java
package com.smartRestaurant.auth.service;

import com.smartRestaurant.auth.dto.SocialUserInfo;
import com.smartRestaurant.auth.model.enums.SocialProvider;
import com.smartRestaurant.common.exception.AuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocialAuthValidator {

    private final RestTemplate restTemplate;

    @Value("${social.google.client-id}")
    private String googleClientId;

    /**
     * Valida el token y obtiene información del usuario según el proveedor
     */
    public SocialUserInfo validateAndGetUserInfo(SocialProvider provider, String accessToken) {
        return switch (provider) {
            case GOOGLE -> validateGoogleToken(accessToken);
            case FACEBOOK -> validateFacebookToken(accessToken);
            case GITHUB -> validateGitHubToken(accessToken);
        };
    }

    /**
     * Valida token de Google y obtiene información del usuario
     */
    private SocialUserInfo validateGoogleToken(String accessToken) {
        try {
            String url = "https://www.googleapis.com/oauth2/v3/userinfo";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> userInfo = response.getBody();
                
                return SocialUserInfo.builder()
                        .providerId((String) userInfo.get("sub"))
                        .email((String) userInfo.get("email"))
                        .firstName((String) userInfo.get("given_name"))
                        .lastName((String) userInfo.get("family_name"))
                        .profilePicture((String) userInfo.get("picture"))
                        .emailVerified((Boolean) userInfo.getOrDefault("email_verified", false))
                        .build();
            }
            
            throw new AuthException("Token de Google inválido");
            
        } catch (Exception e) {
            log.error("Error validando token de Google: {}", e.getMessage());
            throw new AuthException("Error al validar token de Google");
        }
    }

    /**
     * Valida token de Facebook y obtiene información del usuario
     */
    private SocialUserInfo validateFacebookToken(String accessToken) {
        try {
            String url = "https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token=" + accessToken;
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> userInfo = response.getBody();
                Map<String, Object> picture = (Map<String, Object>) userInfo.get("picture");
                Map<String, Object> pictureData = picture != null ? (Map<String, Object>) picture.get("data") : null;
                
                return SocialUserInfo.builder()
                        .providerId((String) userInfo.get("id"))
                        .email((String) userInfo.get("email"))
                        .firstName((String) userInfo.get("first_name"))
                        .lastName((String) userInfo.get("last_name"))
                        .profilePicture(pictureData != null ? (String) pictureData.get("url") : null)
                        .emailVerified(true) // Facebook solo retorna emails verificados
                        .build();
            }
            
            throw new AuthException("Token de Facebook inválido");
            
        } catch (Exception e) {
            log.error("Error validando token de Facebook: {}", e.getMessage());
            throw new AuthException("Error al validar token de Facebook");
        }
    }

    /**
     * Valida token de GitHub y obtiene información del usuario
     */
    private SocialUserInfo validateGitHubToken(String accessToken) {
        try {
            String url = "https://api.github.com/user";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("Accept", "application/vnd.github.v3+json");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> userInfo = response.getBody();
                
                // GitHub puede no tener email público, obtenerlo de otro endpoint
                String email = (String) userInfo.get("email");
                if (email == null) {
                    email = getGitHubEmail(accessToken);
                }
                
                String name = (String) userInfo.get("name");
                String[] nameParts = name != null ? name.split(" ", 2) : new String[]{"", ""};
                
                return SocialUserInfo.builder()
                        .providerId(String.valueOf(userInfo.get("id")))
                        .email(email)
                        .firstName(nameParts.length > 0 ? nameParts[0] : "")
                        .lastName(nameParts.length > 1 ? nameParts[1] : "")
                        .profilePicture((String) userInfo.get("avatar_url"))
                        .emailVerified(true)
                        .build();
            }
            
            throw new AuthException("Token de GitHub inválido");
            
        } catch (Exception e) {
            log.error("Error validando token de GitHub: {}", e.getMessage());
            throw new AuthException("Error al validar token de GitHub");
        }
    }

    /**
     * Obtiene el email principal de GitHub (puede ser privado)
     */
    private String getGitHubEmail(String accessToken) {
        try {
            String url = "https://api.github.com/user/emails";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("Accept", "application/vnd.github.v3+json");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map[]> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                entity, 
                Map[].class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                for (Map<String, Object> emailInfo : response.getBody()) {
                    if ((Boolean) emailInfo.get("primary")) {
                        return (String) emailInfo.get("email");
                    }
                }
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("Error obteniendo email de GitHub: {}", e.getMessage());
            return null;
        }
    }
}
```

### 2.5. Servicio Principal de Social Login

#### Agregar a AuthenticationService.java

```java
@Autowired
private SocialAuthValidator socialAuthValidator;

@Autowired
private SocialAccountRepository socialAccountRepository;

/**
 * Procesa login/registro con proveedor social
 */
@Transactional
public AuthResponse socialLogin(SocialLoginRequest request) {
    // 1. Validar token y obtener información del usuario
    SocialUserInfo socialUserInfo = socialAuthValidator.validateAndGetUserInfo(
        request.getProvider(), 
        request.getAccessToken()
    );
    
    // 2. Verificar si ya existe una cuenta social vinculada
    Optional<SocialAccount> existingSocialAccount = socialAccountRepository
            .findByProviderAndProviderId(request.getProvider(), socialUserInfo.getProviderId());
    
    User user;
    
    if (existingSocialAccount.isPresent()) {
        // Usuario existente con cuenta social vinculada
        user = existingSocialAccount.get().getUser();
        
        // Actualizar información si es necesario
        updateSocialAccount(existingSocialAccount.get(), socialUserInfo);
        
    } else {
        // Verificar si existe un usuario con el mismo email
        Optional<User> existingUser = userRepository.findByEmail(socialUserInfo.getEmail());
        
        if (existingUser.isPresent()) {
            // Vincular cuenta social a usuario existente
            user = existingUser.get();
            createSocialAccount(user, request.getProvider(), socialUserInfo);
            
        } else {
            // Crear nuevo usuario
            user = createUserFromSocialLogin(socialUserInfo);
            createSocialAccount(user, request.getProvider(), socialUserInfo);
        }
    }
    
    // 3. Verificar estado del usuario
    if (!user.getStatus().canLogin()) {
        throw new AccountLockedException("La cuenta está " + user.getStatus().getDisplayName());
    }
    
    // 4. Generar tokens
    String accessToken = jwtService.generateToken(user.getEmail(), user.getRole());
    String refreshToken = jwtService.generateRefreshToken(user.getEmail());
    
    // 5. Guardar refresh token
    saveRefreshToken(user, refreshToken);
    
    // 6. Registrar auditoría
    auditService.logEvent(
        user,
        AuditEventType.LOGIN_SUCCESS,
        "Login exitoso con " + request.getProvider().getDisplayName()
    );
    
    return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .message("Login exitoso con " + request.getProvider().getDisplayName())
            .is2faRequired(false)
            .requiresPasswordChange(false)
            .build();
}

/**
 * Crea un nuevo usuario desde información de login social
 */
private User createUserFromSocialLogin(SocialUserInfo socialUserInfo) {
    User user = User.builder()
            .firstName(socialUserInfo.getFirstName())
            .lastName(socialUserInfo.getLastName())
            .email(socialUserInfo.getEmail())
            .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Password aleatorio
            .role(UserRole.CUSTOMER) // Por defecto CUSTOMER
            .status(socialUserInfo.isEmailVerified() ? UserStatus.ACTIVE : UserStatus.PENDING)
            .isEmailVerified(socialUserInfo.isEmailVerified())
            .requiresPasswordChange(false)
            .build();
    
    return userRepository.save(user);
}

/**
 * Crea una cuenta social vinculada a un usuario
 */
private void createSocialAccount(User user, SocialProvider provider, SocialUserInfo socialUserInfo) {
    SocialAccount socialAccount = SocialAccount.builder()
            .user(user)
            .provider(provider)
            .providerId(socialUserInfo.getProviderId())
            .profilePictureUrl(socialUserInfo.getProfilePicture())
            .build();
    
    socialAccountRepository.save(socialAccount);
}

/**
 * Actualiza información de una cuenta social existente
 */
private void updateSocialAccount(SocialAccount socialAccount, SocialUserInfo socialUserInfo) {
    socialAccount.setProfilePictureUrl(socialUserInfo.getProfilePicture());
    socialAccountRepository.save(socialAccount);
}
```

### 2.6. Controller

#### Agregar a AuthenticationController.java

```java
/**
 * Login/Registro con proveedor social (Google, Facebook, GitHub)
 */
@PostMapping("/social-login")
public ResponseEntity<AuthResponse> socialLogin(@RequestBody @Valid SocialLoginRequest request) {
    return ResponseEntity.ok(authenticationService.socialLogin(request));
}
```

### 2.7. Configuración

#### application.properties / application.yml

```properties
# Social Login Configuration
social.google.client-id=YOUR_GOOGLE_CLIENT_ID
social.facebook.app-id=YOUR_FACEBOOK_APP_ID
social.github.client-id=YOUR_GITHUB_CLIENT_ID
social.github.client-secret=YOUR_GITHUB_CLIENT_SECRET
```

#### RestTemplate Bean

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### 2.8. Migración de Base de Datos

#### V1__create_social_accounts_table.sql

```sql
CREATE TABLE social_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    profile_picture_url VARCHAR(255),
    linked_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_provider_provider_id (provider, provider_id)
);

CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
```

---

## 📝 3. NOTAS IMPORTANTES

### Seguridad

1. **Validación de Tokens**: Siempre validar tokens con los proveedores antes de confiar en la información
2. **Rate Limiting**: Implementar límite de intentos para prevenir ataques
3. **HTTPS**: Obligatorio para manejar tokens de terceros
4. **Secrets**: Nunca exponer client secrets en el frontend

### Flujo de Registro Social

1. Usuario hace clic en "Login con Google" en el frontend
2. Frontend obtiene token de Google usando SDK
3. Frontend envía token al backend
4. Backend valida token con Google
5. Backend crea/actualiza usuario
6. Backend retorna tokens JWT propios

### Consideraciones

- Los usuarios creados por social login tienen contraseña aleatoria
- Si un usuario se registra con email y luego usa social login con el mismo email, se vinculan
- Los usuarios de social login son CUSTOMER por defecto
- Email verificado automáticamente si el proveedor lo confirma

---

## 🧪 4. TESTING

### Casos de Prueba Recomendados

1. Login con cuenta social nueva
2. Login con cuenta social existente
3. Vincular cuenta social a usuario existente
4. Token inválido
5. Email duplicado
6. Usuario bloqueado intenta login social
7. Actualización de información de perfil

---

## 📚 5. DEPENDENCIAS MAVEN

```xml
<!-- RestTemplate ya incluido en spring-boot-starter-web -->

<!-- Para testing de APIs externas -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear entidad SocialAccount
- [ ] Crear enum SocialProvider
- [ ] Crear DTOs (SocialLoginRequest, SocialUserInfo)
- [ ] Crear SocialAccountRepository
- [ ] Implementar SocialAuthValidator
- [ ] Agregar método socialLogin en AuthenticationService
- [ ] Agregar endpoint en AuthenticationController
- [ ] Crear migración de base de datos
- [ ] Configurar properties
- [ ] Crear RestTemplate bean
- [ ] Implementar endpoint GET /auth/me
- [ ] Testing completo
- [ ] Documentación API (Swagger)

---

## 🎯 PRIORIDAD DE IMPLEMENTACIÓN

1. **Alta**: GET /auth/me (necesario para el frontend)
2. **Media**: Social Login (mejora UX pero no crítico)
3. **Baja**: GET /auth/roles (se puede inferir del enum)

---

¿Necesitas ayuda con alguna parte específica de la implementación?
