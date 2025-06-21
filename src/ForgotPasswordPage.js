import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "./config/config";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${config.API_URL}forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.detail);
        setStep(2);
      } else {
        setError(result.detail || "Failed to send OTP.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${config.API_URL}verify-otp-password-reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.detail);
        setStep(3);
      } else {
        setError(result.detail || "Invalid OTP.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.detail);
        setTimeout(() => navigate("/login"), 2000); // Redirect to login
      } else {
        setError(result.detail || "Password reset failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10, borderRadius: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        {step === 1 && (
          <Box component="form" onSubmit={handleSendOTP} sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Send OTP
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box component="form" onSubmit={handleVerifyOTP} sx={{ mt: 2 }}>
            <TextField
              label="Enter OTP"
              type="text"
              fullWidth
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Verify OTP
            </Button>
          </Box>
        )}

        {step === 3 && (
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Reset Password
            </Button>
          </Box>
        )}

        <Button
          onClick={() => navigate("/login")}
          variant="text"
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
