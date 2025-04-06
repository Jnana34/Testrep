import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";

const candleData = [
  { id: 1, name: "Lavender Bliss", price: "$25", image: "/images/i1.jpg" },
  { id: 2, name: "Vanilla Harmony", price: "$30", image: "/images/i2.jpg" },
  { id: 3, name: "Rose Elegance", price: "$28", image: "/images/i3.jpg" },
  { id: 4, name: "Citrus Glow", price: "$26", image: "/images/i4.jpg" },
  { id: 5, name: "Jasmine Whisper", price: "$27", image: "/images/i5.jpg" },
  { id: 6, name: "Midnight Oud", price: "$32", image: "/images/i6.jpg" }
];

const ProductPage = () => {
  const token = localStorage.getItem("access_token");
  const dispatch= useDispatch();
  const cartCountFlag= useSelector((state)=>state.cart.cartCountFlag);
  const handleAddToCart = async (candle) => {
      // Create a Redis value as a JSON string
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
        const response = await fetch("http://localhost:9001/cart/query/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        dispatch(setCartCountFlag(!cartCountFlag))
  
        if (!response.ok) {
          throw new Error("Failed to add to cart");
        }
  
        const data = await response.json();
        console.log("✅ Added to cart:", data.message);
  
      } catch (error) {
        console.error("❌ Error adding to cart:", error.message);
      }
    };

  return (
    <Box sx={{ p: 4, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 4, textAlign: "center" }}>
        Explore Our Candle Collection
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {candleData.map((candle) => (
          <Grid item key={candle.id} xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: 250,
                height: 380,
                mx: "auto",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Image Box */}
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden"
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
                  p: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
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
                    alignItems: "center"
                  }}
                >
                  <Button variant="contained" size="medium" fullWidth>
                    Buy Now
                  </Button>
                  <IconButton color="primary" onClick={() => handleAddToCart(candle)}>
                    <AddShoppingCartIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductPage;
