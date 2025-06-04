import React from 'react';
import Navbar from './components/Navbar';
import './App.css'; 

function App() {
  return (
    <div>
      <Navbar /> {/* This is where you render your Navbar */}
      <main style={{ padding: '20px' }}>
        <h2>Welcome to your Regulatory Compliance Assistant!</h2>
        <p>Upload documents here to get started.</p>
      </main>
    </div>
  );
}

export default App;
