import { UserRole } from '@features/auth/models/user-role.enum';

export interface ChangeRoleRequest {
  role: UserRole;
}
