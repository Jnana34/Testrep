import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate authentication (replace with real API logic)
    if (email === "test@example.com" && password === "password") {
      onLoginSuccess(); // Notify App.jsx to mark user as logged in
      navigate("/home"); // Redirect after login
    } else {
      alert("Invalid credentials. Try test@example.com / password");
      navigate("/home");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, mt: 10, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              <Link component="button" variant="body2" onClick={handleForgotPassword}>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Link component="button" onClick={handleRegisterRedirect}>
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
