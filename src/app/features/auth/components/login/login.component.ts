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
  ) {}

  ngOnInit(): void {
    this.initForms();
    
    // Obtener URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
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
    // Guardar tokens primero
    this.storageService.setToken(response.accessToken);
    this.storageService.setRefreshToken(response.refreshToken);
    
    this.notificationService.showSuccess('Inicio de sesión exitoso');
    
    // Obtener información del usuario actual
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.storageService.setUser(user);
        
        // Redirigir según el rol o URL de retorno
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.roleRedirectService.redirectByRole(
            user.role as UserRole,
            response.requiresPasswordChange
          );
        }
        
        this.loading = false;
      },
      error: () => {
        // Si falla obtener el usuario, aún así redirigir
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.roleRedirectService.redirectByRole(
            'ADMIN' as UserRole, // Por defecto
            response.requiresPasswordChange
          );
        }
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL LOGIN
  // ═══════════════════════════════════════════════════════════════════════════

  loginWithGoogle(): void {
    this.loading = true;
    this.socialAuthService.loginWithGoogle().subscribe({
      next: (socialData) => {
        this.authService.socialLogin(socialData).subscribe({
          next: (response) => {
            this.handleSuccessfulLogin(response);
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.notificationService.showError(error.message);
        this.loading = false;
      }
    });
  }

  loginWithFacebook(): void {
    this.loading = true;
    this.socialAuthService.loginWithFacebook().subscribe({
      next: (socialData) => {
        this.authService.socialLogin(socialData).subscribe({
          next: (response) => {
            this.handleSuccessfulLogin(response);
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.notificationService.showError(error.message);
        this.loading = false;
      }
    });
  }

  loginWithGitHub(): void {
    this.loading = true;
    this.socialAuthService.loginWithGitHub().subscribe({
      next: (socialData) => {
        this.authService.socialLogin(socialData).subscribe({
          next: (response) => {
            this.handleSuccessfulLogin(response);
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.notificationService.showError(error.message);
        this.loading = false;
      }
    });
  }

  cancel2FA(): void {
    this.requires2FA = false;
    this.pendingEmail = '';
    this.twoFAForm.reset();
  }
}
