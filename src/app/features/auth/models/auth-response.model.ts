export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
  is2faRequired: boolean;
  requiresPasswordChange: boolean;
}
