import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = __ENV.API_URL || "http://localhost:8080";

const errorRate = new Rate("errors");
const authTrend = new Trend("auth_duration");
const providerTrend = new Trend("provider_duration");

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    errors: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
    auth_duration: ["p(95)<3000"],
    provider_duration: ["p(95)<2000"],
  },
};

export default function () {
  group("Auth endpoints", () => {
    const registerPayload = {
      email: `perf_${Date.now()}_${__VU}@taaru.sn`,
      password: "Test@1234",
      firstName: "Perf",
      lastName: `VU${__VU}`,
      role: "PROFESSIONAL",
    };

    const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(registerPayload), {
      headers: { "Content-Type": "application/json" },
    });
    authTrend.add(registerRes.timings.duration);
    check(registerRes, {
      "register status is 201": (r) => r.status === 201,
    }) || errorRate.add(1);

    if (registerRes.status === 201) {
      const token = registerRes.json("data.accessToken");

      const meRes = http.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      check(meRes, {
        "me status is 200": (r) => r.status === 200,
      }) || errorRate.add(1);
    }
  });

  group("Provider endpoints", () => {
    const clientPayload = {
      email: `perf_client_${Date.now()}_${__VU}@taaru.sn`,
      password: "Test@1234",
      firstName: "Client",
      lastName: `VU${__VU}`,
      role: "CLIENT",
    };

    const clientRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(clientPayload), {
      headers: { "Content-Type": "application/json" },
    });

    if (clientRes.status === 201) {
      const token = clientRes.json("data.accessToken");

      const featuredRes = http.get(`${BASE_URL}/api/providers/featured`);
      providerTrend.add(featuredRes.timings.duration);
      check(featuredRes, {
        "featured status is 200": (r) => r.status === 200,
        "featured returns array": (r) => Array.isArray(r.json("data")),
      }) || errorRate.add(1);

      const searchRes = http.get(`${BASE_URL}/api/providers?city=Dakar`);
      providerTrend.add(searchRes.timings.duration);
      check(searchRes, {
        "search status is 200": (r) => r.status === 200,
      }) || errorRate.add(1);
    }
  });

  sleep(1);
}
