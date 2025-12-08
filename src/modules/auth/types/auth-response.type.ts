// Type returned from login
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}
