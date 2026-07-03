import { APIRequestContext } from "@playwright/test";

const API_BASE = process.env.API_URL || "http://localhost:8080";

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export async function registerUser(
  request: APIRequestContext,
  role: "CLIENT" | "PROFESSIONAL"
): Promise<AuthData> {
  const email = `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@taaru.sn`;
  const res = await request.post(`${API_BASE}/api/auth/register`, {
    data: {
      email,
      password: "Test@1234",
      firstName: "E2E",
      lastName: "Test",
      role,
    },
  });
  if (!res.ok()) {
    const body = await res.text();
    throw new Error(`Register failed (${res.status()}): ${body}`);
  }
  const json = await res.json();
  return json.data as AuthData;
}

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
