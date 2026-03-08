import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@core/services/storage.service';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss']
})
export class CustomerHomeComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userFirstName: string = '';
  userLastName: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.userFirstName = user.firstName || '';
      this.userLastName = user.lastName || '';
      this.userName = `${this.userFirstName} ${this.userLastName}`.trim() || user.email;
      this.userEmail = user.email || '';
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
