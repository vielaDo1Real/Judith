// Path: frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import './Navbar.css';
import logoIcon from '../logo.svg';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    localStorage.setItem('darkMode', !darkMode);
    console.log('Dark Mode:', !darkMode); // Debug
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80 || document.documentElement.scrollTop > 80;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={darkMode ? 'dark-mode' : ''} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <div id="menu" className="menu">
        <Link to="/">
          <img id="logo" className="logo" src={logo} alt="Logo" style={{ width: isScrolled ? '150px' : '300px', transition: '0.2s linear' }} />
        </Link>
        <div className="menu_right" id="menu_principal">
          <Link id="btn_menu" className="btn_menu" to="/">Home</Link>
          <Link id="btn_menu" className="btn_menu" to="/login">Login</Link>
          <Link id="btn_menu" className="btn_menu" to="/dashboard">Dashboard</Link>
          {isAuthenticated && (
            <button onClick={() => localStorage.removeItem('token')} className="btn_menu">Logout</button>
          )}
        </div>
        <div className="menu_right" id="icon_menu">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="icon_menu" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: isScrolled ? '35px' : '58px', margin: isScrolled ? '2px' : '10.15px', transition: '0.2s linear' }}>
            <i id="icon_btn" className="fa fa-bars"></i>
          </button>
          <img className="menu_right" id="logo_mobile" src={logo} alt="Logo Mobile" style={{ width: isScrolled ? '110px' : '230px', transition: '0.2s linear' }} />
        </div>
        <div id="endereco_row" className="endereco" style={{ marginTop: isScrolled ? '9px' : '22.825px', marginBottom: isScrolled ? '0px' : '22.825px', transition: '0.2s linear' }}>
          <a href="#">
            <img id="logo_icon" className="logo_icon" src={logoIcon} alt="Ícone" style={{ width: isScrolled ? '60px' : '100px', transition: '0.2s linear' }} />
          </a>
        </div>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>
      <div className={`list_menu ${isMenuOpen ? 'visible' : 'hidden'}`} id="list_menu">
        <ul className="list" id="list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li style={{ alignItems: 'center' }}>
            <img id="logo_icon" className="logo_icon" src={logoIcon} alt="Ícone" style={{ width: isScrolled ? '60px' : '100px', transition: '0.2s linear' }} />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;