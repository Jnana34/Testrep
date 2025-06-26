import React, { useEffect, useState } from "react";
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
import NatureIcon from "@mui/icons-material/Nature";
import { useCart } from "./CartContext";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";
import { useNavigate } from "react-router-dom";
import axios from "./utilities/axiosConfig";

const Home = () => {
  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();
  const cartCountFlag = useSelector((state) => state.cart.cartCountFlag);
  const { refreshCart } = useCart();

  // State for products
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`products/`);

        const data = response.data;

        // Adjust depending on actual API response shape
        setProducts(data.products || data || []);
      } catch (error) {
        console.error("❌ Fetch products failed:", error.response?.data?.detail || error.message);
      }
    };

    fetchProducts();
  }, [token]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`reviews/`);

        // Axios parses JSON for you
        const data = response.data;

        // Assuming data is an array of reviews
        setReviews(data);
      } catch (error) {
        console.error("❌ Error fetching reviews:", error.response?.data?.detail || error.message);
      }
    };

    fetchReviews();
  }, [token]);


  const categories = [
    { label: "Aromatherapy", icon: <NatureIcon /> },
    { label: "Luxury Candles", icon: <NatureIcon /> },
    { label: "Organic Scents", icon: <NatureIcon /> },
    { label: "Soy Candles", icon: <NatureIcon /> },
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
      const response = await axios.post(`cart/query/`, payload);

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
          Our handcrafted scented candles bring warmth, relaxation, and luxury
          to your space. Made with natural ingredients and exotic fragrances,
          our collection is designed to enhance your mood and create a calming
          ambiance.
        </Typography>
      </Container>

      {/* Categories */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Shop by Category
        </Typography>
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
          {categories.map((cat, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={cat.icon}
              sx={{ textTransform: "none", fontWeight: "600" }}
            >
              {cat.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Featured Candles */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Featured Candles
        </Typography>
        <Grid container spacing={3} sx={{ mt: 3, justifyContent: "center" }}>
          {products.length === 0 ? (
            <Typography>Loading products...</Typography>
          ) : (
            products.map((candle) => (
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
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
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
            ))
          )}
        </Grid>
      </Box>
      {/* Customers Section */}
      <Box id="customers" sx={{ py: 6, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 4 }}>
          Our Customers
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {reviews.length === 0 ? (
            <Typography>Loading reviews...</Typography>
          ) : (
            reviews.map((cust, i) => (
              <Grid item key={i} xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f0f0ff",
                    },
                  }}
                >
                  <img
                    src={cust.image}
                    alt={cust.name}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: 12,
                    }}
                  />
                  <Typography variant="h6">{cust.name}</Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {cust.review}
                  </Typography>
                  <Box sx={{ color: "gold" }}>
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const isHalf = cust.stars === idx + 0.5;
                      return idx < Math.floor(cust.stars) ? (
                        <i key={idx} className="bx bxs-star"></i>
                      ) : isHalf ? (
                        <i key={idx} className="bx bxs-star-half"></i>
                      ) : (
                        <i key={idx} className="bx bx-star"></i>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            ))
          )}

        </Grid>
      </Box>

      {/* Newsletter Section */}
      <Box
        sx={{
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Subscribe for Special <br /> Discount
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            // Optionally add submission logic here
            alert("Subscribed!");
          }}
          sx={{
            display: "flex",
            gap: 2,
            backgroundColor: "#fff",
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <input
            type="email"
            placeholder="Enter your email..."
            required
            style={{
              border: "none",
              outline: "none",
              padding: "10px",
              width: "200px",
              fontSize: "1rem",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "uppercase",
              fontWeight: 600,
              backgroundColor: "#673ab7", // Purple theme
            }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>



    </Box>
  );
};

export default Home;
