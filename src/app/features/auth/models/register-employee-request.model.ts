import { UserRole } from './user-role.enum';

export interface RegisterEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
