import React, { useEffect, useState, useCallback } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider, createTheme, CssBaseline, responsiveFontSizes } from "@mui/material";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ProfilePage from './ProfilePage';
import OrdersPage from './OrdersPage';
import WishlistPage from './WishlistPage';
import SettingsPage from './SettingsPage';
import SupportPage from './SupportPage';
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
import useHardLogout from "./hooks/useHardLogout"; // <-- Add this
import { Modal, Box, Typography, Button } from "@mui/material";
import config from "./config/config";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [authChecked, setAuthChecked] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);

  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(loginSuccess());
    } else {
      dispatch(logout());
    }
    setAuthChecked(true);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setShowIdleModal(false);
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(
    (isIdle = false) => {
      if (!isAuthPage && isAuthenticated) {
        localStorage.removeItem("access_token");
        dispatch(logout());
        if (isIdle) {
          setShowIdleModal(true);
        }
      }
    },
    [isAuthPage, isAuthenticated, dispatch]
  );

  // Inactivity logout (15 min)
  useIdleLogout(
    config.Inactive_timeout_sec * 1000,
    () => handleLogout(true),
    authChecked && isAuthenticated
  );

  // Hard timeout logout (1 hour)
  useHardLogout(
    config.Session_timeout_sec * 1000,
    () => handleLogout(true),
    authChecked && isAuthenticated
  );

  const handleGoToLogin = () => {
    setShowIdleModal(false);
    navigate("/login");
  };

  const hideHeaderOnRoutes = ["/login", "/register", "/forgot-password"];
  const hideFooterOnRoutes = ["/login", "/register", "/forgot-password"];
  const shouldShowHeader = !hideHeaderOnRoutes.includes(location.pathname);
  const shouldShowFooter = !hideFooterOnRoutes.includes(location.pathname);

  if (!authChecked) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }


  const allowAccessWhileModal =
    showIdleModal && !isAuthPage && !isAuthenticated;

  return (
    <>
      {shouldShowHeader && <Header onLogout={() => handleLogout(false)} />}

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
        <Route
          path="/profile"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <OrdersPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/wishlist"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <WishlistPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <SettingsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/support"
          element={
            isAuthenticated || allowAccessWhileModal ? (
              <SupportPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      </Routes>

      {shouldShowFooter && <Footer />}

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
            Logged Out
          </Typography>
          <Typography variant="body1" mb={3}>
            Logged out Due to Inactivity.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </Box>
      </Modal>
    </>
  );
};

let theme = createTheme();
theme = responsiveFontSizes(theme);

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppWrapper />
    </ThemeProvider>
  </Provider>
);

export default App;
