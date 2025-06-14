import React from "react";
import {
  Box,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";


const ProfileInfoTab = ({
  profile,
  editMode,
  onInputChange,
  onToggleEdit,
  onSave
}) => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Personal Information</Typography>
        {editMode ? (
          <Box>
            <IconButton onClick={onToggleEdit} color="error">
              <Cancel />
            </IconButton>
            <IconButton onClick={onSave} color="success">
              <Save />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={onToggleEdit}>
            <Edit />
          </IconButton>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            name="first_name"
            value={profile.first_name}
            onChange={onInputChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            name="last_name"
            value={profile.last_name}
            onChange={onInputChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={onInputChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={onInputChange}
            fullWidth
            disabled={!editMode}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileInfoTab;
