import { RoraimaAI, RoraimaAIError } from './index.mjs';

// Ejemplo básico de uso del SDK
async function ejemploBasico() {
  // Configura tu API key aquí
  const API_KEY = 'sk-tu_api_key_aqui';
  
  if (API_KEY === 'sk-tu_api_key_aqui') {
    console.log('❌ Por favor configura tu API key en el archivo example.js');
    return;
  }
  
  const ai = new RoraimaAI(API_KEY);
  
  console.log('🚀 Iniciando ejemplos del SDK Roraima AI...\n');
  
  try {
    // 1. Verificar estado del servicio
    console.log('📊 Verificando estado del servicio...');
    const health = await ai.getHealth();
    console.log('✅ Estado:', health.status);
    
    // 2. Obtener información del usuario
    console.log('\n👤 Obteniendo información del usuario...');
    const info = await ai.getInfo();
    console.log('✅ Usuario:', info.user.name);
    console.log('✅ Saldo disponible: $', info.user.balance.toFixed(4));
    
    // 3. Procesar texto simple
    console.log('\n💬 Procesando texto...');
    const textResponse = await ai.processText('Explícame en 2 líneas qué es la inteligencia artificial');
    console.log('✅ Respuesta:', textResponse.content);
    console.log('✅ Costo:', textResponse.metrics?.cost_estimate || 'N/A');
    
    // 4. Obtener estadísticas
    console.log('\n📈 Obteniendo estadísticas...');
    const stats = await ai.getStats('24h');
    console.log('✅ Requests últimas 24h:', stats.summary.total_requests);
    console.log('✅ Costo total 24h: $', stats.summary.total_cost.toFixed(6));
    
    // 5. Verificar saldo final
    console.log('\n💰 Saldo final...');
    const finalBalance = await ai.getBalance();
    console.log('✅ Saldo actual: $', finalBalance.toFixed(4));
    
    console.log('\n🎉 ¡Todos los ejemplos completados exitosamente!');
    
  } catch (error) {
    if (error instanceof RoraimaAIError) {
      console.error('❌ Error de API:', error.message);
      console.error('❌ Código de estado:', error.status);
      
      switch (error.status) {
        case 401:
          console.error('💡 Solución: Verifica que tu API key sea correcta');
          break;
        case 402:
          console.error('💡 Solución: Recarga tu cuenta con saldo');
          break;
        case 500:
          console.error('💡 Solución: Intenta nuevamente en unos minutos');
          break;
      }
    } else {
      console.error('❌ Error general:', error.message);
    }
  }
}

// Ejemplo con imagen (requiere archivo de imagen)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function ejemploConImagen() {
  const API_KEY = 'sk-tu_api_key_aqui';
  
  if (API_KEY === 'sk-tu_api_key_aqui') {
    console.log('❌ Por favor configura tu API key para usar este ejemplo');
    return;
  }
  
  const ai = new RoraimaAI(API_KEY);
  
  try {
    console.log('🖼️ Procesando imagen de ejemplo...');
    
    // Nota: necesitas tener un archivo de imagen llamado 'test.jpg' en el mismo directorio
    const response = await ai.processImage(
      'Describe brevemente lo que ves en esta imagen',
      './test.jpg'
    );
    
    console.log('✅ Descripción:', response.content);
    console.log('✅ Costo:', response.metrics?.cost_estimate || 'N/A');
    
    if (response.detections && response.detections.length > 0) {
      console.log('✅ Objetos detectados:', response.detections.length);
    }
    
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      console.log('💡 Para probar con imágenes, coloca un archivo llamado "test.jpg" en este directorio');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Ejecutar ejemplos
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('='.repeat(60));
  console.log('🤖 SDK Roraima AI - Ejemplos de Uso');
  console.log('='.repeat(60));
  
  ejemploBasico();
  
  // Descomentar para probar con imagen
  // ejemploConImagen();
} 