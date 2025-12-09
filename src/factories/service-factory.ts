import { BadgeSubscriptionRepository } from "../repositories/badge-subscription-repository"
import { UserRepository } from "../repositories/user-repository"
import { AuthService } from "../services/auth-service"
import { BadgeSubscriptionService } from "../services/badge-subscription-service"

export const authServiceFactory = (): AuthService => {
  return new AuthService(new UserRepository())
}

export const badgeSubscriptionServiceFactory = (): BadgeSubscriptionService => {
  return new BadgeSubscriptionService(new BadgeSubscriptionRepository())
}