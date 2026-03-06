import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SocialLoginRequest } from '../models/social-login-request.model';

/**
 * Servicio para manejar autenticación con proveedores sociales
 * 
 * IMPORTANTE: Este servicio requiere la instalación de SDKs de terceros:
 * - Google: npm install @abacritt/angularx-social-login
 * - Facebook: Facebook SDK (script en index.html)
 * - GitHub: OAuth flow manual
 */
@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {

  constructor() {}

  /**
   * Inicializa el login con Google
   * Requiere: @abacritt/angularx-social-login
   */
  loginWithGoogle(): Observable<SocialLoginRequest> {
    // TODO: Implementar con Google SDK
    // Ejemplo de implementación:
    /*
    return from(this.googleAuthService.signIn()).pipe(
      map(user => ({
        provider: 'GOOGLE' as const,
        accessToken: user.idToken,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.photoUrl
      }))
    );
    */
    
    return throwError(() => new Error('Google Login no implementado. Instalar @abacritt/angularx-social-login'));
  }

  /**
   * Inicializa el login con Facebook
   * Requiere: Facebook SDK
   */
  loginWithFacebook(): Observable<SocialLoginRequest> {
    // TODO: Implementar con Facebook SDK
    // Ejemplo de implementación:
    /*
    return from(new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          FB.api('/me', { fields: 'email,first_name,last_name,picture' }, (user: any) => {
            resolve({
              provider: 'FACEBOOK',
              accessToken: response.authResponse.accessToken,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              profilePicture: user.picture?.data?.url
            });
          });
        } else {
          reject(new Error('Facebook login cancelado'));
        }
      }, { scope: 'email,public_profile' });
    }));
    */
    
    return throwError(() => new Error('Facebook Login no implementado. Configurar Facebook SDK'));
  }

  /**
   * Inicializa el login con GitHub
   * Requiere: OAuth flow con GitHub
   */
  loginWithGitHub(): Observable<SocialLoginRequest> {
    // TODO: Implementar OAuth flow con GitHub
    // Pasos:
    // 1. Redirigir a: https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=user:email
    // 2. GitHub redirige de vuelta con un code
    // 3. Intercambiar code por access_token en el backend
    // 4. Obtener información del usuario con el access_token
    
    return throwError(() => new Error('GitHub Login no implementado. Configurar OAuth flow'));
  }

  /**
   * Cierra sesión de Google
   */
  logoutGoogle(): Observable<void> {
    // TODO: Implementar logout de Google
    return from(Promise.resolve());
  }

  /**
   * Cierra sesión de Facebook
   */
  logoutFacebook(): Observable<void> {
    // TODO: Implementar logout de Facebook
    return from(Promise.resolve());
  }
}
