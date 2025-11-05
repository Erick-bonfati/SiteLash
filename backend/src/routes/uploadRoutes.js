const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
    }

    res.json({
      success: true,
      imageUrl: `/images/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:filename', authMiddleware, (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../frontend/public/images', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Imagem deletada com sucesso' });
    }

    return res.status(404).json({ message: 'Arquivo não encontrado' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
