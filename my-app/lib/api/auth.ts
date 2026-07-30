import { api, setTokens, clearTokens } from "../api-client";
import type { LoginResponse, RegisterResponse, User } from "../types";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>("/auth/login/", {
    email,
    password,
  });
  setTokens(data.access, data.refresh);
  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const data = await api.post<RegisterResponse>("/auth/register/", {
    name,
    email,
    password,
  });
  setTokens(data.access, data.refresh);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  return api.get<User>("/auth/user/");
}

export function logoutUser() {
  clearTokens();
}
