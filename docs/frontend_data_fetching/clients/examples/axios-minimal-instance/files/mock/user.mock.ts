import { defineMock } from "vite-plugin-mock-dev-server";

export default defineMock({
  url: "/api/users/1",
  method: "GET",
  body: {
    code: 0,
    message: "ok",
    data: {
      id: "1",
      name: "Ada",
    },
  },
});
