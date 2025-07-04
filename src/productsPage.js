import React, { useEffect, useState } from "react";
import axios from "./utilities/axiosConfig";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { setCartCountFlag } from "./redux/cartSlice";

const ProductPage = () => {
  const formatRupees = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const dispatch = useDispatch();
  const cartCountFlag = useSelector((state) => state.cart.cartCountFlag);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`products/`);
        setProducts(response.data); // ✅ Axios auto-parses JSON
      } catch (error) {
        console.error("❌ Error fetching products:", error.response?.data || error.message);
      }
    };

    fetchProducts();
  }, [cartCountFlag]);

  const handleAddToCart = async (candle) => {
    const value = JSON.stringify({
      quantity: 1,
      price: candle.price.replace("₹", "").replace(",", ""),
      image: candle.image,
    });

    const payload = {
      product: "cart_data",
      tags: candle.name,
      value: value,
    };

    try {
      const response = await axios.post(`cart/query/`,payload);
      dispatch(setCartCountFlag(!cartCountFlag));
      console.log("✅ Added to cart:", response.data.message);
    } catch (error) {
      console.error("❌ Error adding to cart:", error.response?.data?.message || error.message);
    }
  };
  return (
    <Box sx={{ p: 4, backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Explore Our Candle Collection
      </Typography>

      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {products.map((candle) => (
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
                  p: 2,
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
                  {formatRupees(candle.price)}
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
  );
};

export default ProductPage;
