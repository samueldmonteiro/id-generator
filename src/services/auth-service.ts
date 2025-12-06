// services/login.service.ts

import { LoginDTO } from "../schemas/login-schema";

export interface LoginResponse {
  token: string;
  userId: string;
}

export async function authService(data: LoginDTO): Promise<LoginResponse> {
  if (data.email !== "admin@admin.com") {
    throw new Error("Usuário ou senha inválidos");
  }

  return {
    token: "fake-jwt",
    userId: "123",
  };
}
