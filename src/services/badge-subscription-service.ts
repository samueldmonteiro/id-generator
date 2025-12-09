import sharp from "sharp";
import { BadgeSubscriptionRepository } from "../repositories/badge-subscription-repository";
import { TraineeSubscriptionDTO } from "../schemas/badge-subscriptions/trainee-subscription-schema";

export class BadgeSubscriptionService {
  constructor(private badgeSubscriptionRepo: BadgeSubscriptionRepository) { }

  async traineeSubscription(dto: TraineeSubscriptionDTO) {
    const { name, course, image } = dto;

    // 1. Garantir que é um File
    if (!(image instanceof File)) {
      throw new Error("A imagem enviada é inválida.");
    }

    // 2. Tamanho máximo de arquivo (ex: 3MB)
    const maxSize = 3 * 1024 * 1024;
    if (image.size > maxSize) {
      throw new Error("A imagem é muito grande. Máximo permitido: 3MB.");
    }

    // 3. Validar MIME type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(image.type)) {
      throw new Error("Formato inválido. Use JPG, PNG ou WEBP.");
    }

    // 4. Converter para Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Ler metadados
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    if (!width || !height) {
      throw new Error("Não foi possível ler a imagem.");
    }

    // 6. Dimensões mínimas
    if (width < 300 || height < 400) {
      throw new Error("A imagem é muito pequena. Min: 300x400 pixels.");
    }

    // 7. Garantir que é vertical (retratos)
    const aspect = height / width;
    if (aspect < 1.2) {
      throw new Error("Use uma foto em orientação retrato (vertical).");
    }

    // 8. Medir nitidez (forma simples)
    const laplace = await this.getSharpnessScore(buffer);
    if (laplace < 5) {
      throw new Error("A imagem está desfocada demais.");
    }

    // 9. Conferir contraste no centro (garantir rosto visível)
    const isValidContrast = await this.checkCenterContrast(buffer);
    if (!isValidContrast) {
      throw new Error("A foto está muito escura ou clara no centro.");
    }

    // --- Se passar aqui, a imagem é decente para o crachá ---

    return {
      ok: true
    }
  }

  async getSharpnessScore(buffer: Buffer): Promise<number> {
    const gray = await sharp(buffer)
      .grayscale()
      .raw()
      .normalise()
      .toBuffer({ resolveWithObject: true });

    const pixels = gray.data;
    let sumSqDiff = 0;

    for (let i = 1; i < pixels.length; i++) {
      const diff = pixels[i] - pixels[i - 1];
      sumSqDiff += diff * diff;
    }

    return sumSqDiff / pixels.length; // quanto menor, mais borrada
  }

  async checkCenterContrast(buffer: Buffer): Promise<boolean> {
    const { data, info } = await sharp(buffer)
      .resize(200, 200)
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    const startX = Math.floor(width * 0.3);
    const endX = Math.floor(width * 0.7);
    const startY = Math.floor(height * 0.3);
    const endY = Math.floor(height * 0.7);

    let pixels: number[] = [];

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        pixels.push(data[y * width + x]);
      }
    }

    const mean =
      pixels.reduce((a, b) => a + b, 0) / pixels.length;

    const variance =
      pixels.reduce((a, b) => a + (b - mean) ** 2, 0) /
      pixels.length;

    return variance > 500; // threshold simples & funcional
  }


}
