import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Login realizado com sucesso! 🎉');
        navigate('/admin');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '0.5rem'
            }}>
              🔐 Área Admin
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem'
            }}>
              Faça login para acessar o painel administrativo
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="admin@sitelash.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite sua senha"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <div className="loading" style={{ marginRight: '0.5rem' }}></div>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            {/* Informações de teste */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#fdf2f8',
              borderRadius: '10px',
              border: '1px solid #f8b5c1'
            }}>
              <h4 style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#4a4a4a',
                marginBottom: '0.5rem'
              }}>
                💡 Conta de Teste
              </h4>
              <p style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Email: admin@sitelash.com<br />
                Senha: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
