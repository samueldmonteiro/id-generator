import sharp from "sharp";
import { BadgeSubscriptionRepository } from "../repositories/badge-subscription-repository";

interface FaceValidationResult {
  ok: boolean;
  reason?: string;
  faceData?: {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    relativeSize: number;
  };
}

export class BadgeSubscriptionService {
  constructor(private repo: BadgeSubscriptionRepository) {}

  public async traineeSubscription(dto: {
    name: string;
    course: string;
    image: File;
  }) {
    const result = await this.validateImage(dto.image);

    if (!result.ok) return result;

    // await this.repo.create(...)

    return { ok: true, faceData: result.faceData };
  }

  // ---------------------------------------------
  // 1) Validação principal
  // ---------------------------------------------
  public async validateImage(file: File): Promise<FaceValidationResult> {
    try {
      // Formato válido
      if (!file.type.startsWith("image/")) {
        return { ok: false, reason: "Envie uma imagem válida." };
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return { ok: false, reason: "Use JPG, PNG ou WebP." };
      }

      // Tamanho razoável
      if (file.size < 10_000) {
        return { ok: false, reason: "Arquivo muito pequeno ou corrompido." };
      }
      if (file.size > 5_000_000) {
        return { ok: false, reason: "Imagem muito grande (máx. 5MB)." };
      }

      // Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Normaliza para análise
      const processed = await this.normalize(buffer);

      // Metadados
      const meta = await sharp(processed).metadata();

      if (!meta.width || !meta.height) {
        return { ok: false, reason: "Não foi possível ler a imagem." };
      }

      // Proporção retrato
      if (meta.width >= meta.height) {
        return { ok: false, reason: "Use uma foto em formato vertical." };
      }

      // Dimensões mínimas (evitar borrar ao imprimir)
      if (meta.width < 400 || meta.height < 500) {
        return {
          ok: false,
          reason: "A imagem deve ter pelo menos 400x500 pixels.",
        };
      }

      // Face detection simples (mock estável)
      const face = this.mockDetectFace(meta.width, meta.height);

      // Tamanho relativo do rosto
      const faceArea = face.width * face.height;
      const imgArea = meta.width * meta.height;
      const relativeSize = faceArea / imgArea;

      if (relativeSize < 0.10) {
        return {
          ok: false,
          reason: "O rosto está muito distante. Aproxime-se da câmera.",
        };
      }
      if (relativeSize > 0.45) {
        return {
          ok: false,
          reason: "O rosto está muito próximo. Afaste-se um pouco.",
        };
      }

      // Centralização
      const imgCenterX = meta.width / 2;
      const imgCenterY = meta.height / 2;

      const offsetX = Math.abs(face.centerX - imgCenterX) / imgCenterX;
      const offsetY = Math.abs(face.centerY - imgCenterY) / imgCenterY;

      if (offsetX > 0.35) {
        return { ok: false, reason: "Centralize melhor o rosto na horizontal." };
      }
      if (offsetY > 0.40) {
        return { ok: false, reason: "Centralize melhor o rosto na vertical." };
      }

      return {
        ok: true,
        faceData: { ...face, relativeSize },
      };
    } catch (err) {
      return {
        ok: false,
        reason: "Erro ao processar a imagem. Envie uma nova foto.",
      };
    }
  }

  // ---------------------------------------------
  // 2) Normalização simples
  // ---------------------------------------------
  private async normalize(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .jpeg({ quality: 90 })
      .resize(1200, null, { withoutEnlargement: true })
      .toBuffer();
  }

  // ---------------------------------------------
  // 3) Mock de detecção extremamente estável
  // ---------------------------------------------
  private mockDetectFace(imgW: number, imgH: number) {
    // Simula um rosto no centro com tamanho razoável
    const faceW = imgW * 0.45;
    const faceH = faceW * 1.25;

    const x = (imgW - faceW) / 2;
    const y = (imgH - faceH) / 2;

    return {
      x,
      y,
      width: faceW,
      height: faceH,
      centerX: x + faceW / 2,
      centerY: y + faceH / 2,
    };
  }
}
