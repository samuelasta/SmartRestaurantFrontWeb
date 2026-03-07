import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smartRestaurante';
  currentRoute = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  showNavbar(): boolean {
    // No mostrar navbar en rutas de autenticación
    const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-account', 
                        '/auth/forgot-password', '/auth/reset-password'];
    return !authRoutes.some(route => this.currentRoute.startsWith(route));
  }
}
