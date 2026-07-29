import type { AxiosResponse } from "axios";

import type { HttpClient } from "../src/api/http/client";
// The entry re-exports types so call sites need a single import path.
import type { HttpClient as EntryHttpClient } from "../src/api/http/index";
// @ts-expect-error The entry exposes no factory, so no second client can be built.
import { createHttpClient as hiddenFactory } from "../src/api/http/index";

interface User {
  id: number;
  name: string;
}

interface CreateUserInput {
  name: string;
}

declare const http: HttpClient;

if (false) {
  const user: Promise<User> = http.get<User>("/users/1");
  const createdUser: Promise<User> = http.post<User, CreateUserInput>(
    "/users",
    {
      name: "Ada",
    },
  );

  // @ts-expect-error CreateUserInput.name must be a string.
  http.post<User, CreateUserInput>("/users", { name: 123 });

  // @ts-expect-error Swapping Result and Body makes the request body invalid.
  http.post<CreateUserInput, User>("/users", { name: "Ada" });

  // @ts-expect-error Request sharing is not part of the Axios core.
  http.get<User>("/users/1", { dedupe: true });

  // @ts-expect-error A business request cannot replace the trusted base URL.
  http.get<User>("/users/1", { baseURL: "https://evil.example" });

  // @ts-expect-error Cookie policy is fixed by the client factory.
  http.get<User>("/users/1", { withCredentials: true });

  // @ts-expect-error Success is decided by HTTP status, not by the call site.
  http.get<User>("/users/1", { validateStatus: () => true });

  // @ts-expect-error The transport layer belongs to this module.
  http.get<User>("/users/1", { adapter: () => Promise.reject(new Error()) });

  // @ts-expect-error Response bodies must reach the envelope adapter unmodified.
  http.get<User>("/users/1", { transformResponse: [] });

  // @ts-expect-error Serialization is configured once by the client factory.
  http.get<User>("/users/1", { paramsSerializer: () => "" });

  // 白名单内的请求描述字段仍然可用。
  const allowed: Promise<Blob> = http.get<Blob>("/reports/1", {
    params: { format: "pdf" },
    headers: { "x-trace": "1" },
    responseType: "blob",
    timeout: 30_000,
    signal: new AbortController().signal,
    onDownloadProgress: () => {},
  });

  const rawResponse: Promise<AxiosResponse<string, CreateUserInput>> = http.raw<
    string,
    CreateUserInput
  >({
    method: "post",
    url: "/reports",
    data: { name: "Ada" },
  });
  http.resetAuthState();

  void user;
  void createdUser;
  void rawResponse;
  void allowed;
  void hiddenFactory;
  void (undefined as unknown as EntryHttpClient);
}
