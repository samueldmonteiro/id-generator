import prisma from '../lib/prisma';

export class UserRepository {

  async prisma() {
    return prisma.user;
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}