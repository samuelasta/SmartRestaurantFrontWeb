import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  loading = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        if (!response.error && response.message) {
          this.user = response.message as User;
          this.profileForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar perfil:', err);
        this.loading = false;
        this.notificationService.showError('Error al cargar el perfil');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      this.profileForm.get('firstName')?.enable();
      this.profileForm.get('lastName')?.enable();
    } else {
      this.profileForm.get('firstName')?.disable();
      this.profileForm.get('lastName')?.disable();
      // Restaurar valores originales
      if (this.user) {
        this.profileForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName
        });
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    // Nota: Necesitarías un endpoint en el backend para que el usuario actualice su propio perfil
    // Por ahora, solo mostramos un mensaje
    this.notificationService.showInfo('Funcionalidad de actualización de perfil pendiente de implementar en el backend');
    this.toggleEdit();
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
