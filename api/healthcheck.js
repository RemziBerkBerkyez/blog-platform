// ==========================================
// HEALTH CHECK SCRIPT
// Docker HEALTHCHECK için kullanılır
// ==========================================

const http = require('http');

// HTTP request ayarları
const options = {
  host: 'localhost',                        // Localhost'a istek at
  port: process.env.PORT || 3000,          // Port (environment variable veya default 3000)
  path: '/health',                         // Health endpoint
  timeout: 2000                            // 2 saniye timeout
};

// HTTP request gönder
const request = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  
  // Status code 200 ise sağlıklı
  if (res.statusCode === 200) {
    process.exit(0);  // Exit code 0 = başarılı (container healthy)
  } else {
    process.exit(1);  // Exit code 1 = başarısız (container unhealthy)
  }
});

// Hata durumunda
request.on('error', (err) => {
  console.error('Health check failed:', err.message);
  process.exit(1);  // Exit code 1 = unhealthy
});

// Timeout durumunda
request.on('timeout', () => {
  console.error('Health check timeout');
  request.destroy();
  process.exit(1);  // Exit code 1 = unhealthy
});

// Request'i gönder
request.end();
