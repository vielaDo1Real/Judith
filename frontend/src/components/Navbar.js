import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import './Navbar.css';
import logoIcon from '../logo.svg';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Função para alternar o modo escuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  // Verificar o tema salvo no localStorage ao carregar o componente
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Aplicar o tema ao body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const menuFunc = () => {
    const listMenu = document.getElementById("list_menu");
    if (listMenu.style.display === "block") {
      listMenu.style.display = "none";
    } else {
      listMenu.style.display = "block";
    }
  };

  const scrollFunction = () => {
    if (window.scrollY > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("logo").style.width = "150px";
      document.getElementById("logo_icon").style.width = "60px";
      document.getElementById("endereco_row").style.marginTop = "9px";
      document.getElementById("endereco_row").style.marginBottom = "0px";
      document.getElementById("endereco_row").style.transition = "0.2s linear";
      document.getElementById("logo_mobile").style.width = "110px";
      document.getElementById("icon_btn").style.fontSize = "35px";
      document.getElementById("icon_btn").style.margin = "2px";
    } else {
      document.getElementById("logo").style.width = "300px";
      document.getElementById("logo_icon").style.width = "100px";
      document.getElementById("endereco_row").style.marginTop = "22.825px";
      document.getElementById("endereco_row").style.transition = "0.2s linear";
      document.getElementById("logo_mobile").style.width = "230px";
      document.getElementById("icon_btn").style.fontSize = "58px";
      document.getElementById("icon_btn").style.margin = "10.15px";
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', scrollFunction);
    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, []);

  return (
    <header className={darkMode ? 'dark-mode' : ''}>
      <div id="menu" className="menu">
        <Link to="/">
          <img id="logo" className="logo" src={logo} alt="Logo" />
        </Link>
        <div className="menu_right" id="menu_principal">
          <Link id="btn_menu" className="btn_menu" to="/">Home</Link>
          <Link id="btn_menu" className="btn_menu" to="/login">Login</Link>
          <Link id="btn_menu" className="btn_menu" to="/dashboard">Dashboard</Link>
        </div>
        <div className="menu_right" id="icon_menu">
          <a href="javascript:void(0)" onClick={menuFunc} className="icon_menu">
            <i id="icon_btn" className="fa fa-bars"></i>
          </a>
          <img className="menu_right" id="logo_mobile" src={logo} alt="Logo Mobile" />
        </div>
        <div id="endereco_row" className="endereco">
          <a href="">
            <img id="logo_icon" className="logo_icon" src={logoIcon} alt="Ícone" />
          </a>
        </div>
        {/* Botão para alternar o modo escuro */}
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>
      <div className="list_menu" id="list_menu">
        <ul className="list" id="list">
          <li><Link to="/">Início</Link></li>
          <li><Link to="/cadastro">Cadastro</Link></li>
          <li><Link to="/logout">Sair</Link></li>
          <li style={{ alignItems: 'center' }}>
            <img id="logo_icon" className="logo_icon" src={logoIcon} alt="Ícone" />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;