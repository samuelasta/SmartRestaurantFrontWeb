import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  roleDisplayName: string;
  status: UserStatus;
  statusDisplayName: string;
  isEmailVerified: boolean;
  requiresPasswordChange: boolean;
  failedLoginAttempts: number;
  lockReason?: string;
  lockedAt?: string;
  createdAt: string;
  updatedAt: string;
}
