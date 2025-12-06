"use server";

import { loginSchema } from "../schemas/login-schema";
import { authService } from "../services/auth-service";

export async function login(
 _prevState: any,          

  formData: FormData 
){
  const raw = Object.fromEntries(formData);

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await authService(parsed.data);

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      formError: err.message,
    };
  }
}
