const { spawn } = require('child_process');
const path = require('path');

// Lista de microservicios con sus rutas y puertos
const microservices = [
  { name: 'API Gateway', path: './microservices/api-gateway', port: 5000 },
  { name: 'Product Service', path: './microservices/product-service', port: 5001 },
  { name: 'User Service', path: './microservices/user-service', port: 5002 },
  { name: 'Cart Service', path: './microservices/cart-service', port: 5003 },
  { name: 'Category Service', path: './microservices/category-service', port: 5004 },
  { name: 'Payment Service', path: './microservices/payment-service', port: 5005 }
];

console.log('🚀 Iniciando todos los microservicios...\n');

// Función para iniciar un microservicio
function startMicroservice(service) {
  const servicePath = path.resolve(service.path);
  console.log(`📦 Iniciando ${service.name} en puerto ${service.port}...`);
  
  const child = spawn('node', ['index.js'], {
    cwd: servicePath,
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error(`❌ Error al iniciar ${service.name}:`, error);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${service.name} finalizó con código ${code}`);
    }
  });

  return child;
}

// Iniciar todos los microservicios
const processes = microservices.map(startMicroservice);

// Manejar la terminación del proceso principal
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo todos los microservicios...');
  processes.forEach((child, index) => {
    console.log(`🔻 Deteniendo ${microservices[index].name}...`);
    child.kill('SIGINT');
  });
  process.exit(0);
});

console.log('\n✅ Todos los microservicios iniciados!');
console.log('📋 URLs disponibles:');
microservices.forEach(service => {
  console.log(`   - ${service.name}: http://localhost:${service.port}`);
});
console.log('\n💡 Presiona Ctrl+C para detener todos los servicios');
