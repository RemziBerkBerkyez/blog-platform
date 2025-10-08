// ==========================================
// BLOG API SERVER
// ==========================================

// Gerekli kütüphaneleri import et
const express = require('express');           // Web framework
const mongoose = require('mongoose');         // MongoDB bağlantısı
const cors = require('cors');                 // Cross-Origin izinleri
require('dotenv').config();                   // Environment variables

// Express app oluştur
const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS - Cross-Origin Resource Sharing
// Frontend'den API'ye erişim için gerekli
app.use(cors());

// JSON Parser
// Request body'deki JSON'u parse et
app.use(express.json());

// URL-encoded Parser
// Form data'yı parse et
app.use(express.urlencoded({ extended: true }));

// Request Logger (Basit)
// Her gelen isteği konsola yaz
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();  // Sonraki middleware'e geç
});

// ==========================================
// DATABASE CONNECTION
// ==========================================

// MongoDB bağlantı URL'i
// Environment variable'dan al, yoksa default kullan
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/blogdb';

// MongoDB'ye bağlan
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,      // Yeni URL parser kullan
  useUnifiedTopology: true    // Yeni bağlantı motoru
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);  // Bağlantı yoksa app'i durdur (exit code 1 = hata)
});

// Database bağlantı event'leri
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// ==========================================
// ROUTES
// ==========================================

// Post routes'u import et
const postRoutes = require('./routes/posts');

// Root endpoint (/)
// API hakkında bilgi döndür
app.get('/', (req, res) => {
  res.json({
    message: 'DevOps Blog Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      posts: '/api/posts',
      singlePost: '/api/posts/:id'
    },
    documentation: 'https://github.com/your-repo'
  });
});

// Health check endpoint
// Docker HEALTHCHECK için kullanılacak
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),                    // Server ne kadar süredir çalışıyor (saniye)
    timestamp: Date.now(),                       // Şu anki zaman (unix timestamp)
    status: 'OK',                                // Durum
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  };
  
  // Database bağlıysa 200, değilse 503
  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API routes
// /api/posts/* ile gelen tüm istekler postRoutes'a yönlendirilir
app.use('/api/posts', postRoutes);

// ==========================================
// ERROR HANDLERS
// ==========================================

// 404 Handler - Route bulunamadı
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
// Tüm hataları yakala
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    // Development'ta stack trace göster, production'da gösterme
  });
});

// ==========================================
// START SERVER
// ==========================================

// Port numarası (environment variable'dan al, yoksa 3000)
const PORT = process.env.PORT || 3000;

// Server'ı başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 ====================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 API URL: http://localhost:${PORT}`);
  console.log('🚀 ====================================');
  console.log('');
  console.log('📝 Available endpoints:');
  console.log(`   GET  /                  - API info`);
  console.log(`   GET  /health            - Health check`);
  console.log(`   GET  /api/posts         - Get all posts`);
  console.log(`   GET  /api/posts/:id     - Get single post`);
  console.log(`   POST /api/posts         - Create post`);
  console.log(`   PUT  /api/posts/:id     - Update post`);
  console.log(`   DELETE /api/posts/:id   - Delete post`);
  console.log('');
});

// Graceful shutdown
// SIGTERM veya SIGINT sinyali geldiğinde temiz kapat
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, closing server...');
  mongoose.connection.close();
  process.exit(0);
});
