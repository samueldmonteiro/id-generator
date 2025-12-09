import { User } from "../generated/prisma/client";

// 2. Tipo mínimo que SEMPRE existe (sem relações)
export type UserBase = User;

// 3. Tipos para casos específicos
export type UserWithProfile = User & {
  //profile?: Profile; // Relação opcional
};

export type UserWithRelations = User & {
  //profile?: Profile;
  //posts?: Post[];
  // outras relações que você usa frequentemente
};

// 5. Tipo seguro para respostas públicas
export type UserSafe = Omit<UserBase, 'password' | 'resetToken' | 'otherSensitiveData'>;

// 6. Tipo genérico para queries flexíveis
export type UserWith<T extends Record<string, any>> = User & T;