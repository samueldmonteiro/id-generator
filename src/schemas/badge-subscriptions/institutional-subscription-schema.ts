import { z } from "zod";

export const institutionalSubscriptionSchema = z.object({
  name: z.string().max(100),
  role: z.enum(["Preceptor", "Professor", "Administrativo", "Tutor"], {
    message: "Selecione um cargo válido." 
  }),
  image: z.instanceof(File)
    .refine((file) => file.size > 0, "A imagem é obrigatória.")
    .refine((file) => file.size <= 5 * 1024 * 1024, "A imagem deve ter no máximo 5MB.")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Formato inválido. Use JPG, PNG ou WEBP."
    )
});

export type InstitutionalSubscriptionDTO = z.infer<typeof institutionalSubscriptionSchema>;
