'use server'

import { UserRepository } from "../repositories/user-repository";
import { AuthService } from "../services/auth-service";

const userService = new AuthService(new UserRepository())

export const getUsers = async () => {
  return userService.getUsers();
}