import sharp from "sharp";
import { BadgeSubscriptionRepository } from "../repositories/badge-subscription-repository";

interface FaceValidationResult {
  ok: boolean;
  reason?: string;
  faceData?: {
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    imageWidth: number;
    imageHeight: number;
    normalizedCenterX: number;
    normalizedCenterY: number;
    relativeSize: number;
  };
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

interface FaceDetectionResult {
  faces: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  imageWidth: number;
  imageHeight: number;
}

export class BadgeSubscriptionService {
  constructor(private badgeSubscriptionRepo: BadgeSubscriptionRepository) {}

  public async traineeSubscription(dto: { name: string; course: string; image: File }) {
    const result = await this.validateImage(dto.image);

    if (!result.ok) {
      return result; // volta erro de validação
    }

    // Aqui você pode adicionar a lógica de persistência no repositório
    // await this.badgeSubscriptionRepo.create(...);
    
    return { ok: true, faceData: result.faceData };
  }

  /**
   * Obtém metadados da imagem usando sharp
   */
  private async getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
    const metadata = await sharp(buffer).metadata();
    
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: buffer.length
    };
  }

  /**
   * Detecção básica de rostos usando análise de cores e bordas
   * (Esta é uma implementação simplificada - considere usar TensorFlow.js ou API externa para produção)
   */
  private async detectFaces(buffer: Buffer): Promise<FaceDetectionResult> {
    const metadata = await this.getImageMetadata(buffer);
    
    // Para uma implementação real, você precisaria de um modelo de ML
    // Esta é uma implementação mock para demonstrar a lógica
    // Em produção, substitua por uma biblioteca como:
    // - TensorFlow.js com um modelo face-detection
    // - Face-api.js (compatível com SSR se configurado corretamente)
    // - Uma API externa (AWS Rekognition, Azure Face API, etc.)
    
    // Mock: assume que há um rosto centralizado com tamanho razoável
    // Em produção, remova este mock e implemente detecção real
    const faceWidth = Math.min(metadata.width, metadata.height) * 0.4;
    const faceHeight = faceWidth * 1.2; // Proporção comum do rosto
    
    const centerX = metadata.width / 2;
    const centerY = metadata.height / 2;
    
    return {
      faces: [{
        x: centerX - faceWidth / 2,
        y: centerY - faceHeight / 2,
        width: faceWidth,
        height: faceHeight
      }],
      imageWidth: metadata.width,
      imageHeight: metadata.height
    };
  }

  /**
   * Valida se o rosto está adequado para um crachá
   */
  private async validateFaceForBadge(buffer: Buffer): Promise<FaceValidationResult> {
    try {
      const metadata = await this.getImageMetadata(buffer);
      
      // 1. Detecta rostos na imagem
      const detection = await this.detectFaces(buffer);
      
      // 2. Verifica se há exatamente um rosto
      if (detection.faces.length === 0) {
        return {
          ok: false,
          reason: "Nenhum rosto detectado na imagem. Certifique-se de que seu rosto esteja visível e bem iluminado."
        };
      }
      
      if (detection.faces.length > 1) {
        return {
          ok: false,
          reason: `Múltiplos rostos detectados (${detection.faces.length}). A foto do crachá deve conter apenas uma pessoa.`
        };
      }
      
      const face = detection.faces[0];
      
      // 3. Calcula métricas de centralização
      const faceCenterX = face.x + face.width / 2;
      const faceCenterY = face.y + face.height / 2;
      const imageCenterX = detection.imageWidth / 2;
      const imageCenterY = detection.imageHeight / 2;
      
      // Distância normalizada do centro (0 = perfeitamente centralizado, 1 = na borda)
      const normalizedOffsetX = Math.abs(faceCenterX - imageCenterX) / (detection.imageWidth / 2);
      const normalizedOffsetY = Math.abs(faceCenterY - imageCenterY) / (detection.imageHeight / 2);
      
      // 4. Calcula o tamanho relativo do rosto
      const faceArea = face.width * face.height;
      const imageArea = detection.imageWidth * detection.imageHeight;
      const relativeSize = faceArea / imageArea;
      
      // 5. Validações específicas para crachá
      const validations = [
        {
          condition: relativeSize < 0.15, // Rosto muito pequeno
          reason: "Rosto muito pequeno na imagem. Aproxime-se mais da câmera."
        },
        {
          condition: relativeSize > 0.4, // Rosto muito grande
          reason: "Rosto muito grande na imagem. Afaste-se um pouco da câmera."
        },
        {
          condition: normalizedOffsetX > 0.3, // Rosto muito descentralizado horizontalmente
          reason: "Rosto não está centralizado horizontalmente. Posicione-se no centro da imagem."
        },
        {
          condition: normalizedOffsetY > 0.4, // Rosto muito baixo/alto
          reason: "Rosto muito alto ou baixo na imagem. Posicione seu rosto no centro vertical."
        },
        {
          condition: face.width / face.height < 0.7 || face.width / face.height > 0.9,
          reason: "Ângulo da foto inadequado. Olhe diretamente para a câmera."
        }
      ];
      
      // Verifica proporção da imagem para crachá (recomendado 3:4 ou 4:5)
      const imageAspectRatio = detection.imageWidth / detection.imageHeight;
      const isPortrait = imageAspectRatio < 1;
      
      if (!isPortrait) {
        validations.push({
          condition: true,
          reason: "Use uma foto em formato retrato (vertical). Formato paisagem não é adequado para crachá."
        });
      }
      
      for (const validation of validations) {
        if (validation.condition) {
          return {
            ok: false,
            reason: validation.reason
          };
        }
      }
      
      // 6. Verifica se há espaço suficiente ao redor do rosto
      const marginTop = face.y;
      const marginBottom = detection.imageHeight - (face.y + face.height);
      const marginLeft = face.x;
      const marginRight = detection.imageWidth - (face.x + face.width);
      
      const minMargin = Math.min(face.width, face.height) * 0.5;
      
      if (marginTop < minMargin || marginBottom < minMargin || 
          marginLeft < minMargin || marginRight < minMargin) {
        return {
          ok: false,
          reason: "Rosto muito próximo das bordas. Deixe mais espaço ao redor do rosto."
        };
      }
      
      // 7. Verifica iluminação do rosto (análise simplificada)
      // Extrai a região do rosto para análise
      const faceRegionBuffer = await sharp(buffer)
        .extract({
          left: Math.max(0, Math.floor(face.x)),
          top: Math.max(0, Math.floor(face.y)),
          width: Math.min(Math.floor(face.width), detection.imageWidth - Math.floor(face.x)),
          height: Math.min(Math.floor(face.height), detection.imageHeight - Math.floor(face.y))
        })
        .toBuffer();
      
      const faceStats = await sharp(faceRegionBuffer).stats();
      const faceBrightness = faceStats.channels.reduce((sum, channel) => sum + channel.mean, 0) / faceStats.channels.length;
      
      if (faceBrightness < 60) {
        return {
          ok: false,
          reason: "Rosto está muito escuro. Melhore a iluminação frontal."
        };
      }
      
      if (faceBrightness > 180) {
        return {
          ok: false,
          reason: "Rosto está muito claro ou com reflexos. Evite luz direta forte."
        };
      }
      
      // Sucesso! Rosto válido para crachá
      return {
        ok: true,
        faceData: {
          centerX: faceCenterX,
          centerY: faceCenterY,
          width: face.width,
          height: face.height,
          imageWidth: detection.imageWidth,
          imageHeight: detection.imageHeight,
          normalizedCenterX: normalizedOffsetX,
          normalizedCenterY: normalizedOffsetY,
          relativeSize
        }
      };
      
    } catch (error) {
      console.error("Erro na validação do rosto:", error);
      return {
        ok: false,
        reason: "Erro ao analisar o rosto na imagem. Tente outra foto."
      };
    }
  }

  /**
   * Análise simplificada da imagem - verifica características básicas
   */
  private async analyzeImage(buffer: Buffer): Promise<FaceValidationResult> {
    try {
      const metadata = await this.getImageMetadata(buffer);
      
      // 1. Verifica se é uma imagem válida
      if (!metadata.format || metadata.format === 'unknown') {
        return { 
          ok: false, 
          reason: "Formato de imagem não suportado ou arquivo corrompido." 
        };
      }

      // 2. Verifica dimensões mínimas para crachá
      if (metadata.width < 400 || metadata.height < 500) {
        return { 
          ok: false, 
          reason: "Imagem muito pequena para crachá. Dimensões mínimas recomendadas: 400x500 pixels." 
        };
      }

      // 3. Verifica proporção ideal para crachá (entre 3:4 e 4:5)
      const aspectRatio = metadata.width / metadata.height;
      const idealMinRatio = 0.75; // 3:4
      const idealMaxRatio = 0.8;  // 4:5
      
      if (aspectRatio < 0.6 || aspectRatio > 0.85) {
        return { 
          ok: false, 
          reason: `Proporção da imagem (${aspectRatio.toFixed(2)}) inadequada para crachá. Use proporção entre 3:4 e 4:5.` 
        };
      }

      // 4. Validação específica do rosto para crachá
      const faceValidation = await this.validateFaceForBadge(buffer);
      
      if (!faceValidation.ok) {
        return faceValidation;
      }
      
      return faceValidation;
    } catch (error: any) {
      console.error("Erro na análise de imagem:", error);
      
      return { 
        ok: false, 
        reason: "Erro ao analisar a imagem. O arquivo pode estar corrompido." 
      };
    }
  }

  /**
   * Pré-processa a imagem (converte para JPEG e melhora compatibilidade)
   */
  private async normalizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .jpeg({ quality: 90 }) // Qualidade maior para crachá
      .resize(1200, 1500, { 
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true 
      })
      .normalize() // Melhora contraste
      .sharpen({ sigma: 0.5 }) // Suave sharpening para melhor definição
      .toBuffer();
  }

  /**
   * Validação principal da imagem
   */
  public async validateImage(file: File): Promise<FaceValidationResult> {
    try {
      // 1. Validações iniciais do arquivo
      if (!file.type.startsWith('image/')) {
        return { 
          ok: false, 
          reason: "Arquivo não é uma imagem. Envie um arquivo JPG, PNG ou similar." 
        };
      }

      // Formatos suportados
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!supportedTypes.includes(file.type.toLowerCase())) {
        return { 
          ok: false, 
          reason: `Formato ${file.type} não suportado. Use JPG, PNG ou WebP.` 
        };
      }

      // 2. Limita tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { 
          ok: false, 
          reason: "Imagem muito grande. Tamanho máximo: 5MB." 
        };
      }

      // Tamanho mínimo do arquivo (10KB)
      if (file.size < 10 * 1024) {
        return { 
          ok: false, 
          reason: "Imagem muito pequena. Arquivo muito leve pode indicar imagem corrompida." 
        };
      }

      // 3. Converte File → Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 4. Validação básica do buffer
      if (buffer.length === 0) {
        return { 
          ok: false, 
          reason: "Arquivo de imagem vazio ou corrompido." 
        };
      }

      // 5. Normaliza antes de analisar
      const normalized = await this.normalizeImage(buffer);

      // 6. Análise da imagem (inclui validação do rosto)
      const analysis = await this.analyzeImage(normalized);

      if (!analysis.ok) {
        return analysis;
      }

      // Retorna sucesso com dados do rosto
      return { 
        ok: true,
        faceData: analysis.faceData
      };

    } catch (error: any) {
      console.error("Erro na validação de imagem:", error);
      
      // Mensagens de erro mais específicas
      if (error.message.includes("Input buffer contains unsupported image format")) {
        return { 
          ok: false, 
          reason: "Formato de imagem não suportado ou arquivo corrompido." 
        };
      }
      
      return { 
        ok: false, 
        reason: "Erro ao processar a imagem. Verifique se o arquivo é uma imagem válida." 
      };
    }
  }

  /**
   * Método auxiliar para verificar se a imagem parece conter um rosto
   */
  public async suggestImageImprovements(file: File): Promise<string[]> {
    const improvements: string[] = [];
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const metadata = await this.getImageMetadata(buffer);

      // Sugestões baseadas em metadados
      if (metadata.width > 2000 || metadata.height > 2000) {
        improvements.push("A imagem é muito grande. Reduza para cerca de 1200x1500 pixels para melhor qualidade do crachá.");
      }

      if (metadata.format !== 'jpeg' && metadata.format !== 'png') {
        improvements.push(`Converta a imagem para JPG ou PNG (atual: ${metadata.format}).`);
      }

      // Verifica proporção para crachá
      const aspectRatio = metadata.width / metadata.height;
      if (aspectRatio >= 1) {
        improvements.push("Use uma foto em formato retrato (vertical). Formato paisagem não é adequado para crachá.");
      } else if (aspectRatio < 0.75 || aspectRatio > 0.8) {
        improvements.push(`A proporção ideal para crachá é entre 3:4 (0.75) e 4:5 (0.8). Sua proporção: ${aspectRatio.toFixed(2)}`);
      }

      // Tenta detectar problemas de centralização
      try {
        const faceValidation = await this.validateFaceForBadge(buffer);
        if (!faceValidation.ok && faceValidation.reason) {
          improvements.push(`Problema de posicionamento: ${faceValidation.reason}`);
        }
      } catch (error) {
        improvements.push("Não foi possível analisar o posicionamento do rosto.");
      }

    } catch (error) {
      improvements.push("Não foi possível analisar a imagem para sugestões.");
    }

    return improvements;
  }

  /**
   * Gera um overlay visual para mostrar como posicionar o rosto (útil para frontend)
   */
  public async generateFacePositionGuide(): Promise<{
    instructions: string[];
    idealPosition: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  }> {
    return {
      instructions: [
        "Posicione seu rosto no centro da imagem",
        "Deixe espaço equivalente a uma cabeça acima da sua cabeça",
        "Os ombros devem aparecer parcialmente na foto",
        "Olhe diretamente para a câmera",
        "Mantenha expressão neutra e sorriso leve",
        "Use fundo liso e claro"
      ],
      idealPosition: {
        top: 20,  // 20% do topo
        left: 15, // 15% da esquerda
        width: 70, // 70% da largura
        height: 60 // 60% da altura
      }
    };
  }
}