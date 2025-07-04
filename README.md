# 🤖 Roraima AI SDK

SDK oficial de JavaScript/TypeScript para [Roraima AI](https://roraima.ai) - Procesa texto, imágenes y audio con inteligencia artificial de última generación.

## ✨ Características

- 🔤 **Procesamiento de texto** - Genera, analiza y transforma texto con IA
- 🖼️ **Análisis de imágenes** - Describe, analiza y extrae información de imágenes
- 🎵 **Procesamiento de audio** - Transcribe y analiza archivos de audio
- 📊 **Estadísticas en tiempo real** - Monitorea uso, costos y rendimiento
- 💰 **Gestión de saldo** - Consulta tu saldo y gastos
- ⚡ **Fácil de usar** - API simple y intuitiva
- 🔒 **Seguro** - Autenticación con API key
- 📦 **TypeScript** - Soporte completo para TypeScript

## 📦 Instalación

```bash
npm install roraima
```

## 🚀 Inicio Rápido

### 1. Obtén tu API Key

Regístrate en [Roraima AI](https://roraima.ai) y obtén tu API key desde el dashboard.

### 2. Configuración Básica

```javascript
import { RoraimaAI } from 'roraima';

const ai = new RoraimaAI('sk-tu_api_key_aqui');
```

### 3. Primer Ejemplo

```javascript
// Procesar texto
const response = await ai.processText('Explica qué es la inteligencia artificial');
console.log(response.content);

// Verificar saldo
const balance = await ai.getBalance();
console.log(`Saldo: $${balance}`);
```

## 📚 Ejemplos de Uso

### 💬 Procesamiento de Texto

```javascript
import { RoraimaAI } from 'roraima';

const ai = new RoraimaAI('sk-tu_api_key_aqui');

async function ejemploTexto() {
  try {
    const response = await ai.processText('Escribe un poema sobre la tecnología');
    
    console.log('Respuesta:', response.content);
    console.log('Costo:', response.metrics.cost_estimate);
    console.log('Tokens:', response.metrics.total_tokens);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### 🖼️ Análisis de Imágenes

```javascript
// Desde archivo
const response = await ai.processImage(
  'Describe lo que ves en esta imagen',
  './mi-imagen.jpg'
);

// Desde Buffer
const imageBuffer = fs.readFileSync('imagen.png');
const response = await ai.processImage(
  'Qué objetos hay en la imagen?',
  imageBuffer
);

console.log('Descripción:', response.content);
if (response.detections) {
  console.log('Objetos detectados:', response.detections.length);
}
```

### 🎵 Procesamiento de Audio

```javascript
// Transcribir audio
const response = await ai.processAudio(
  'Transcribe este audio',
  './audio.mp3'
);

// Analizar sentimientos en audio
const response = await ai.processAudio(
  'Analiza el sentimiento de esta conversación',
  './llamada.wav'
);

console.log('Transcripción:', response.content);
console.log('Duración:', response.metrics.audio_duration_seconds, 'segundos');
```

### 📊 Estadísticas y Monitoreo

```javascript
// Obtener información del usuario
const info = await ai.getInfo();
console.log('Usuario:', info.user.name);
console.log('Saldo:', info.user.balance);

// Estadísticas de uso
const stats = await ai.getStats('24h'); // 24h, 7d, 30d, 90d, all
console.log('Requests hoy:', stats.summary.total_requests);
console.log('Costo total:', stats.summary.total_cost);

// Estado del servicio
const health = await ai.getHealth();
console.log('Estado:', health.status);
```

## 🔧 API Reference

### Constructor

```typescript
new RoraimaAI(apiKey: string, baseURL?: string)
```

- `apiKey`: Tu API key de Roraima AI (debe comenzar con `sk-`)
- `baseURL`: URL base de la API (opcional, por defecto: `https://roraima.ai`)

### Métodos Principales

#### `processText(prompt: string): Promise<ProcessResponse>`

Procesa texto con IA.

**Parámetros:**
- `prompt`: El texto a procesar

**Ejemplo:**
```javascript
const response = await ai.processText('Resume este artículo...');
```

#### `processImage(prompt: string, image: ImageInput): Promise<ProcessResponse>`

Analiza imágenes con IA.

**Parámetros:**
- `prompt`: Pregunta sobre la imagen
- `image`: Ruta del archivo, Buffer o Stream

**Formatos soportados:** JPG, PNG, GIF, WebP, BMP

**Ejemplo:**
```javascript
const response = await ai.processImage('Qué hay en esta foto?', './foto.jpg');
```

#### `processAudio(prompt: string, audio: AudioInput): Promise<ProcessResponse>`

Procesa audio con IA.

**Parámetros:**
- `prompt`: Instrucción para el audio
- `audio`: Ruta del archivo, Buffer o Stream

**Formatos soportados:** MP3, WAV, FLAC, M4A, OGG

**Ejemplo:**
```javascript
const response = await ai.processAudio('Transcribe este audio', './audio.mp3');
```

#### `getInfo(): Promise<InfoResponse>`

Obtiene información del usuario y API.

#### `getStats(period?: StatsPeriod): Promise<StatsResponse>`

Obtiene estadísticas de uso.

**Períodos disponibles:** `'24h'`, `'7d'`, `'30d'`, `'90d'`, `'all'`

#### `getHealth(): Promise<HealthResponse>`

Verifica el estado del servicio.

#### `getBalance(): Promise<number>`

Obtiene el saldo actual del usuario.

## 🏗️ Tipos TypeScript

```typescript
interface ProcessResponse {
  content: string;
  type?: string;
  detections?: any[];
  metrics?: {
    cost_estimate: number;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    service: string;
    latency: string;
    processing_time: string;
    audio_duration_seconds?: number;
    tokens_per_second: string;
  };
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  balance: number;
  total_spent: number;
}

type StatsPeriod = '24h' | '7d' | '30d' | '90d' | 'all';
type ImageInput = string | Buffer | NodeJS.ReadableStream;
type AudioInput = string | Buffer | NodeJS.ReadableStream;
```

## ⚠️ Manejo de Errores

El SDK incluye manejo de errores específico con la clase `RoraimaAIError`:

```javascript
import { RoraimaAI, RoraimaAIError } from 'roraima';

try {
  const response = await ai.processText('Hola mundo');
} catch (error) {
  if (error instanceof RoraimaAIError) {
    console.error('Error de API:', error.message);
    console.error('Código de estado:', error.status);
    
    switch (error.status) {
      case 401:
        console.error('API key inválida');
        break;
      case 402:
        console.error('Saldo insuficiente');
        break;
      case 500:
        console.error('Error del servidor');
        break;
    }
  } else {
    console.error('Error general:', error.message);
  }
}
```

## 💡 Límites y Consideraciones

- **Tamaño máximo de archivo:** Consultar `info.limits.max_file_size`
- **Timeout:** 5 minutos por request
- **Formatos soportados:** Ver `info.limits.supported_image_formats` y `supported_audio_formats`
- **Rate limiting:** Aplica según tu plan

## 🔄 Compatibilidad

- **Node.js:** ≥14.0.0
- **CommonJS y ES Modules:** ✅
- **TypeScript:** ✅
- **Browser:** No (requiere Node.js)

## 📝 Ejemplos Completos

Consulta el archivo `example.js` incluido en el paquete para ver ejemplos completos de uso.

```bash
node example.js
```

## 🆘 Soporte

- 📖 **Documentación:** [roraima.ai/docs](https://roraima.ai/docs)
- 🐛 **Issues:** [GitHub Issues](https://github.com/mariogutierrez/roraima/issues)
- 💬 **Soporte:** [contacto@roraima.ai](mailto:contacto@roraima.ai)

## 📄 Licencia

MIT - ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <strong>¿Te gusta el SDK? ⭐ Dale una estrella en GitHub!</strong><br>
  Hecho con ❤️ por el equipo de Roraima AI
</div> 