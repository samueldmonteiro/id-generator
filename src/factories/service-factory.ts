import { UserRepository } from "../repositories/user-repository"
import { AuthService } from "../services/auth-service"

export const authServiceFactory = (): AuthService => {
  return new AuthService(new UserRepository())
}