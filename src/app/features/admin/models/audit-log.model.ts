import { AuditEventType } from './audit-event-type.enum';

export interface AuditLogResponse {
  id: number;
  userId: number | null;
  userEmail: string | null;
  eventType: AuditEventType;
  eventTypeName: string;
  timestamp: string;
  ipAddress: string | null;
  userAgent: string | null;
  details: string | null;
  success: boolean;
  errorMessage: string | null;
  critical: boolean;
}
