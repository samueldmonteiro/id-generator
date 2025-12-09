import { z } from "zod";

export const traineeSubscriptionSchema = z.object({
  name: z.string().max(100),
  course: z.string().max(100),
  image: z.instanceof(File)
    .refine((file) => file.size > 0, "A imagem é obrigatória.")
    .refine((file) => file.size <= 5 * 1024 * 1024, "A imagem deve ter no máximo 5MB.")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Formato inválido. Use JPG, PNG ou WEBP."
    )
});

export type TraineeSubscriptionDTO = z.infer<typeof traineeSubscriptionSchema>;
