import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageUpload, currentImage, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setPreview(response.data.imageUrl);
        onImageUpload(response.data.imageUrl);
        toast.success('Imagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview('');
    onImageUpload('');
  };

  return (
    <div className="form-group">
      <label className="form-label">Imagem do Produto/Serviço</label>
      
      {/* Preview da imagem */}
      {preview && (
        <div style={{
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(248, 181, 193, 0.2)',
              objectFit: 'cover'
            }}
          />
          {!disabled && (
            <button
              type="button"
              onClick={removeImage}
              style={{
                display: 'block',
                margin: '0.5rem auto 0',
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🗑️ Remover Imagem
            </button>
          )}
        </div>
      )}

      {/* Input de arquivo */}
      <div style={{
        border: '2px dashed #f8b5c1',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        background: '#fdf2f8',
        transition: 'all 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
          id="image-upload"
        />
        
        <label
          htmlFor="image-upload"
          style={{
            cursor: disabled || uploading ? 'not-allowed' : 'pointer',
            display: 'block'
          }}
        >
          {uploading ? (
            <div>
              <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Enviando imagem...
              </p>
            </div>
          ) : (
            <div>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#ec4899'
              }}>
                📸
              </div>
              <p style={{
                color: '#4a4a4a',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                {preview ? 'Trocar Imagem' : 'Selecionar Imagem'}
              </p>
              <p style={{
                color: '#6b7280',
                fontSize: '0.9rem',
                margin: 0
              }}>
                Clique aqui ou arraste uma imagem
                <br />
                <small>PNG, JPG, GIF até 5MB</small>
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
