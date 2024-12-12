import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff', // Couleur blanche pour correspondre à la navbar
        color: '#333333', // Couleur sombre pour le texte
        textAlign: 'center',
        padding: '16px 20px',
        width: '100%',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', // Ombre subtile
        position: 'relative',
        bottom: 0,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Logo et Liens */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
          }}
        >
          <a
            href='/'
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg'
              alt='logo'
              style={{ height: '40px' }}
            />
          </a>

          
        </div>

        {/* Ligne de séparation */}
        <hr style={{ borderColor: '#eeeeee', margin: '16px 0' }} />

        {/* Texte du Footer */}
        <span style={{ fontSize: '14px', color: '#555' }}>
          © 2024{' '}
          <a
            href='https://flowbite.com/'
            style={{ color: '#f1797e', textDecoration: 'none' }}
          >
            NLP Project
          </a>
          <div>RHOUMA Sarra - BERGAOUI Rim</div>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
