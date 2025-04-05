import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Home from "./home";
import Cart from "./Cart";
import Products from "./products";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
};

export default App;
