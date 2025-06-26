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
import axios from "./utilities/axiosConfig";

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

  // ✅ Check auth via backend (cookie-based)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`/auth/me/`, {
          withCredentials: true, // ✅ include cookies
        });

        if (res.status === 200) {
          dispatch(loginSuccess());
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) setShowIdleModal(false);
  }, [isAuthenticated]);

  const handleLogout = useCallback(
    async (isIdle = false) => {
      if (!isAuthPage && isAuthenticated) {
        try {
          await axios.post("/auth/logout/", null, {
            withCredentials: true, // Include cookies
          });
        } catch (err) {
          console.error("Logout failed:", err);
        }

        dispatch(logout());

        if (isIdle) setShowIdleModal(true);
      }
    },
    [isAuthPage, isAuthenticated, dispatch]
  );

  // ⏳ Inactivity timeout
  useIdleLogout(
    config.Inactive_timeout_sec * 1000,
    () => handleLogout(true),
    authChecked && isAuthenticated
  );

  // 🕒 Hard timeout
  useHardLogout(
    config.Session_timeout_sec * 1000,
    () => handleLogout(true),
    authChecked && isAuthenticated
  );

  const handleGoToLogin = () => {
    setShowIdleModal(false);
    navigate("/login");
  };

  const shouldShowHeader = !isAuthPage;
  const shouldShowFooter = !isAuthPage;

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
        <Typography variant="h6">Checking authentication...</Typography>
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
        {[
          { path: "/home", element: <Home /> },
          { path: "/cart", element: <Cart /> },
          { path: "/products", element: <Products /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/wishlist", element: <WishlistPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/support", element: <SupportPage /> },
        ].map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              isAuthenticated || allowAccessWhileModal ? (
                element
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        ))}
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
            You were logged out due to inactivity.
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
