"use server";

import { loginSchema } from "../schemas/login-schema";
import { authServiceFactory } from "../factories/service-factory";
import { UserSafe } from "../types/user-type";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

const authService = authServiceFactory();

export interface LoginActionResponse {
  success?: boolean,
  formError?: string,
  errors?: { email?: string[], password?: string[] },
  data?: UserSafe
}

export async function login(_prevState: any, formData: FormData): Promise<LoginActionResponse> {

  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await authService.login(parsed.data);
    await createSession(result.id, result.role);
    return {
      success: true,
      data: result
    }

  } catch (err: any) {
    return {
      success: false,
      formError: err.message,
    };
  }
}
