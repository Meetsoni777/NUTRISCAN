const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    setTokens(data.access, refresh);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  // If 401, try refreshing the token
  if (res.status === 401 && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...rest,
        headers,
        body: body
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
      });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `Error ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),

  upload: <T>(endpoint: string, formData: FormData) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {},
    }),
};

export { setTokens, clearTokens, getAccessToken, getRefreshToken };
