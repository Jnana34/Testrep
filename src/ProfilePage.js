import React, { useState, useEffect } from "react";
import axios from "./utilities/axiosConfig";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme as useMUITheme,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Add,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import ProfileInfoTab from "./components/profile-tabs/ProfileInfoTab";
import SavedAddressesTab from "./components/profile-tabs/SavedAddressesTab";
import SecurityTab from "./components/profile-tabs/SecurityTab";

const SIDEBAR_WIDTH = 200;
const HEADER_HEIGHT = 5;
const userId = localStorage.getItem("user_id");


let theme = createTheme();
theme = responsiveFontSizes(theme, { factor: 2500 });



const ProfilePage = () => {
  const muiTheme = useMUITheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (event, newValue) => setTab(newValue);
  const handleEditToggle = () => setEditMode(!editMode);
  const handleInputChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`user/profile/`);

        const data = res.data;

        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);




  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`saveprofile/`, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
      });

      console.log("Profile updated successfully:", response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5", pt: `${HEADER_HEIGHT}px` }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: `${SIDEBAR_WIDTH}px`,
            bgcolor: "#6a1b9a",
            color: "#fff",
            p: 3,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Avatar sx={{ width: 80, height: 80, mb: 2, mx: "auto", bgcolor: "#ab47bc" }}>
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h6" align="center">
            {profile.first_name + ' ' + profile.last_name}
          </Typography>
          <Divider sx={{ my: 2, backgroundColor: "#ce93d8" }} />
          <List>
            <ListItem button selected={tab === 0} onClick={() => setTab(0)}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Profile Info" />
            </ListItem>
            <ListItem button selected={tab === 1} onClick={() => setTab(1)}>
              <LockIcon sx={{ mr: 1 }} />
              <ListItemText primary="Security" />
            </ListItem>
            <ListItem button selected={tab === 2} onClick={() => setTab(2)}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <ListItemText primary="Addresses" />
            </ListItem>
            <ListItem button selected={tab === 3} onClick={() => setTab(3)}>
              <ShoppingBagIcon sx={{ mr: 1 }} />
              <ListItemText primary="Orders" />
            </ListItem>
          </List>
        </Box>

        {/* Right Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 1, sm: 0.5 },
            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          }}
        >
          {/* Tabs for desktop */}
          {!isMobile && (
            <Tabs
              value={tab}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              variant="fullWidth"
              sx={{ bgcolor: "#fff", mb: 2 }}
            >
              <Tab label="Profile Info" />
              <Tab label="Security" />
              <Tab label="Addresses" />
              <Tab label="Orders" />
            </Tabs>
          )}

          <Paper sx={{ p: 3, flex: 1, height: '90%', minHeight: '80%' }}>
            {tab === 0 && (
              <ProfileInfoTab
                profile={profile}
                editMode={editMode}
                onInputChange={handleInputChange}
                onToggleEdit={handleEditToggle}
                onSave={handleSaveProfile}
              />
            )}

            {tab === 1 && <SecurityTab />}

            {tab === 2 && (
              <SavedAddressesTab profile={profile} />
            )}

            {tab === 3 && (
              <Box>
                <Typography variant="h6" mb={2}>
                  Order History
                </Typography>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight="bold">Order #12345</Typography>
                  <Typography>Status: Delivered</Typography>
                  <Typography>Total: ₹1,499.00</Typography>
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography fontWeight="bold">Order #12346</Typography>
                  <Typography>Status: In Transit</Typography>
                  <Typography>Total: ₹899.00</Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProfilePage;
