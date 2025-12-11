// lib/tensorflow-config.ts
export const TensorFlowConfig = {
  // Configurações de performance
  BACKEND: 'cpu' as const,
  MODEL_TYPE: 'short' as const, // 'short' para velocidade, 'full' para precisão
  
  // Limites de processamento
  MAX_IMAGE_SIZE: 1024,
  MAX_FACES: 3,
  
  // Timeouts
  DETECTION_TIMEOUT: 10000, // 10 segundos
  INIT_TIMEOUT: 30000, // 30 segundos
  
  // URLs dos modelos (usar CDN para performance)
  MODEL_URLS: {
    FACE_DETECTION: undefined, // Usa modelo padrão
    MEDIAPIPE: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection'
  }
};