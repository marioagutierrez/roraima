import axios from 'axios';
import FormData from 'form-data';
import { createReadStream, existsSync } from 'fs';
import { basename } from 'path';

/**
 * SDK para Roraima AI
 * Permite usar la API de IA de manera sencilla
 */
export class RoraimaAI {
  /**
   * Constructor del SDK
   * @param {string} apiKey - Tu API key de Roraima AI (sk-...)
   * @param {string} [baseURL] - URL base de la API (opcional)
   */
  constructor(apiKey, baseURL = 'https://roraima.ai') {
    if (!apiKey) {
      throw new Error('API key es requerida');
    }
    
    if (!apiKey.startsWith('sk-')) {
      throw new Error('API key debe comenzar con "sk-"');
    }

    this.apiKey = apiKey;
    this.baseURL = baseURL.replace(/\/$/, ''); // Remover barra final
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'User-Agent': 'roraima-ai-sdk-js/1.0.0'
    };
  }

  /**
   * Procesar texto con IA
   * @param {string} prompt - El texto a procesar
   * @returns {Promise<Object>} Respuesta de la IA
   */
  async processText(prompt) {
    if (!prompt) {
      throw new Error('El prompt es requerido');
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    return this._makeRequest('/api/ai/process', {
      method: 'POST',
      data: formData,
      headers: {
        ...this.headers,
        ...formData.getHeaders()
      }
    });
  }

  /**
   * Procesar imagen con IA
   * @param {string} prompt - Pregunta sobre la imagen
   * @param {string|Buffer|Stream} image - Ruta del archivo, Buffer o Stream de la imagen
   * @returns {Promise<Object>} Respuesta de la IA
   */
  async processImage(prompt, image) {
    if (!prompt) {
      throw new Error('El prompt es requerido');
    }
    
    if (!image) {
      throw new Error('La imagen es requerida');
    }

    const formData = new FormData();
    formData.append('prompt', prompt);
    
    // Manejar diferentes tipos de input para imagen
    if (typeof image === 'string') {
      // Es una ruta de archivo
      if (!existsSync(image)) {
        throw new Error(`Archivo de imagen no encontrado: ${image}`);
      }
      
      const fileStream = createReadStream(image);
      const fileName = basename(image);
      formData.append('image', fileStream, fileName);
    } else if (Buffer.isBuffer(image)) {
      // Es un Buffer
      formData.append('image', image, 'image.jpg');
    } else {
      // Asumir que es un Stream
      formData.append('image', image, 'image.jpg');
    }

    return this._makeRequest('/api/ai/process', {
      method: 'POST',
      data: formData,
      headers: {
        ...this.headers,
        ...formData.getHeaders()
      }
    });
  }

  /**
   * Procesar audio con IA
   * @param {string} prompt - Instrucción para el audio
   * @param {string|Buffer|Stream} audio - Ruta del archivo, Buffer o Stream del audio
   * @returns {Promise<Object>} Respuesta de la IA
   */
  async processAudio(prompt, audio) {
    if (!prompt) {
      throw new Error('El prompt es requerido');
    }
    
    if (!audio) {
      throw new Error('El audio es requerido');
    }

    const formData = new FormData();
    formData.append('prompt', prompt);
    
    // Manejar diferentes tipos de input para audio
    if (typeof audio === 'string') {
      // Es una ruta de archivo
      if (!existsSync(audio)) {
        throw new Error(`Archivo de audio no encontrado: ${audio}`);
      }
      
      const fileStream = createReadStream(audio);
      const fileName = basename(audio);
      formData.append('audio', fileStream, fileName);
    } else if (Buffer.isBuffer(audio)) {
      // Es un Buffer
      formData.append('audio', audio, 'audio.mp3');
    } else {
      // Asumir que es un Stream
      formData.append('audio', audio, 'audio.mp3');
    }

    return this._makeRequest('/api/ai/process', {
      method: 'POST',
      data: formData,
      headers: {
        ...this.headers,
        ...formData.getHeaders()
      }
    });
  }

  /**
   * Obtener información de la API y usuario
   * @returns {Promise<Object>} Información del usuario y API
   */
  async getInfo() {
    return this._makeRequest('/api/ai/info', {
      method: 'GET',
      headers: this.headers
    });
  }

  /**
   * Obtener estadísticas de uso
   * @param {string} [period] - Período de tiempo (24h, 7d, 30d, 90d, all)
   * @returns {Promise<Object>} Estadísticas de uso
   */
  async getStats(period = '30d') {
    const validPeriods = ['24h', '7d', '30d', '90d', 'all'];
    if (!validPeriods.includes(period)) {
      throw new Error(`Período inválido. Usa: ${validPeriods.join(', ')}`);
    }

    return this._makeRequest(`/api/ai/stats?period=${period}`, {
      method: 'GET',
      headers: this.headers
    });
  }

  /**
   * Verificar el estado del servicio
   * @returns {Promise<Object>} Estado del servicio
   */
  async getHealth() {
    return this._makeRequest('/api/ai/health', {
      method: 'GET'
    });
  }

  /**
   * Obtener el saldo actual del usuario
   * @returns {Promise<number>} Saldo actual
   */
  async getBalance() {
    const info = await this.getInfo();
    return info.user.balance;
  }

  /**
   * Método interno para hacer peticiones HTTP
   * @private
   */
  async _makeRequest(endpoint, options) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await axios({
        url,
        ...options,
        timeout: 300000, // 5 minutos
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        // Error de respuesta HTTP
        const errorData = error.response.data;
        const errorMessage = errorData.detail || errorData.message || 'Error desconocido';
        
        throw new RoraimaAIError(
          errorMessage,
          error.response.status,
          errorData
        );
      } else if (error.request) {
        // Error de conexión
        throw new RoraimaAIError(
          'No se pudo conectar con el servidor de Roraima AI',
          0,
          { originalError: error.message }
        );
      } else {
        // Error en la configuración
        throw new RoraimaAIError(
          error.message,
          0,
          { originalError: error.message }
        );
      }
    }
  }
}

/**
 * Clase para manejar errores específicos de Roraima AI
 */
export class RoraimaAIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'RoraimaAIError';
    this.status = status;
    this.data = data;
  }
}

// Exportar como default también para compatibilidad
export default RoraimaAI; 