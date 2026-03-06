import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  verifyForm!: FormGroup;
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
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      this.loading = true;
      const { email, code } = this.verifyForm.value;
      
      const request = {
        email,
        code: this.verifyForm.value.otp // El backend espera 'code', no 'otp'
      };
      
      this.authService.verifyEmail(request).subscribe({
        next: () => {
          this.notificationService.showSuccess('Cuenta verificada exitosamente');
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
