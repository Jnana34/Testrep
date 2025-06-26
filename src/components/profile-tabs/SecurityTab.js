// components/profile-tabs/SecurityTab.js

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import axios from "../../utilities/axiosConfig";

const SecurityTab = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `/change-password/`,
        {
          current_password: form.currentPassword,
          new_password: form.newPassword,
        }
      );

      setSuccessMsg(response.data.detail || "Password updated.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errDetail =
        error.response?.data?.detail || "Failed to update password.";
      setErrorMsg(errDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Password Management
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            fullWidth
            value={form.currentPassword}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            value={form.newPassword}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        color="secondary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </Box>
  );
};

export default SecurityTab;
