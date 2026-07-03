import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const BASE_URL = __ENV.API_URL || "http://localhost:8080";

const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "3m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "3m", target: 500 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    errors: ["rate<0.10"],
    http_req_duration: ["p(95)<5000"],
  },
};

export default function () {
  const endpoints = [
    { method: "GET", url: "/api/providers/featured" },
    { method: "GET", url: "/api/providers?city=Dakar" },
    { method: "GET", url: "/api/health" },
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`${BASE_URL}${endpoint.url}`);

  check(res, {
    "status is 200": (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(Math.random() * 2);
}
