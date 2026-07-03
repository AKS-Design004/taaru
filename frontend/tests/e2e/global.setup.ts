import { test as setup } from "@playwright/test";

setup("create test auth state", async ({ request }) => {
  const API_BASE = process.env.API_URL || "http://localhost:8080";

  for (const role of ["CLIENT", "PROFESSIONAL"] as const) {
    const email = `setup_${role.toLowerCase()}_${Date.now()}@taaru.sn`;
    const res = await request.post(`${API_BASE}/api/auth/register`, {
      data: {
        email,
        password: "Test@1234",
        firstName: "Setup",
        lastName: role === "CLIENT" ? "Client" : "Pro",
        role,
      },
    });
    if (!res.ok()) {
      const body = await res.text();
      throw new Error(`Setup register ${role} failed (${res.status()}): ${body}`);
    }
  }
});
