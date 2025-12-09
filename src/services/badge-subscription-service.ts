import nodeUtil from "util";

// Configuração global completa
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = nodeUtil.TextEncoder as any;
  global.TextDecoder = nodeUtil.TextDecoder as any;
}

if (typeof global.window === 'undefined') {
  global.window = {} as any;
}

// --------
import sharp from "sharp";
import * as faceapi from "@vladmandic/face-api";
import { Canvas, Image, ImageData } from "canvas";
import path from "path";

// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });


// Carregamento único dos modelos
let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;

  const modelPath = path.join(process.cwd(), "public/models");

  await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);

  modelsLoaded = true;
}

export class BadgeSubscriptionService {
  /**
   * Valida a imagem e retorna o buffer processado pronto para upload.
   */
  async validateImage(fileBuffer: Buffer) {
    await loadModels();

    // Padroniza formato, remove EXIF, gira se necessário
    const processedBuffer = await sharp(fileBuffer)
      .rotate()
      .jpeg({ quality: 90 })
      .toBuffer();

    const img = await loadCanvasImage(processedBuffer);

    // Detecta rosto
    const detections = await faceapi
      .detectAllFaces(
        img as any,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        })
      )
      .withFaceLandmarks();

    // --- REGRAS DE VALIDAÇÃO ---
    if (detections.length === 0) {
      throw new Error("Nenhum rosto foi detectado na imagem.");
    }

    if (detections.length > 1) {
      throw new Error("Há mais de um rosto na imagem. Use uma foto individual.");
    }

    const { box } = detections[0].detection;

    const width = img.width;
    const height = img.height;

    // Tamanho mínimo para qualidade decente
    if (width < 400 || height < 500) {
      throw new Error("A imagem está muito pequena. Use uma foto maior ou mais nítida.");
    }

    // Centralização do rosto com 20% de tolerância
    const faceCenterX = box.x + box.width / 2;
    const faceCenterY = box.y + box.height / 2;

    const imgCenterX = width / 2;
    const imgCenterY = height / 2;

    const toleranceX = width * 0.2;
    const toleranceY = height * 0.2;

    if (Math.abs(faceCenterX - imgCenterX) > toleranceX) {
      throw new Error("O rosto não está centralizado horizontalmente.");
    }

    if (Math.abs(faceCenterY - imgCenterY) > toleranceY) {
      throw new Error("O rosto não está centralizado verticalmente.");
    }

    // Face mínima para evitar foto de corpo inteiro
    const faceArea = box.width * box.height;
    const imgArea = width * height;

    if (faceArea < imgArea * 0.05) {
      throw new Error("O rosto está muito pequeno na imagem.");
    }

    // Foto válida
    return {
      ok: true,
      buffer: processedBuffer,
      info: {
        width,
        height,
        faceBox: box,
      },
    };
  }
}

// Carrega a imagem no canvas
function loadCanvasImage(buffer: Buffer) {
  return new Promise<Image>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = buffer;
  });
}
