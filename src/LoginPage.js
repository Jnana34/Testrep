import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/authSlice";
import config from "./config/config";

const LoginPage = ({ onLoginSuccess }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!config?.API_URL) {
      console.warn("API_URL not found in config.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 Important: Enable cookie-based auth
        body: JSON.stringify({
          identifier: emailOrPhone,
          password: password,
          username: 'Ja34',
        }),
      });

      const result = await response.json();
      console.log("Login response:", response.status,response.ok ,result);


      if (response.ok) {
        // No token handling on client — it's stored in HttpOnly cookie
        dispatch(loginSuccess(result.user)); // optional: store user info
        if (onLoginSuccess) onLoginSuccess();
        navigate("/products");
      } else {
        const error =
          result?.detail || "Invalid credentials. Please try again.";
        setErrorMessage(error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, mt: 10, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email or Phone Number"
            type="text"
            fullWidth
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            autoComplete="username"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Typography>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Link component="button" onClick={() => navigate("/register")}>
                Register
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
