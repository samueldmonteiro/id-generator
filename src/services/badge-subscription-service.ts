import sharp from "sharp";
import { BadgeSubscriptionRepository } from "../repositories/badge-subscription-repository";
import { TraineeSubscriptionDTO } from "../schemas/badge-subscriptions/trainee-subscription-schema";
import { BadgeSubscription } from "../generated/prisma/client";
import { TraineeBadgeFrontHTML } from "@/src/components/subscription/templates/trainee/front";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import fs from "fs/promises";
import { put } from "@vercel/blob";
import { InstitutionalSubscriptionDTO } from "../schemas/badge-subscriptions/institutional-subscription-schema";
import { InstitutionalBadgeHTML } from "../components/subscription/templates/institutional/front";

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
  constructor(private badgeSubscriptionRepo: BadgeSubscriptionRepository) { }

  public async traineeSubscription(dto: TraineeSubscriptionDTO): Promise<BadgeSubscription> {

    const result = await this.validateImage(dto.image);
    if (!result.ok) throw new Error(result.reason);

    const pdfBuffer = await this.generateTraineeBadgePDF(dto);
    const { badgeUrl, imageUrl } = await this.saveSubscriptionFiles({ image: dto.image, badge: pdfBuffer });

    return (await this.badgeSubscriptionRepo.prisma()).create({
      data: {
        name: dto.name,
        courseName: dto.course,
        badgeFile: badgeUrl,
        position: "ESTAGIARIO",
        image: imageUrl,
      }
    });
  }

  public async institutionalSubscription(dto: InstitutionalSubscriptionDTO): Promise<BadgeSubscription> {

    const result = await this.validateImage(dto.image);
    if (!result.ok) throw new Error(result.reason);

    const pdfBuffer = await this.generateInstitutionalBadgePDF(dto);
    const { badgeUrl, imageUrl } = await this.saveSubscriptionFiles({ image: dto.image, badge: pdfBuffer });

    return (await this.badgeSubscriptionRepo.prisma()).create({
      data: {
        name: dto.name,
        courseName: 'teste',
        badgeFile: badgeUrl,
        position: dto.position,
        image: imageUrl,
      }
    });
  }

  private async saveSubscriptionFiles(files: { image: File, badge: Buffer }) {

    const imageBuffer = Buffer.from(await files.image.arrayBuffer());
    const imageUpload = await put(
      `subscriber-images/${Date.now()}-${files.image.name}`,
      imageBuffer,
      {
        access: "public",
        contentType: files.image.type
      }
    );

    const pdfUpload = await put(
      `subscription-pdfs/${Date.now()}.pdf`,
      files.badge,
      {
        access: "public",
        contentType: "application/pdf"
      }
    );

    return {
      badgeUrl: pdfUpload.url,
      imageUrl: imageUpload.url
    }
  }

 

  async generateTraineeBadgePDF(dto: TraineeSubscriptionDTO) {
    const { name, course, image } = dto;

    const userBuffer = Buffer.from(await image.arrayBuffer());
    const userBase64 = `data:${image.type};base64,${userBuffer.toString("base64")}`;

    const logoRaw = await fs.readFile("src/assets/anhanguera.png");
    const logoBase64 = `data:image/png;base64,${logoRaw.toString("base64")}`;

    const html = TraineeBadgeFrontHTML({
      name,
      course,
      imageBase64: userBase64,
      logoBase64,
    });

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "360px",
      height: "450px",
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }


  async generateInstitutionalBadgePDF(dto: InstitutionalSubscriptionDTO) {
    const { name, position, image } = dto;

    const userBuffer = Buffer.from(await image.arrayBuffer());
    const userBase64 = `data:${image.type};base64,${userBuffer.toString("base64")}`;

    const logoAnhangueraRaw = await fs.readFile("src/assets/anhanguera.png");
    const logoAnhangueraBase64 = `data:image/png;base64,${logoAnhangueraRaw.toString("base64")}`;

    const logoPitagorasRaw = await fs.readFile("src/assets/pitagoras.png");
    const logoPitagorasBase64 = `data:image/png;base64,${logoPitagorasRaw.toString("base64")}`;

    const html = InstitutionalBadgeHTML({
      name,
      position,
      imageBase64: userBase64,
      logoAnhangueraBase64,
      logoPitagorasBase64
    });

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "360px",
      height: "500px",
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }

  
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
//299