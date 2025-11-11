import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
      boxShadow: '0 2px 20px rgba(248, 181, 193, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="flex-between" style={{ padding: '1rem 0' }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{
              textDecoration: 'none',
              color: '#ec4899',
              fontSize: '1.5rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            💄 CleoLash
          </Link>

          {/* Menu Desktop */}
          <div className="flex" style={{ gap: '2rem', alignItems: 'center' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                color: isActive('/') ? '#ec4899' : '#4a4a4a',
                fontWeight: isActive('/') ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
            >
              Início
            </Link>
            <Link
              to="/sobre"
              style={{
                textDecoration: 'none',
                color: isActive('/sobre') ? '#ec4899' : '#4a4a4a',
                fontWeight: isActive('/sobre') ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
            >
              Sobre mim
            </Link>
            <Link
              to="/agendamento"
              style={{
                textDecoration: 'none',
                color: isActive('/agendamento') ? '#ec4899' : '#4a4a4a',
                fontWeight: isActive('/agendamento') ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
            >
              Agendar
            </Link>
            
            {admin ? (
              <div className="flex" style={{ gap: '1rem', alignItems: 'center' }}>
                <Link
                  to="/admin"
                  style={{
                    textDecoration: 'none',
                    color: isActive('/admin') ? '#ec4899' : '#4a4a4a',
                    fontWeight: isActive('/admin') ? '600' : '400',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Menu Mobile Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#ec4899',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem 0',
            borderTop: '1px solid #f8b5c1',
            background: '#ffffff'
          }}>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive('/') ? '#ec4899' : '#4a4a4a',
                fontWeight: isActive('/') ? '600' : '400',
                padding: '0.5rem 0'
              }}
            >
              Início
            </Link>
            <Link
              to="/sobre"
              onClick={() => setIsMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive('/sobre') ? '#ec4899' : '#4a4a4a',
                fontWeight: isActive('/sobre') ? '600' : '400',
                padding: '0.5rem 0'
              }}
            >
              Sobre mim
            </Link>
            <Link
              to="/agendamento"
              onClick={() => setIsMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive('/agendamento') ? '#ec4899' : '#4a4a4a',
                fontWeight: isActive('/agendamento') ? '600' : '400',
                padding: '0.5rem 0'
              }}
            >
              Agendar
            </Link>
            
            {admin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    color: isActive('/admin') ? '#ec4899' : '#4a4a4a',
                    fontWeight: isActive('/admin') ? '600' : '400',
                    padding: '0.5rem 0'
                  }}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-outline"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          
          .flex > .flex {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
