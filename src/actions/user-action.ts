'use server'

import { User } from "../generated/prisma/client";
import prisma from "../lib/prisma"

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
}