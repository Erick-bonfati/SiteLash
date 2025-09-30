const express = require('express');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Middleware de autenticação simples
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso negado' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, 'sua_chave_secreta_super_segura_aqui_2023');
    const admin = global.mockData.admins.find(a => a._id === decoded.id && a.isActive);
    
    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// @route   POST /api/upload
// @desc    Upload de imagem para produto/serviço
// @access  Private
router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    // Retornar URL da imagem (agora na pasta public do frontend)
    const imageUrl = `/images/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem' });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Deletar imagem
// @access  Private
router.delete('/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../client/public/images', filename);

    // Verificar se o arquivo existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Imagem deletada com sucesso' });
    } else {
      res.status(404).json({ message: 'Arquivo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro ao deletar imagem' });
  }
});

module.exports = router;
