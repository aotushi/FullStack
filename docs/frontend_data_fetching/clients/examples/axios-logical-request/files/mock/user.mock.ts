import { defineMock } from "vite-plugin-mock-dev-server";

export default defineMock([
  {
    url: "/api/users/1",
    method: "GET",
    delay: 250,
    body: {
      code: 0,
      message: "ok",
      data: { id: "1", name: "Ada" },
    },
  },
  {
    url: "/api/users/fast",
    method: "GET",
    delay: 120,
    body: {
      code: 0,
      message: "ok",
      data: { id: "2", name: "Grace" },
    },
  },
  {
    url: "/api/users/slow",
    method: "GET",
    delay: 700,
    body: {
      code: 0,
      message: "ok",
      data: { id: "1", name: "Ada" },
    },
  },
  {
    url: "/api/users/failure",
    method: "GET",
    delay: 200,
    status: 500,
    body: {
      code: 500,
      message: "Database connection failed at internal-host:5432",
      data: null,
    },
  },
]);
