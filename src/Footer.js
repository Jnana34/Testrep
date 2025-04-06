import React from "react";
import { Box, Typography, IconButton, Link, Stack } from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LocationOn,
  Phone,
  Email
} from "@mui/icons-material";

const Footer = () => {
  return (
    <>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#4a148c",
          color: "white",
          p: { xs: 3, md: 4 },
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        {/* Logo & Socials */}
        <Box sx={{ maxWidth: 250 }}>
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="M17 14a5 5 0 0 0 2.71-.81L20 13a3.16 3.16 0 0 0 .45-.37l.21-.2a4.48 4.48 0 0 0 .48-.58l.06-.08a4.28 4.28 0 0 0 .41-.76 1.57 1.57 0 0 0 .09-.23 4.21 4.21 0 0 0 .2-.63l.06-.25A5.5 5.5 0 0 0 22 9V2l-3 3h-4l-3-3v7a5 5 0 0 0 5 5zm2-7a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm-4 0a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              <path d="M11 22v-5H8v5H5V11.9a3.49 3.49 0 0 1-2.48-1.64A3.59 3.59 0 0 1 2 8.5 3.65 3.65 0 0 1 6 5a1.89 1.89 0 0 0 2-2 1 1 0 0 1 1-1 1 1 0 0 1 1 1 3.89 3.89 0 0 1-4 4C4.19 7 4 8.16 4 8.51S4.18 10 6 10h5.09A6 6 0 0 0 19 14.65V22h-3v-5h-2v5z" />
            </svg>
            Exotic Candles
          </Typography>
          <Typography variant="body2">
            Hey there! Thanks for visiting us. We craft candles that light up your moments.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <IconButton color="inherit" aria-label="Facebook"><Facebook /></IconButton>
            <IconButton color="inherit" aria-label="Twitter"><Twitter /></IconButton>
            <IconButton color="inherit" aria-label="Instagram"><Instagram /></IconButton>
            <IconButton color="inherit" aria-label="YouTube"><YouTube /></IconButton>
          </Box>
        </Box>

        {/* Support Links */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Support</Typography>
          <Link href="#" color="inherit" underline="hover">Products</Link>
          <Link href="#" color="inherit" underline="hover">Help</Link>
          <Link href="#" color="inherit" underline="hover">Return Policy</Link>
          <Link href="#" color="inherit" underline="hover">Terms of Use</Link>
        </Box>

        {/* Guide Links */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>View Guides</Typography>
          <Link href="#" color="inherit" underline="hover">Payments</Link>
          <Link href="#" color="inherit" underline="hover">Our Blogs</Link>
          <Link href="#" color="inherit" underline="hover">Our Partners</Link>
          <Link href="#" color="inherit" underline="hover">Shop now</Link>
        </Box>

        {/* Contact Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 250 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Contact Us</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn fontSize="small" />
            <Typography variant="body2">Bangalore, India 782132</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Phone fontSize="small" />
            <Typography variant="body2">+91 1234567890</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Email fontSize="small" />
            <Typography variant="body2">candles@shop.com</Typography>
          </Stack>
        </Box>
      </Box>

      {/* Copyright */}
      <Box sx={{ textAlign: "center", py: 2, bgcolor: "#3a0d6a", color: "white" }}>
        <Typography variant="body2">
          © 2025 Exotic Candles. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
