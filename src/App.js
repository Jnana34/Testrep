import React, { useEffect, useState, useCallback } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./home";
import Cart from "./Cart";
import Products from "./products";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "./redux/authSlice";
import useIdleLogout from "./hooks/useIdleLogout";
import { Modal, Box, Typography, Button } from "@mui/material";
import config from "./config/config";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [authChecked, setAuthChecked] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(loginSuccess());
    } else {
      dispatch(logout());
    }
    setAuthChecked(true);
  }, [dispatch]);

  // **NEW** Reset modal when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setShowIdleModal(false);
    }
  }, [isAuthenticated]);

  const handleIdleLogout = useCallback(() => {
    if (!isAuthPage && isAuthenticated) {
      localStorage.removeItem("access_token");
      dispatch(logout());
      setShowIdleModal(true);
    }
  }, [isAuthPage, isAuthenticated, dispatch]);

  useIdleLogout(config.Inactive_timeout_sec * 1000, handleIdleLogout, authChecked && isAuthenticated);

  const handleGoToLogin = () => {
    setShowIdleModal(false);
    navigate("/login");
  };

  const hideHeaderOnRoutes = ["/login", "/register", "/forgot-password"];
  const hideFooterOnRoutes = ["/login", "/register", "/forgot-password"];
  const shouldShowHeader = !hideHeaderOnRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterOnRoutes.includes(location.pathname);

  if (!authChecked) return null;

  const allowAccessWhileModal =
    showIdleModal && !isAuthPage && !isAuthenticated;

  return (
    <>
      {shouldShowHeader && <Header onLogout={handleIdleLogout} />}

      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <Cart />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <Products />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {shouldShowFooter && <Footer />}

      {/* Idle Logout Modal */}
      <Modal open={showIdleModal && !isAuthPage} onClose={handleGoToLogin}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            zIndex: 1300,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Logged Out Due to Inactivity
          </Typography>
          <Typography variant="body1" mb={3}>
            You have been automatically logged out.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </Box>
      </Modal>
    </>
  );
};


const App = () => (
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);

export default App;
