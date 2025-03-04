import React from 'react';
import { Link } from 'react-router-dom';
import logoIconCut from '../logo.svg'; // Importe o ícone

const Footer = () => {
  return (
    <footer className="page-footer font-small blue">
      <div className="footer-copyright text-center py-3">
        © 2025 Copyright:
        <Link to="/">Judith</Link>
        <p>
          Website by:{"Viela"}
          <a href="https://ifconfig.me">
            <img style={{ width: '35px' }} src={logoIconCut} alt="Ícone CSTECH" />
          </a>
        </p>
        <p>
          Contact information:{" "}
          <a href="mailto:vielado1real@gmail.com.com">vielado1real@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;