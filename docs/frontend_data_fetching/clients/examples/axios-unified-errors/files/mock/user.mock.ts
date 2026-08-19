import { defineMock } from "vite-plugin-mock-dev-server";

export default defineMock([
  {
    url: "/api/users/1",
    method: "GET",
    body: {
      code: 0,
      message: "ok",
      data: { id: "1", name: "Ada" },
    },
  },
  {
    url: "/api/users/forbidden",
    method: "GET",
    status: 403,
    body: {
      code: 403,
      message: "没有查看此用户的权限",
      data: null,
    },
  },
  {
    url: "/api/users/server-error",
    method: "GET",
    status: 500,
    body: {
      code: 500,
      message: "Database connection failed at internal-host:5432",
      data: null,
    },
  },
  {
    url: "/api/users/timeout",
    method: "GET",
    delay: 900,
    body: {
      code: 0,
      message: "ok",
      data: { id: "2", name: "Grace" },
    },
  },
  {
    url: "/api/users/broken-response",
    method: "GET",
    body: { id: "1", name: "Ada" },
  },
]);
