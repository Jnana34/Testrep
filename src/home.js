import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "./CartContext";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCountFlag = useSelector((state) => state.cart.cartCountFlag);

  const { refreshCart } = useCart();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // 👈 Redirect to login if no token found
    }
  }, [token, navigate]);

  const featuredCandles = [
    { id: 1, name: "Lavender Bliss", price: "$25", image: "/images/i1.jpg" },
    { id: 2, name: "Vanilla Harmony", price: "$30", image: "/images/i2.jpg" },
    { id: 3, name: "Rose Elegance", price: "$28", image: "/images/i3.jpg" },
    { id: 4, name: "Citrus Glow", price: "$26", image: "/images/i4.jpg" },
  ];

  const handleAddToCart = async (candle) => {
    const value = JSON.stringify({
      quantity: 1,
      price: candle.price.replace("$", ""),
      image: candle.image,
    });

    const payload = {
      product: "cart_data",
      tags: candle.name,
      value: value,
    };

    try {
      const response = await fetch("https://sangsdemos.in/api/cart/query/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      dispatch(setCartCountFlag(!cartCountFlag));

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      console.log("✅ Added to cart:", data.message);
      refreshCart();
    } catch (error) {
      console.error("❌ Error adding to cart:", error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: "400px",
          backgroundImage: "url('https://via.placeholder.com/1200x400')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <Box sx={{ position: "relative", color: "white", zIndex: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            Welcome to Candle Shop ❤️
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Discover our luxurious collection of hand-poured scented candles.
          </Typography>
          <Button variant="contained" color="secondary" sx={{ mt: 3 }}>
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Welcome Section */}
      <Container sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Welcome to Exotic Candles
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: "800px", mx: "auto" }}>
          Our handcrafted scented candles bring warmth, relaxation, and luxury to your space. Made with natural ingredients and exotic fragrances, our collection is designed to enhance your mood and create a calming ambiance.
        </Typography>
      </Container>

      {/* Categories */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" fontWeight="bold">Shop by Category</Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            mt: 3,
            maxWidth: "90%",
            mx: "auto",
          }}
        >
          <Button variant="outlined">Aromatherapy</Button>
          <Button variant="outlined">Luxury Candles</Button>
          <Button variant="outlined">Organic Scents</Button>
          <Button variant="outlined">Soy Candles</Button>
        </Box>
      </Box>

      {/* Featured Candles */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" fontWeight="bold">Featured Candles</Typography>
        <Grid container spacing={3} sx={{ mt: 3, justifyContent: "center" }}>
          {featuredCandles.map((candle) => (
            <Grid item key={candle.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  width: 250,
                  height: 380,
                  mx: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={candle.image}
                    alt={candle.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {candle.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {candle.price}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                      mt: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" size="medium" fullWidth>
                      Buy Now
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() => handleAddToCart(candle)}
                    >
                      <AddShoppingCartIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
