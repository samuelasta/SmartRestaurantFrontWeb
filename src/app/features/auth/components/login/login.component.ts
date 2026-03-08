import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService } from '../../services/social-auth.service';
import { RoleRedirectService } from '../../services/role-redirect.service';
import { NotificationService } from '@core/services/notification.service';
import { StorageService } from '@core/services/storage.service';
import { UserRole } from '../../models/user-role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  showPassword = false;
  returnUrl: string = '';
  justLoggedOut = false;

  // Estado para 2FA
  requires2FA = false;
  twoFAForm!: FormGroup;
  pendingEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private roleRedirectService: RoleRedirectService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.initForms();

    // Obtener URL de retorno o flag de logout
    const params = this.route.snapshot.queryParams;
    this.returnUrl = params['returnUrl'] || '';
    this.justLoggedOut = params['logout'] === 'true';

    // Suscribirse al estado de autenticación social (especialmente para Google GSI)
    this.socialAuthService.authState.subscribe({
      next: (user) => {
        if (user && user.provider === 'GOOGLE' && !this.justLoggedOut) {
          console.log('Google user received from authState:', user);
          this.handleGoogleUser(user);
        } else if (user) {
          console.log('Social user active but ignoring due to logout flag or provider');
        }
      },
      error: (err) => {
        console.error('Social auth state error:', err);
      }
    });
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.twoFAForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Login response:', response);

          // Primero verificar si requiere 2FA
          // El backend devuelve '2faRequired' (no 'is2faRequired')
          const requires2FA = response && (response.is2faRequired === true || response['2faRequired'] === true);

          if (requires2FA) {
            // Requiere verificación 2FA
            this.requires2FA = true;
            this.pendingEmail = this.loginForm.value.email;
            this.loading = false;
            this.notificationService.showInfo('Por favor ingrese el código de verificación enviado a su correo');
          } else if (response && response.accessToken) {
            // Login exitoso sin 2FA
            this.handleSuccessfulLogin(response);
          } else if (response && response.accessToken === null && response.is2faRequired === false) {
            // Caso inesperado - acceso denegado o credenciales incorrectas
            this.loading = false;
            this.notificationService.showError('Credenciales incorrectas');
          } else {
            // Respuesta inesperada
            this.loading = false;
            console.log('Login response inesperada:', response);
          }
        },
        error: (error) => {
          this.loading = false;
          console.log('Login error:', error);
          // Verificar si el backend indica que requiere verificación en el error
          const errorResponse = error?.error;
          if (errorResponse && (errorResponse.is2faRequired === true || errorResponse.requiresVerification === true)) {
            this.requires2FA = true;
            this.pendingEmail = this.loginForm.value.email;
            this.notificationService.showInfo('Por favor ingrese el código de verificación enviado a su correo');
          }
          // El error ya es manejado por el interceptor
        }
      });
    }
  }

  onSubmit2FA(): void {
    if (this.twoFAForm.valid) {
      this.loading = true;
      const request = {
        email: this.pendingEmail,
        code: this.twoFAForm.value.code
      };

      this.authService.verify2fa(request).subscribe({
        next: (response) => {
          this.handleSuccessfulLogin(response);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  handleSuccessfulLogin(response: any): void {
    // Guardar tokens PRIMERO
    this.storageService.setToken(response.accessToken);
    this.storageService.setRefreshToken(response.refreshToken);

    // Decodificar el token JWT para obtener el rol
    const tokenPayload = this.decodeToken(response.accessToken);
    const userRole = tokenPayload?.role || UserRole.CUSTOMER;

    this.notificationService.showSuccess('Inicio de sesión exitoso');
    this.loading = false;

    // Pequeño delay para asegurar que el token se guardó
    setTimeout(() => {
      // Obtener información completa del usuario desde el backend
      this.authService.getCurrentUser().subscribe({
        next: (userInfo) => {
          // Guardar información completa del usuario
          this.storageService.setUser(userInfo);

          // Redirigir según el rol del usuario
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            // Usar RoleRedirectService para redirigir según el rol
            this.roleRedirectService.redirectByRole(userRole, response.requiresPasswordChange || false);
          }
        },
        error: (err) => {
          console.error('Error al obtener información del usuario:', err);
          // Si falla, guardar información básica del token
          this.storageService.setUser({
            email: tokenPayload?.sub || this.loginForm.value.email,
            role: userRole,
            permissions: tokenPayload?.permissions || []
          });

          // Redirigir de todas formas
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.roleRedirectService.redirectByRole(userRole, response.requiresPasswordChange || false);
          }
        }
      });
    }, 100); // 100ms de delay
  }

  /**
   * Decodifica un token JWT
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL LOGIN
  // ═══════════════════════════════════════════════════════════════════════════

  private handleGoogleUser(user: any): void {
    this.loading = true;
    const socialData = {
      provider: 'GOOGLE' as const,
      accessToken: user.idToken, // GSI usa idToken para verificar en el backend
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.photoUrl
    };

    this.authService.socialLogin(socialData).subscribe({
      next: (response) => {
        this.handleSuccessfulLogin(response);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // El método manual loginWithGoogle se mantiene por compatibilidad de tipos pero ya no se usa para GSI
  loginWithGoogle(): void {
    // Con las nuevas versiones de Google Identity Services, se usa el componente <as-google-signin-button>
    // que maneja el flujo automáticamente y emite a través de authState.
  }

  cancel2FA(): void {
    this.requires2FA = false;
    this.pendingEmail = '';
    this.twoFAForm.reset();
  }
}
