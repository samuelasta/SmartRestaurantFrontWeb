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
        next: (response) => {
          if (response.is2faRequired) {
            // Requiere verificación 2FA
            this.requires2FA = true;
            this.pendingEmail = this.loginForm.value.email;
            this.loading = false;
            this.notificationService.showInfo('Por favor ingrese el código de verificación enviado a su correo');
          } else {
            // Login exitoso
            this.handleSuccessfulLogin(response);
          }
        },
        error: (error) => {
          this.loading = false;
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
        // Si falla obtener el usuario, redirigir a una ruta por defecto
        this.router.navigate(['/']);
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
