import axios from "axios";

export interface User {
  id: string;
  name: string;
}

export interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}

export const transport = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

export function loadUser() {
  return transport.get<ApiEnvelope<User>>("/users/1");
}
