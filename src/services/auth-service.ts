import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user-repository";
import { LoginDTO } from "../schemas/login-schema";
import { UserSafe } from "../types/user-type";

export class AuthService {

  constructor(
    private userRepo: UserRepository
  ) { }

  async login(dto: LoginDTO): Promise<UserSafe> {

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error('Login Incorreto!');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new Error('Login Incorreto');

    return {
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role
    }
  }

  async getUsers(): Promise<UserSafe[]> {
    return (await this.userRepo.prisma()).findMany({
      omit: { password: true }
    });
  }
}