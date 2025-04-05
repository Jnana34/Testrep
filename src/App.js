import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Home from "./home";
import Cart from "./Cart";
import Products from "./products";
import { Provider } from "react-redux";
import { store } from "./redux/store";
const App = () => {
  return (
    <Provider store={store}>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        {/* Add more routes as needed */}
      </Routes>
    </Provider>
  );
};

export default App;
