import { api } from "../api-client";
import type { User } from "../types";

export interface UserPreferences {
  dietary_restrictions: string[];
  health_conditions: string[];
}

export async function getPreferences(): Promise<UserPreferences> {
  return api.get<UserPreferences>("/user/preferences/");
}

export async function updatePreferences(
  prefs: UserPreferences
): Promise<UserPreferences> {
  return api.put<UserPreferences>("/user/preferences/", prefs);
}

export async function getProfile(): Promise<User> {
  return api.get<User>("/user/profile/");
}
