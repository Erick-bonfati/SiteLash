import React from 'react';

const certificates = [
  {
    title: 'Extensão de Cílios Volume Brasileiro',
    institution: 'Academia Lash Brasil',
    year: '2023',
    description: 'Perfeiçoamento em efeitos estruturados e curvaturas personalizadas para cada formato de olhar.',
    hours: '120h'
  },
  {
    title: 'Design de Sobrancelhas & Brow Lamination',
    institution: 'Studio Deluxe',
    year: '2022',
    description: 'Formação completa com foco em simetria, visagismo e protocolos de cuidados pós-procedimento.',
    hours: '80h'
  },
  {
    title: 'Colorimetria Aplicada à Beleza',
    institution: 'Beauty Color Academy',
    year: '2021',
    description: 'Estudos avançados de combinações cromáticas para realçar tons de pele e harmonizar paletas.',
    hours: '60h'
  }
];

const SobreMim = () => {
  const profileImage = './image.png';

  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(135deg, #f8b5c1 0%, #fce7f3 100%)',
          padding: '4rem 0'
        }}
      >
        <div className="container">
          <div
            className="grid grid-2"
            style={{ alignItems: 'center', gap: '3rem' }}
          >
            <div>
              <p
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.2rem',
                  color: '#ec4899',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}
              >
                sobre mim
              </p>
              <h1
                style={{
                  fontSize: '3rem',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                  color: '#4a4a4a'
                }}
              >
                Uma experiência delicada,
                <br />
                feita sob medida para você
              </h1>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}
              >
                Sou apaixonada por acolher, ouvir e transformar a autoestima de
                cada cliente. Meu estúdio foi pensado para ser um refúgio
                feminino, onde você se sente confortável desde o primeiro
                contato até o cuidado pós-atendimento.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  color: '#4a4a4a'
                }}
              >
                <div
                  className="card"
                  style={{
                    padding: '1.5rem',
                    minWidth: '180px',
                    background: '#fff'
                  }}
                >
                  <p style={{ fontSize: '2rem', fontWeight: 700 }}>+4</p>
                  <span style={{ color: '#6b7280' }}>anos de experiência</span>
                </div>
                <div
                  className="card"
                  style={{
                    padding: '1.5rem',
                    minWidth: '180px',
                    background: '#fff'
                  }}
                >
                  <p style={{ fontSize: '2rem', fontWeight: 700 }}>+3000</p>
                  <span style={{ color: '#6b7280' }}>atendimentos realizados</span>
                </div>
              </div>
            </div>

            <div className="flex-center">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '420px',
                  borderRadius: '30px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(236, 72, 153, 0.2)',
                  border: '8px solid rgba(255,255,255,0.8)'
                }}
              >
                <img
                  src={profileImage}
                  alt="Foto principal"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(event) => {
                    event.target.style.display = 'none';
                    event.target.parentElement.style.background =
                      'linear-gradient(135deg, #fde4f1, #f8b5c1)';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.2rem',
                color: '#ec4899',
                fontWeight: 600,
                marginBottom: '0.5rem'
              }}
            >
              Formação contínua
            </p>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                color: '#4a4a4a',
                marginBottom: '1rem'
              }}
            >
              Certificados & especializações
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                maxWidth: '620px',
                margin: '0 auto'
              }}
            >
              Eu acredito em atualização constante para entregar técnicas
              seguras, resultados delicados e protocolos alinhados com as
              tendências internacionais.
            </p>
          </div>

          <div className="grid grid-3">
            {certificates.map((certificate) => (
              <div key={certificate.title} className="card fade-in">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: '#ec4899'
                    }}
                  >
                    {certificate.year}
                  </span>
                  <span
                    style={{
                      background: '#fdf2f8',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      color: '#ec4899',
                      fontWeight: 600
                    }}
                  >
                    {certificate.hours}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  {certificate.title}
                </h3>
                <p
                  style={{
                    color: '#ec4899',
                    fontWeight: 500,
                    marginBottom: '0.75rem'
                  }}
                >
                  {certificate.institution}
                </p>
                <p style={{ color: '#6b7280' }}>{certificate.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreMim;
