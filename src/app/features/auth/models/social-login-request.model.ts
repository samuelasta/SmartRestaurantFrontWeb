export interface SocialLoginRequest {
  provider: 'GOOGLE' | 'FACEBOOK' | 'GITHUB';
  accessToken: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}
