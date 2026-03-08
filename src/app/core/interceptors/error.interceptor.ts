import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { ErrorResponse } from '../models/error-response.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Verificar si es una respuesta de 2FA (el backend devuelve is2faRequired en el error)
        if (error.error && error.error.is2faRequired) {
          // No mostrar error, el componente manejará el 2FA
          return throwError(() => error);
        }

        const errorMessage = this.extractErrorMessage(error);
        this.handleErrorByStatus(error.status, errorMessage);

        return throwError(() => error);
      })
    );
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    // Error de red o del cliente
    if (error.error instanceof ErrorEvent) {
      return `Error de conexión: ${error.error.message}`;
    }

    // Sin respuesta del servidor (timeout, red caída, etc.)
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
    }

    // Intentar extraer el mensaje del backend
    const errorResponse = error.error as ErrorResponse;
    let message = '';

    // Prioridad 1: mensaje del backend
    if (errorResponse?.message) {
      message = errorResponse.message;
      // Si hay detalles adicionales, agregarlos
      if (errorResponse.details && errorResponse.details.length > 0) {
        message = `${message}: ${errorResponse.details.join(', ')}`;
      }
    }
    // Prioridad 2: error como string directo
    else if (typeof error.error === 'string') {
      message = error.error;
    }
    // Prioridad 3: mensaje genérico según código HTTP
    else {
      message = this.getDefaultErrorMessage(error.status);
    }

    return this.sanitizeErrorMessage(message);
  }

  private sanitizeErrorMessage(message: string): string {
    if (!message) return message;

    const technicalKeywords = [
      'could not execute statement',
      'ERROR:',
      'duplicate key',
      'SQL',
      'Hibernate',
      'constraint',
      'violates unique',
      'insert into',
      'update ',
      'delete from'
    ];

    const isTechnical = technicalKeywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isTechnical) {
      return 'Ha ocurrido un error al procesar la solicitud. Por favor, intente nuevamente.';
    }

    return message;
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Solicitud inválida. Verifique los datos enviados.';
      case 401:
        return 'No autorizado. Por favor inicie sesión nuevamente.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'Conflicto con el estado actual del recurso.';
      case 422:
        return 'Los datos proporcionados no son válidos.';
      case 429:
        return 'Demasiadas solicitudes. Por favor intente más tarde.';
      case 500:
        return 'Error interno del servidor.';
      case 502:
        return 'Error de comunicación con el servidor.';
      case 503:
        return 'Servicio no disponible temporalmente.';
      case 504:
        return 'Tiempo de espera agotado.';
      default:
        return 'Ha ocurrido un error inesperado. Por favor intente nuevamente.';
    }
  }

  private handleErrorByStatus(status: number, message: string): void {
    // Mostrar notificación
    this.notificationService.showError(message);

    // Acciones específicas según el código de estado
    switch (status) {
      case 401:
        // Redirigir al login solo si no estamos ya en una ruta de autenticación
        if (!window.location.pathname.includes('/auth/')) {
          this.router.navigate(['/auth/login']);
        }
        break;
      case 403:
        // Opcional: redirigir a página de acceso denegado
        // this.router.navigate(['/access-denied']);
        break;
    }
  }
}
