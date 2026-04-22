// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { gsap } from 'gsap';
import './index.css';
import './utils/i18n.js';
// Optional: Configure GSAP globally if needed
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

// Optional: Register GSAP plugins if you're using them
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger);

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
