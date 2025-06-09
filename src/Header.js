import React, { useState, useEffect } from "react";
import config from "./config/config";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography
} from "@mui/material";
import {
  Search,
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  Clear
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = ({ onLogout }) => {
  const token = localStorage.getItem("access_token");
  const cartCountFlag = useSelector((state) => state.cart.cartCountFlag);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${config.API_URL}cart/query/?hashmap=cart_data`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.ok && result.data) {
          setCartCount(Object.keys(result.data).length);
        } else {
          console.error("Failed to fetch cart data:", result.message || result.error);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [cartCountFlag]);

  const handleOnClickCart = () => {
    navigate("/cart");
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      console.log("Searching for:", searchText);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => clearSearch();
    const handleScroll = () => {
      clearSearch();
      if (isMenuOpen) handleUserMenuClose();
      if (drawerOpen) setDrawerOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen, drawerOpen]);

  const handleOnClickHead = (item) => {
    const routeMap = {
      Home: "/home",
      About: "/about",
      Services: "/services",
      Contact: "/contact",
      Products: "/products",
    };
    navigate(routeMap[item] || "/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#4a148c" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: "block", md: "none" }, mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style={{ fill: "white" }}>
            <path d="M17 14a5 5 0 0 0 2.71-.81L20 13a3.16 3.16 0 0 0 .45-.37l.21-.2a4.48 4.48 0 0 0 .48-.58l.06-.08a4.28 4.28 0 0 0 .41-.76 1.57 1.57 0 0 0 .09-.23 4.21 4.21 0 0 0 .2-.63l.06-.25A5.5 5.5 0 0 0 22 9V2l-3 3h-4l-3-3v7a5 5 0 0 0 5 5zm2-7a1 1 0 1 1-1 1 1 1 0 0 1 1-1zm-4 0a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"></path>
            <path d="M11 22v-5H8v5H5V11.9a3.49 3.49 0 0 1-2.48-1.64A3.59 3.59 0 0 1 2 8.5 3.65 3.65 0 0 1 6 5a1.89 1.89 0 0 0 2-2 1 1 0 0 1 1-1 1 1 0 0 1 1 1 3.89 3.89 0 0 1-4 4C4.19 7 4 8.16 4 8.51S4.18 10 6 10h5.09A6 6 0 0 0 19 14.65V22h-3v-5h-2v5z"></path>
          </svg>
        </Box>

        {/* Desktop Nav */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            justifyContent: "flex-start",
            gap: 6,
            ml: -50,
          }}
        >
          {["Home", "About", "Services", "Contact", "Products"].map((item, index) => (
            <Typography
              key={item}
              variant="body1"
              onClick={() => handleOnClickHead(item)}
              sx={{
                color: "white",
                cursor: "pointer",
                position: "relative",
                fontWeight: 500,
                "&:hover": {
                  color: "#ffcc80",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#ffcc80",
                  },
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* Right Panel: Search, Cart, Account */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr: 4 }}>
          {/* Search Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              borderRadius: "4px",
              padding: "4px 8px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              position: "relative",
              width: "250px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Search sx={{ color: "#1976d2" }} />
            <InputBase
              placeholder="Search…"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              sx={{ flex: 1, color: "white" }}
            />
            {searchText && (
              <>
                <IconButton
                  size="small"
                  onClick={handleSearchSubmit}
                  sx={{ color: "#1976d2", padding: "4px" }}
                >
                  <Search fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  sx={{ color: "white", padding: "4px" }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>

          {/* Cart */}
          <IconButton color="inherit" onClick={handleOnClickCart}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Account */}
          <IconButton color="inherit" onClick={handleUserMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleUserMenuClose}
            disableScrollLock
            sx={{
              "& .MuiPaper-root": {
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
              },
            }}
          >
            {["Profile", "Orders", "Wishlist", "Cart", "Settings", "Help & Support"].map((item) => (
              <MenuItem key={item} divider onClick={handleUserMenuClose}>
                {item}
              </MenuItem>
            ))}
            <MenuItem
              divider
              onClick={() => {
                handleUserMenuClose();
                if (onLogout) onLogout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 280,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(15px)",
            height: "100vh",
            paddingTop: 2,
          }}
        >
          <IconButton sx={{ ml: "auto", display: "block", color: "white" }} onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
          <List>
            {["Home", "About", "Services", "Contact", "Products"].map((text, index) => (
              <React.Fragment key={text}>
                <ListItem
                  button
                  onClick={() => {
                    handleOnClickHead(text);
                    toggleDrawer(false)();
                  }}
                  sx={{ px: 3 }}
                >
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      sx: { fontSize: "1.1rem", fontWeight: 500, color: "#fff" },
                    }}
                  />
                </ListItem>
                {index < 4 && <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }} />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
