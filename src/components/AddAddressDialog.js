import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
} from "@mui/material";

const AddAddressDialog = ({ open, onClose, onSave, initialData = {}, mode = "add" }) => {
  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "",
        phone: initialData.phone || "",
      });
    } else {
      setForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    }
  }, [initialData, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const finalData = mode === "edit" ? { ...initialData, ...form } : form;
    onSave(finalData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "edit" ? "Edit Address" : "Add New Address"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Address Name (e.g. Home, Work)"
              value={form.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="addressLine1"
              label="Address Line 1"
              value={form.addressLine1}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="addressLine2"
              label="Address Line 2"
              value={form.addressLine2}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={form.city}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={form.state}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="postalCode"
              label="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="country"
              label="Country"
              value={form.country}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="phone"
              label="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {mode === "edit" ? "Update Address" : "Save Address"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAddressDialog;
