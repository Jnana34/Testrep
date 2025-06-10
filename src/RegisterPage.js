import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "./config/config";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    otp: "",
  });

  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          mobile_number: formData.mobile_number,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("OTP sent to your email. Please verify.");
        setStep(2);
        setResendTimer(60); // start timer on OTP send
      } else {
        setErrorMessage(result.detail || "Failed to send OTP");
      }
    } catch {
      setErrorMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setErrorMessage("");
    setSuccessMessage("Sending OTP...");

    try {
      const response = await fetch(`${config.API_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, mobile_number: formData.mobile_number }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("OTP resent to your email.");
        setResendTimer(60); // restart timer
      } else {
        setErrorMessage(result.detail || "Failed to resend OTP");
        setSuccessMessage("");
      }
    } catch {
      setErrorMessage("Server error while resending OTP.");
      setSuccessMessage("");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_URL}verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration complete! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMessage(result.detail || "OTP verification failed");
      }
    } catch {
      setErrorMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, mt: 10, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {step === 1 ? "Register" : "Verify OTP"}
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={step === 1 ? handleRegister : handleVerifyOTP}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {step === 1 ? (
            <>
              <TextField
                label="Username"
                name="username"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                label="First Name"
                name="first_name"
                fullWidth
                value={formData.first_name}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                name="last_name"
                fullWidth
                value={formData.last_name}
                onChange={handleChange}
              />
              <TextField
                label="Mobile Number"
                name="mobile_number"
                fullWidth
                value={formData.mobile_number}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="OTP"
                name="otp"
                fullWidth
                required
                value={formData.otp}
                onChange={handleChange}
              />
              <Button
                variant="outlined"
                fullWidth
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </Button>
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {step === 1 ? "Send OTP" : "Verify & Register"}
          </Button>
        </Box>

        {step === 1 && (
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component="button" onClick={() => navigate("/login")}>
                  Login
                </Link>
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default RegisterPage;
