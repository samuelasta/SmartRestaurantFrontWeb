import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { CustomValidators } from '@shared/validators/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, CustomValidators.passwordStrength()]],
      confirmPassword: ['', [Validators.required]]
    });

    this.resetPasswordForm.get('confirmPassword')?.setValidators([
      Validators.required,
      CustomValidators.matchPassword('newPassword')
    ]);
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      const { email, otp, newPassword } = this.resetPasswordForm.value;
      
      const request = {
        email,
        otp,
        newPassword
      };
      
      this.authService.resetPassword(request).subscribe({
        next: () => {
          this.notificationService.showSuccess('Contraseña restablecida exitosamente');
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
