import { beforeEach, expect, it, vi } from "vitest";

import { HttpError } from "../src/api/http/errors";

const { post } = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock("../src/api/http", () => ({
  http: { post },
}));

import {
  createUser,
  UserAlreadyExistsError,
} from "../src/api/modules/users";

beforeEach(() => {
  post.mockReset();
});

it("converts a silent 409 into a user-domain error", async () => {
  const httpError = new HttpError({
    kind: "http",
    status: 409,
    message: "HTTP request failed with status 409",
  });
  post.mockRejectedValue(httpError);

  await expect(createUser({ name: "Ada" })).rejects.toMatchObject({
    name: "UserAlreadyExistsError",
    cause: httpError,
  });
  expect(post).toHaveBeenCalledWith(
    "/users",
    { name: "Ada" },
    { errorMode: "silent" },
  );
  expect(UserAlreadyExistsError).toBeDefined();
});

it("keeps other silent failures available for page-level feedback", async () => {
  const httpError = new HttpError({
    kind: "http",
    status: 500,
    message: "HTTP request failed with status 500",
  });
  post.mockRejectedValue(httpError);

  await expect(createUser({ name: "Ada" })).rejects.toBe(httpError);
});
