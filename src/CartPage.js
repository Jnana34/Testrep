import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  Grid,
  IconButton,
  Divider,
  Box,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: " Lavender Bliss",
      price: 120,
      quantity: 1,
      image: "/images/i3.jpg",
      discount: 10,
      seller: "ABC Retailers",
      delivery: "3-5 days",
    },
    {
      id: 2,
      name: "Backpack",
      price: 80,
      quantity: 2,
      image: "/images/i1.jpg",
      discount: 5,
      seller: "XYZ Traders",
      delivery: "4-6 days",
    },
    {
      id: 1,
      name: "Leather Bag",
      price: 120,
      quantity: 1,
      image: "/images/i2.jpg",
      discount: 10,
      seller: "ABC Retailers",
      delivery: "3-5 days",
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    if (value === "") {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: "" } : item
        )
      );
    } else {
      const newQuantity = parseInt(value, 10);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    }
  };

  const handleBlur = (id, value) => {
    if (value === "" || isNaN(value) || value < 1) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: 1 } : item
        )
      );
    }
  };

  const totalDiscount = cartItems.reduce((total, item) => total + item.discount * item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price - item.discount) * item.quantity,
    0
  );

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        My Cart ({cartItems.length})
      </Typography>

      <Grid container spacing={3} justifyContent="space-between">
        {/* Cart Items Section (Left Side) */}
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Typography variant="h6">Your cart is empty.</Typography>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2, p: 2, boxShadow: 3, width: "140%", minHeight: "140px", position: "relative" }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Product Image (Fixed Size) */}
                  <Grid item xs={3}>
                    <Box
                      sx={{
                        width: "120px", // Set a fixed width
                        height: "120px", // Set a fixed height
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        borderRadius: 2,
                        border: "1px solid #ddd", // Optional: Border for clarity
                        marginTop: "-50px",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%", // Forces image to stretch to the box width
                          height: "100%", // Forces image to stretch to the box height
                          objectFit: "cover", // Ensures the image covers the box without distortion
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Product Details (Fixed Layout) */}
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Seller: {item.seller}</Typography>
                      <Typography variant="body2" color="textSecondary">Delivery in {item.delivery}</Typography>
                      <Typography variant="body2" color="error">
                        <s>${item.price}</s> <b>${item.price - item.discount}</b>
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        You save: ${item.discount}
                      </Typography>
                    </Box>

                    {/* Quantity Controls & Delete Icon in Line */}
                    <Box mt={1} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} size="small">
                        <RemoveIcon />
                      </IconButton>

                      {/* Direct Quantity Input (Without Up/Down Arrows) */}
                      <TextField
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        onBlur={(e) => handleBlur(item.id, e.target.value)}
                        inputProps={{ style: { textAlign: "center", MozAppearance: "textfield" } }}
                        size="small"
                        sx={{
                          width: "50px",
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                        }}
                      />

                      <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)} size="small">
                        <AddIcon />
                      </IconButton>

                      {/* Delete Icon Aligned with Quantity Controls */}
                      <IconButton color="error" onClick={() => handleRemove(item.id)} sx={{ ml: 2 }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Save for Later (Top Right Corner) */}
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ position: "absolute", top: 10, right: 10, textTransform: "none" }}
                  >
                    Save for Later
                  </Button>
                </Grid>
              </Card>
            ))
          )}
        </Grid>

        {/* Price Details Section (Rightmost Side) */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Card sx={{ p: 3, boxShadow: 3, width: "350px", position: "sticky", top: "80px" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Price Details
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${totalPrice + totalDiscount}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" color="success.main">
                  Discount Applied
                </Typography>
                <Typography variant="body1" color="success.main">
                  -${totalDiscount}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total Amount
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${totalPrice}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, textTransform: "none" }}
              >
                Proceed to Buy
              </Button>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartComponent;
