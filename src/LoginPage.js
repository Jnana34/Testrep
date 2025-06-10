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
    fetch("/config.json")
      .then((res) => res.json())
      .then((config) => {
        console.log("Loaded config:", config);
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: emailOrPhone,
          password: password,
          username: 'required',
        }),
      });

      const result = await response.json();
      console.log("Login response:", response.status, result);

      if (response.ok && result.access && result.refresh) {
        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);

        dispatch(loginSuccess());
        onLoginSuccess();
        navigate("/home");
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
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Link>
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
