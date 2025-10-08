// ==========================================
// POST ROUTES (API Endpoints)
// ==========================================

// Express router'ı import et
const express = require('express');
const router = express.Router();

// Post modelini import et
const Post = require('../models/Post');

// ==========================================
// GET /api/posts - TÜM POSTLARI GETİR
// ==========================================
router.get('/', async (req, res) => {
  try {
    // MongoDB'den tüm postları getir (en yeni önce)
    const posts = await Post.find().sort({ createdAt: -1 });
    
    // Başarılı response
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
    
  } catch (error) {
    console.error('❌ Error getting posts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// GET /api/posts/:id - TEK POST GETİR
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    // URL'den ID al ve MongoDB'den post bul
    const post = await Post.findById(req.params.id);
    
    // Post bulunamadıysa
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Post bulundu
    res.json({
      success: true,
      data: post
    });
    
  } catch (error) {
    console.error('❌ Error getting post:', error);
    
    // Geçersiz ID formatı
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// POST /api/posts - YENİ POST OLUŞTUR
// ==========================================
router.post('/', async (req, res) => {
  try {
    // Request body'den veriyi al ve MongoDB'ye kaydet
    const post = await Post.create(req.body);
    
    // 201: Created (yeni kayıt oluşturuldu)
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
    
  } catch (error) {
    console.error('❌ Error creating post:', error);
    
    // Validation hatası
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// PUT /api/posts/:id - POST GÜNCELLE
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    // Post'u bul ve güncelle
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,             // Güncellenmiş versiyonu döndür
        runValidators: true    // Validation kontrol et
      }
    );
    
    // Post bulunamadıysa
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Başarılı
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
    
  } catch (error) {
    console.error('❌ Error updating post:', error);
    
    // Validation hatası
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    // Geçersiz ID
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// DELETE /api/posts/:id - POST SİL
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    // Post'u bul ve sil
    const post = await Post.findByIdAndDelete(req.params.id);
    
    // Post bulunamadıysa
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Başarılı
    res.json({
      success: true,
      message: 'Post deleted successfully',
      data: {}
    });
    
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    
    // Geçersiz ID
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// ROUTER'I EXPORT ET
// ==========================================
module.exports = router;
