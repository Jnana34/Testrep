import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import AddAddressDialog from "../AddAddressDialog";
import axios from "../../utilities/axiosConfig";

const SavedAddressesTab = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const userId = localStorage.getItem("user_id");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`/user-addresses/?user_id=${userId}`);
        //console.log("📄 Response data:", response.data); // just the data
        if (Array.isArray(response.data)) {
          setAddresses(response.data);
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddAddress = async (newAddress) => {
    try {
      const response = await axios.post(`/user-addresses/?user_id=${userId}`, newAddress);
      setAddresses((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  const handleUpdateAddress = async (updatedAddress) => {
    try {
      const response = await axios.put(`/user-addresses/?user_id=${userId}`, updatedAddress);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === updatedAddress.id ? response.data : addr))
      );
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`/user-addresses/?address_id=${id}`);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleDialogSave = (data) => {
    if (editingAddress) {
      handleUpdateAddress({ ...editingAddress, ...data });
    } else {
      handleAddAddress(data);
    }
    setEditingAddress(null);
  };
  const handleDeleteConfirmed = () => {
    if (addressToDelete) {
      handleDeleteAddress(addressToDelete);
      setDeleteConfirmOpen(false);
      setAddressToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Saved Addresses</Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ minWidth: 0, px: 1 }}
          onClick={() => {
            setEditingAddress(null);
            setDialogOpen(true);
          }}
        >
          <Add />
        </Button>
      </Box>

      {addresses.length === 0 ? (
        <Typography>No addresses saved yet.</Typography>
      ) : (
        addresses.map((addr) => (
          <Paper sx={{ p: 2, mb: 2, position: "relative" }} key={addr.id}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {addr.name?.trim() ? addr.name : "Untitled"}
              </Typography>
              <Box>
                <IconButton onClick={() => { setEditingAddress(addr); setDialogOpen(true); }}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setAddressToDelete(addr.id);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography>{addr.addressLine1}</Typography>
            {addr.addressLine2 && <Typography>{addr.addressLine2}</Typography>}
            <Typography>
              {addr.city}, {addr.state} {addr.postalCode}
            </Typography>
            <Typography>{addr.country}</Typography>
            <Typography>{`Contact: ${addr.phoneNumber}`}</Typography>
          </Paper>
        ))
      )}

      <AddAddressDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleDialogSave}
        initialData={editingAddress}
        mode={editingAddress ? "edit" : "add"}
      />
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this address? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavedAddressesTab;
