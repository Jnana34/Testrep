import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";

const CartComponent = () => {
  const dispatch= useDispatch();
  const cartCountFlag= useSelector((state)=>state.cart.cartCountFlag);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:9001/cart/query/?hashmap=cart_data");
        const result = await response.json();
        const data = result.data || {};

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

    fetchCartItems();
  }, []);

  const updateCartItemInRedis = async (name, updatedData) => {
    try {
      await fetch("http://localhost:9001/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hashmap: "cart_data",
          key: name,
          value: JSON.stringify(updatedData),
        }),
      });
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const deleteCartItemFromRedis = async (name) => {
    try {
      await fetch("http://localhost:9001/cart/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hashmap: "cart_data",
          key: name,
        }),
      });
      dispatch(setCartCountFlag(!cartCountFlag))
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const handleRemove = (id) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    if (itemToRemove) {
      deleteCartItemFromRedis(itemToRemove.name);
    }
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    if (value === "") {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: "" } : item
        )
      );
      return;
    }

    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setCartItems((prevItems) => {
        const updated = prevItems.map((item) => {
          if (item.id === id) {
            const updatedItem = { ...item, quantity: newQuantity };
            updateCartItemInRedis(item.name, {
              price: item.price,
              quantity: newQuantity,
              image: item.image,
            });
            return updatedItem;
          }
          return item;
        });
        return updated;
      });
    }
  };

  const handleBlur = (id, value) => {
    const quantity = parseInt(value, 10);
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const correctedQuantity = !isNaN(quantity) && quantity > 0 ? quantity : 1;
          updateCartItemInRedis(item.name, {
            price: item.price,
            quantity: correctedQuantity,
            image: item.image,
          });
          return { ...item, quantity: correctedQuantity };
        }
        return item;
      })
    );
  };

  const totalDiscount = cartItems.reduce((total, item) => total + item.discount * item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price - item.discount) * item.quantity,
    0
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        My Cart ({cartItems.length})
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} md={8}>
            {cartItems.length === 0 ? (
              <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} sx={{ mb: 2, p: 2, boxShadow: 3, width: "140%", minHeight: "140px", position: "relative" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box
                        sx={{
                          width: "120px",
                          height: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          borderRadius: 2,
                          border: "1px solid #ddd",
                          marginTop: "-50px",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                    </Grid>

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

                      <Box mt={1} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} size="small">
                          <RemoveIcon />
                        </IconButton>
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
                        <IconButton color="error" onClick={() => handleRemove(item.id)} sx={{ ml: 2 }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>

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
      )}
    </Container>
  );
};

export default CartComponent;
