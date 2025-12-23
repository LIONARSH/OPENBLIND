import React from 'react';

const Header = ({ title, onBack }) => (
  <header className="header-secondary">
    <button className="btn-back" onClick={onBack} aria-label="Volver">
      <span className="material-icons-round">arrow_back</span>
    </button>
    <h2 className="header-title">{title}</h2>
    <button className="navbar-btn" style={{ background: 'var(--primary)', borderColor: 'var(--primary)' }}>
      <span className="material-icons-round">mic</span>
    </button>
  </header>
);

export default Header;