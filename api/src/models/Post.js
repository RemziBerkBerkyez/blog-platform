// ==========================================
// POST MODEL (MongoDB Schema)
// ==========================================

// mongoose kütüphanesini import et
const mongoose = require('mongoose');

// ==========================================
// SCHEMA TANIMI
// ==========================================

const postSchema = new mongoose.Schema({
  
  // BAŞLIK
  title: {
    type: String,              // Metin
    required: true,            // Zorunlu
    trim: true,                // Boşlukları temizle
    minlength: 3,              // En az 3 karakter
    maxlength: 200             // En fazla 200 karakter
  },
  
  // İÇERİK
  content: {
    type: String,              // Metin
    required: true,            // Zorunlu
    minlength: 10              // En az 10 karakter
  },
  
  // YAZAR
  author: {
    type: String,              // Metin
    default: 'Anonymous',      // Varsayılan değer
    trim: true
  },
  
  // ETİKETLER
  tags: {
    type: [String],            // Metin listesi
    default: []                // Boş liste
  },
  
  // YAYINLANMIŞ MI?
  published: {
    type: Boolean,             // true/false
    default: true              // Varsayılan: true
  }
  
}, {
  timestamps: true             // createdAt ve updatedAt otomatik ekle
});

// ==========================================
// MODEL OLUŞTUR VE EXPORT ET
// ==========================================

module.exports = mongoose.model('Post', postSchema);
