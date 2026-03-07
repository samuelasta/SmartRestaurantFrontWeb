import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '@core/services/http-client.service';
import { AuditLogResponse } from '../models/audit-log.model';
import { AuditEventType } from '../models/audit-event-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly API_URL = '/api/admin/audit-logs';

  constructor(private http: HttpClientService) {}

  // Obtener todos los logs con paginación
  getAllLogs(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}?page=${page}&size=${size}`);
  }

  // Logs por usuario
  getLogsByUser(userId: number, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/by-user?userId=${userId}&page=${page}&size=${size}`);
  }

  // Logs por tipo de evento
  getLogsByEventType(eventType: AuditEventType, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/by-event-type?eventType=${eventType}&page=${page}&size=${size}`);
  }

  // Logs por rango de fechas
  getLogsByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/by-date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
  }

  // Logs fallidos
  getFailedLogs(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/failed?page=${page}&size=${size}`);
  }

  // Logs críticos
  getCriticalLogs(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/critical?page=${page}&size=${size}`);
  }

  // Últimos logs de usuario
  getRecentLogsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/recent-by-user?userId=${userId}`);
  }

  // Logs por IP
  getLogsByIp(ipAddress: string, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.API_URL}/by-ip?ipAddress=${ipAddress}&page=${page}&size=${size}`);
  }
}
