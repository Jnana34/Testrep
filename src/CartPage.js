import React, { useState, useEffect } from "react";
import axios from "./utilities/axiosConfig";
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
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";

const CartComponent = () => {
  const token = localStorage.getItem("access_token");
  const formatRupees = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  const dispatch = useDispatch();
  const cartCountFlag = useSelector((state) => state.cart.cartCountFlag);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proceedAlert, setProceedAlert] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`cart/query/?hashmap=cart_data`);
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
        const response = await axios.get(`fetchaddress/`, {
          params: { user_id: 17 }, // ✅ use params for query strings
        });
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setDeliveryAddress(data[0]); // Use first address
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
      await axios.post(`cart/update/`,
        {
          hashmap: "cart_data",
          key: name,
          value: JSON.stringify(updatedData),
        }
      );
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const deleteCartItemFromRedis = async (name) => {
    try {
      await axios.post(`cart/delete/`,
        {
          hashmap: "cart_data",
          key: name,
        }
      );

      dispatch(setCartCountFlag(!cartCountFlag));
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const clearCartInRedis = async () => {
    try {
      for (const item of cartItems) {
        await deleteCartItemFromRedis(item.name);
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceed = async () => {
    if (cartItems.length === 0) {
      setProceedAlert(true);
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your connection.");
      return;
    }

    const options = {
      key: "rzp_test_lsPQxI0eQgMdf5", // Replace with your Razorpay key
      amount: totalPrice * 100, // in paise
      currency: "INR",
      name: "Your Store",
      description: "Order Payment",
      image: "https://yourlogo.url/logo.png", // optional
      // handler: async function (response) {
      //   alert("Payment successful. Payment ID: " + response.razorpay_payment_id);
      //   await clearCartInRedis();
      //   setCartItems([]);
      //   dispatch(setCartCountFlag(!cartCountFlag));
      //   setOrderPlaced(true);
      // },

      handler: async function (response) {
        alert("Payment successful. Payment ID: " + response.razorpay_payment_id);

        // Construct order payload
        const orderPayload = {
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount,
          })),
          total_amount: totalPrice,
          delivery_address: deliveryAddress,
          razorpay_payment_id: response.razorpay_payment_id,
        };

        try {
          const saveOrderRes = await axios.post(`save-order/`,orderPayload);

          // Optionally check response status or data if needed
          if (saveOrderRes.status !== 200 && saveOrderRes.status !== 201) {
            throw new Error("Failed to save order in DB");
          }

          await clearCartInRedis();
          setCartItems([]);
          dispatch(setCartCountFlag(!cartCountFlag));
          setOrderPlaced(true);
        }catch (err) {
          alert("Order was paid but saving failed: " + err.message);
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
      theme: {
        color: "#1976d2",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setProceedAlert(false);
    setPaymentDialogOpen(true);
  };



  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
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
          ✅ Payment confirmed! Your order has been placed.
        </Alert>
      )}

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
                          <s>{formatRupees(item.price)}</s> <b>{formatRupees(item.price - item.discount)}</b>
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          You save: {formatRupees(item.discount)}
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
          {cartItems.length > 0 && (
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Card sx={{ p: 3, boxShadow: 3, width: "350px", position: "sticky", top: "80px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Delivery Address
                  </Typography>
                  <Box sx={{ mb: 3, p: 2, border: "1px solid", borderColor: "grey.300", borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {deliveryAddress?.full_name || "Name not provided"}
                    </Typography>
                    <Typography variant="body2">
                      {deliveryAddress
                        ? `${deliveryAddress.address_line1}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.postal_code}`
                        : "Address not provided"}
                    </Typography>
                    <Typography variant="body2">{deliveryAddress?.country || "Country not provided"}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Phone: {deliveryAddress?.mobile_number || "Phone not provided"}
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Price Details
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">{formatRupees(totalPrice + totalDiscount)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="success.main">
                      Discount Applied
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      -{formatRupees(totalDiscount)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {formatRupees(totalPrice)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, textTransform: "none" }}
                    onClick={handleProceed}
                  >
                    Proceed to Buy
                  </Button>
                </Card>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default CartComponent;
