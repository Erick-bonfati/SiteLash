import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Erro ao carregar produtos e serviços');
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (duration < 60) {
      return `${duration}min`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="loading"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f8b5c1 0%, #fce7f3 100%)',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#4a4a4a',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ec4899, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💄 Seja muito bem-vinda
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Seu espaço de beleza e bem-estar. Descubra meus serviços exclusivos e agende seu horário com facilidade.
          </p>
          <Link to="/agendamento" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Agendar Agora ✨
          </Link>
        </div>
      </section>

      {/* Serviços Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              color: '#4a4a4a',
              marginBottom: '1rem'
            }}>
              Serviços
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Oferecemos uma variedade de serviços para realçar sua beleza natural
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center">
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Nenhum serviço disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-3">
              {products.map((product) => (
                <div key={product._id} className="card fade-in">
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 1rem',
                          boxShadow: '0 6px 20px rgba(248, 181, 193, 0.3)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #f8b5c1, #fce7f3)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2rem'
                      }}>
                        {product.category === 'serviço' ? '💅' : '🛍️'}
                      </div>
                    )}
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: '#4a4a4a',
                      marginBottom: '0.5rem'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.5'
                    }}>
                      {product.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: '#fdf2f8',
                    borderRadius: '10px'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#ec4899'
                      }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.category === 'serviço' && product.duration && (
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#6b7280',
                          marginTop: '0.25rem'
                        }}>
                          ⏱️ {formatDuration(product.duration)}
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#6b7280',
                      background: '#ffffff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      textTransform: 'capitalize'
                    }}>
                      {product.category}
                    </div>
                  </div>

                  {product.category === 'serviço' && (
                    <Link
                      to={`/agendamento?service=${product._id}`}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      Agendar Serviço
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fce7f3 0%, #f8b5c1 100%)',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#4a4a4a',
            marginBottom: '1rem'
          }}>
            Pronta para se sentir incrível?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem'
          }}>
            Agende seu horário agora e descubra como é se sentir 
            confiante e linda todos os dias.
          </p>
          <Link to="/agendamento" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Agendar Agora 💖
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
