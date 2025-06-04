// src/components/Navbar.js
import React from 'react';

function Navbar() {
  return (
    <nav style={{ background: '#333', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ margin: 0 }}>Compliance Assistant</h1>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
        <li style={{ marginLeft: '20px' }}><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
        <li style={{ marginLeft: '20px' }}><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Documents</a></li>
        <li style={{ marginLeft: '20px' }}><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Settings</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;