// CartComponent.js
import React, { useState, useEffect } from "react";
import axios from "./utilities/axiosConfig";
import {
  Container,
  Typography,
  Card,
  Paper,
  Grid,
  IconButton,
  Divider,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";

const CartComponent = () => {
  const dispatch = useDispatch();
  const cartCountFlag = useSelector((state) => state.cart.cartCountFlag);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proceedAlert, setProceedAlert] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatRupees = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("cart/query/?hashmap=cart_data");
        const data = response.data?.data || {};
        const items = Object.entries(data).map(([name, value], index) => {
          const parsed = JSON.parse(value);
          return {
            id: index + 1,
            name,
            price: parseFloat(parsed.price),
            quantity: parsed.quantity,
            image: parsed.image,
            discount: 5,
            seller: "Default Seller",
            delivery: "3-5 days",
          };
        });
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddress = async () => {
      try {
        const response = await axios.get("fetchaddress/");
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setDeliveryAddress(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };

    fetchAddress();
    fetchCartItems();
  }, [cartCountFlag]);

  const updateCartItemInRedis = async (name, updatedData) => {
    try {
      await axios.post("cart/update/", {
        hashmap: "cart_data",
        key: name,
        value: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const deleteCartItemFromRedis = async (name) => {
    try {
      await axios.post("cart/delete/", {
        hashmap: "cart_data",
        key: name,
      });
      dispatch(setCartCountFlag(!cartCountFlag));
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const clearCartInRedis = async () => {
    try {
      await Promise.all(cartItems.map((item) => deleteCartItemFromRedis(item.name)));
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const handleRemove = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      deleteCartItemFromRedis(item.name);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleQuantityChange = (id, value) => {
    if (value === "") {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: "" } : item))
      );
      return;
    }

    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const updated = { ...item, quantity: qty };
            updateCartItemInRedis(item.name, {
              price: item.price,
              quantity: qty,
              image: item.image,
            });
            return updated;
          }
          return item;
        })
      );
    }
  };

  const handleBlur = (id, value) => {
    const qty = parseInt(value, 10);
    const corrected = !isNaN(qty) && qty > 0 ? qty : 1;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updateCartItemInRedis(item.name, {
            price: item.price,
            quantity: corrected,
            image: item.image,
          });
          return { ...item, quantity: corrected };
        }
        return item;
      })
    );
  };

  const totalDiscount = cartItems.reduce((sum, item) => sum + item.discount * item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price - item.discount) * item.quantity,
    0
  );

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleUpdateAddress = async (updatedAddress) => {
    try {
      const response = await axios.put(`/user-addresses/`, updatedAddress);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === updatedAddress.id ? response.data : addr))
      );
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleProceed = async () => {
    if (!cartItems.length) {
      setProceedAlert(true);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) return alert("Failed to load Razorpay SDK.");

    const options = {
      key: "rzp_test_lsPQxI0eQgMdf5",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Your Store",
      description: "Order Payment",
      image: "https://yourlogo.url/logo.png",
      handler: async function (response) {
        try {
          const orderPayload = {
            items: cartItems.map(({ name, price, quantity, discount }) => ({
              name,
              price,
              quantity,
              discount,
            })),
            total_amount: totalPrice,
            delivery_address: deliveryAddress,
            razorpay_payment_id: response.razorpay_payment_id,
          };

          const res = await axios.post("save-order/", orderPayload);
          if (![200, 201].includes(res.status)) throw new Error("Saving failed");

          await clearCartInRedis();
          setCartItems([]);
          dispatch(setCartCountFlag(!cartCountFlag));
          setOrderPlaced(true);
        } catch (err) {
          alert("Payment succeeded, but saving order failed.");
        }
      },
      prefill: {
        name: "Jnana Das",
        email: "jnanaranjan27@gmail.com",
        contact: "+916370610827",
      },
      notes: {
        address: "Bangalore, 560034, India",
      },
      theme: { color: "#1976d2" },
    };

    new window.Razorpay(options).open();
    setProceedAlert(false);
    setPaymentDialogOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", mb: 2 }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        My Cart ({cartItems.length})
      </Typography>

      {proceedAlert && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please add items to your cart before proceeding to pay.
        </Alert>
      )}

      {orderPlaced && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ Payment successful! Your order has been placed.
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.length === 0 ? (
              <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} sx={{ mb: 2, p: 2, boxShadow: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box sx={{ width: "100%", height: 100, overflow: "hidden", borderRadius: 2 }}>
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2">Seller: {item.seller}</Typography>
                      <Typography variant="body2">Delivery in {item.delivery}</Typography>
                      <Typography variant="body2" color="error">
                        <s>{formatRupees(item.price)}</s> <b>{formatRupees(item.price - item.discount)}</b>
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        You save: {formatRupees(item.discount)}
                      </Typography>
                      <Box mt={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} size="small">
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          type="text"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          onBlur={(e) => handleBlur(item.id, e.target.value)}
                          size="small"
                          sx={{ width: 50, input: { textAlign: "center" } }}
                        />
                        <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)} size="small">
                          <AddIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleRemove(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ))
            )}
          </Grid>

          {cartItems.length > 0 && (
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, boxShadow: 3, position: "sticky", top: 80 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Delivery Address
                </Typography>
                {deliveryAddress && (
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography fontWeight="bold">{deliveryAddress.full_name}</Typography>
                      <IconButton onClick={() => {
                        setEditingAddress(deliveryAddress);
                        setDialogOpen(true);
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography>{deliveryAddress.address_line1}</Typography>
                    {deliveryAddress.address_line2 && <Typography>{deliveryAddress.address_line2}</Typography>}
                    <Typography>{`${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.postal_code}`}</Typography>
                    <Typography>{deliveryAddress.country}</Typography>
                    <Typography>{`Contact: ${deliveryAddress.mobile_number}`}</Typography>
                  </Paper>
                )}
                <Typography variant="h6" fontWeight="bold">Price Details</Typography>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography>Subtotal</Typography>
                  <Typography>{formatRupees(totalPrice + totalDiscount)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="success.main">Discount</Typography>
                  <Typography color="success.main">-{formatRupees(totalDiscount)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography fontWeight="bold">{formatRupees(totalPrice)}</Typography>
                </Box>
                <Button variant="contained" color="primary" fullWidth onClick={handleProceed}>
                  Proceed to Pay
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {editingAddress && (
        <EditAddressDialog
          open={dialogOpen}
          address={editingAddress}
          onClose={() => setDialogOpen(false)}
          onSave={(updated) => {
            setDeliveryAddress(updated);
            setDialogOpen(false);
            handleUpdateAddress(updated);
          }}
        />
      )}
    </Container>
  );
};

export default CartComponent;

// --- EditAddressDialog Component ---
const EditAddressDialog = ({ open, address, onClose, onSave }) => {
  const [form, setForm] = useState({ ...address });

  useEffect(() => {
    setForm({ ...address });
  }, [address]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Address</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Full Name" value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} fullWidth />
        <TextField label="Address Line 1" value={form.address_line1} onChange={(e) => setForm((prev) => ({ ...prev, address_line1: e.target.value }))} fullWidth />
        <TextField label="Address Line 2" value={form.address_line2} onChange={(e) => setForm((prev) => ({ ...prev, address_line2: e.target.value }))} fullWidth />
        <TextField label="City" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} fullWidth />
        <TextField label="State" value={form.state} onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))} fullWidth />
        <TextField label="Postal Code" value={form.postal_code} onChange={(e) => setForm((prev) => ({ ...prev, postal_code: e.target.value }))} fullWidth />
        <TextField label="Country" value={form.country} onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))} fullWidth />
        <TextField label="Mobile Number" value={form.mobile_number} onChange={(e) => setForm((prev) => ({ ...prev, mobile_number: e.target.value }))} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(form)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
