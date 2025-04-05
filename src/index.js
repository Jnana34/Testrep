import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './Cart';
import Products from './products';
import { CartProvider } from './CartContext'; // ✅ Wrap with context

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} /> {/* ✅ All routes inside App */}
        </Routes>
      </Router>
    </CartProvider>
  </React.StrictMode>
);

reportWebVitals();
