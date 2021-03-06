import { User } from './user.model';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
  showPassword?: boolean;
}

interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  showPassword?: boolean;
}

export type { AuthResponse, LoginRequest, RegistrationRequest };
