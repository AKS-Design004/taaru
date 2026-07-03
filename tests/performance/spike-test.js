import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.API_URL || "http://localhost:8080";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "10s", target: 200 },
    { duration: "30s", target: 200 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<4000"],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/providers/featured`);
  check(res, {
    "featured status is 200": (r) => r.status === 200,
  });
  sleep(1);
}
