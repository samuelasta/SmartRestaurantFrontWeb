import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { StorageService } from '@core/services/storage.service';
import { CustomValidators } from '@shared/validators/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  loading = false;
  otpRequested = false;
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const user = this.storageService.getUser();
    this.userEmail = user?.email || '';
  }

  initForm(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), CustomValidators.passwordStrength()]],
      confirmPassword: ['', [Validators.required]],
      otp: ['', []] // Inicialmente no requerido
    });

    this.changePasswordForm.get('confirmPassword')?.setValidators([
      Validators.required,
      CustomValidators.matchPassword('newPassword')
    ]);
  }

  requestOtp(): void {
    if (!this.userEmail) {
      this.notificationService.showError('No se pudo obtener el email del usuario');
      return;
    }

    this.loading = true;
    this.authService.requestPasswordChange(this.userEmail).subscribe({
      next: () => {
        this.notificationService.showSuccess('Código OTP enviado a tu correo');
        this.otpRequested = true;
        // Hacer el campo OTP requerido
        this.changePasswordForm.get('otp')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.changePasswordForm.get('otp')?.updateValueAndValidity();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid && this.otpRequested) {
      this.loading = true;
      const { currentPassword, newPassword, otp } = this.changePasswordForm.value;
      
      const request = {
        email: this.userEmail,
        currentPassword,
        newPassword,
        otp
      };
      
      this.authService.changePassword(request).subscribe({
        next: () => {
          this.notificationService.showSuccess('Contraseña cambiada exitosamente');
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else if (!this.otpRequested) {
      this.notificationService.showWarning('Primero debes solicitar el código OTP');
    }
  }
}
