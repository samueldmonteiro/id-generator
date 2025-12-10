'use server'

import { institutionalSubscriptionSchema } from "../schemas/badge-subscriptions/institutional-subscription-schema";

export interface InstitutionalSubscriptionResponse {
  success: boolean,
  errors?: {
    name?: string[],
    role?: string[],
    image?: string[],
  },
  errorForm?: string
}

export const institutionalSubscription = async (formData: FormData): Promise<InstitutionalSubscriptionResponse> => {
  const raw = Object.fromEntries(formData);
  const parsed = institutionalSubscriptionSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // Mocking service call as per instructions to focus on frontend
    // const result = await badgeSubscriptionServiceFactory().institutionalSubscription(parsed.data);
    console.log("Institutional Subscription Data:", parsed.data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
    }
  } catch (error: any) {
    console.log("ERRO", error.message)

    return {
      success: false,
      errorForm: error.message
    }
  }
}
