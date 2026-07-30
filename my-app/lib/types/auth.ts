export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
