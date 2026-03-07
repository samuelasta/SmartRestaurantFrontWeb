import { UserRole } from '@features/auth/models/user-role.enum';

export interface RegisterEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
