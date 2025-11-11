import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #f8b5c1 0%, #fce7f3 100%)',
      padding: '3rem 0 2rem',
      marginTop: '4rem',
      borderTop: '1px solid rgba(248, 181, 193, 0.2)'
    }}>
      <div className="container">
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          {/* Informações da empresa */}
          <div>
            <h3 style={{
              color: '#ec4899',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              💄 CleoLash
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              Seu espaço de beleza e bem-estar. Oferecemos os melhores serviços 
              para realçar sua beleza natural.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h4 style={{
              color: '#4a4a4a',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Links Úteis
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a 
                  href="/" 
                  style={{ 
                    color: '#6b7280', 
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#ec4899'}
                  onMouseOut={(e) => e.target.style.color = '#6b7280'}
                >
                  Início
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a 
                  href="/agendamento" 
                  style={{ 
                    color: '#6b7280', 
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#ec4899'}
                  onMouseOut={(e) => e.target.style.color = '#6b7280'}
                >
                  Agendar Serviço
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 style={{
              color: '#4a4a4a',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Contato
            </h4>
            <div style={{ color: '#6b7280', lineHeight: '1.8' }}>
              <p>📞 (41) 99703-6228</p>
              <p>📧 cleolash@gmail.com</p>
              <p>📍 Rua Francisco Dranka, 1750</p>
              <p>Araucária - PR</p>
            </div>
          </div>
        </div>

        {/* Horário de funcionamento */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h4 style={{
            color: '#4a4a4a',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            🕒 Horário de Funcionamento
          </h4>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Segunda a Sexta: 9h às 21h | Sábado: 8h às 15h30
          </p>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(248, 181, 193, 0.3)',
          color: '#6b7280'
        }}>
          <p style={{ margin: 0 }}>
            © 2023 SiteLash. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
