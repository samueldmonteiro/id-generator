'use server'

import { badgeSubscriptionServiceFactory } from "../factories/service-factory";
import { traineeSubscriptionSchema } from "../schemas/badge-subscriptions/trainee-subscription-schema";

export interface TraineeSubscriptionResponse {
  success: boolean,
  errors?: {
    email?: string[],
    name?: string[],
    course?: string[],
    image?: string[],
  },
  errorForm?: string
}

export const traineeSubscription = async (formData: FormData): Promise<TraineeSubscriptionResponse> => {
  const raw = Object.fromEntries(formData);
  const parsed = traineeSubscriptionSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await badgeSubscriptionServiceFactory().traineeSubscription(parsed.data);

  return {
    success: false,
    errorForm: result?.reason
  }

}