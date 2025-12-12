'use server'

import { badgeSubscriptionServiceFactory } from "../factories/service-factory";
import { BadgeSubscription } from "../generated/prisma/client";
import { institutionalSubscriptionSchema } from "../schemas/badge-subscriptions/institutional-subscription-schema";
import { traineeSubscriptionSchema } from "../schemas/badge-subscriptions/trainee-subscription-schema";

export interface InstitutionalSubscriptionResponse {
  success: boolean,
  errors?: {
    name?: string[],
    position?: string[],
    image?: string[],
  },
  message?: string
  data?: BadgeSubscription
}


export interface TraineeSubscriptionResponse {
  success: boolean,
  errors?: {
    email?: string[],
    name?: string[],
    course?: string[],
    image?: string[],
  },
  message?: string,
  data?: BadgeSubscription
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

  try {
    const result = await badgeSubscriptionServiceFactory().traineeSubscription(parsed.data);
    return {
      success: true,
      data: result,
      message: "Sucesso"
    }
  } catch (error: any) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro inesperado."
    }
  }
}

export const institutionalSubscription = async (formData: FormData): Promise<InstitutionalSubscriptionResponse> => {
  const raw = Object.fromEntries(formData);
  const parsed = institutionalSubscriptionSchema.safeParse(raw);
  console.log("FORMDATA", formData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await badgeSubscriptionServiceFactory().institutionalSubscription(parsed.data);
    return {
      success: true,
      data: result,
      message: "Sucesso"
    }
  } catch (error: any) {
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro inesperado."
    }
  }
}
