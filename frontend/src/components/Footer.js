import React from 'react';
import { Link } from 'react-router-dom';
import logoIconCut from '../logo.svg'; // Importe o ícone

const Footer = () => {
  return (
    <footer className="page-footer font-small blue">
      <div className="footer-copyright text-center py-3">
        © 2021 Copyright:
        <Link to="/"> FAZENDAS</Link>
        <p>
          Website by:{" "}
          <a href="https://card.gconelhero.ga">
            <img style={{ width: '35px' }} src={logoIconCut} alt="Ícone CSTECH" />
          </a>
        </p>
        <p>
          Contact information:{" "}
          <a href="mailto:cstech@protonmail.com">cstech@protonmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;