import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";

import { facilities } from "../../../data/data";

const BoxesScreen = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        boxShadow={1}
      >
        <IconButton>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Box Cricket</Typography>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
      </Box>

      {/* Filters */}
      {/* <Box display="flex" justifyContent="center" gap={2} p={2}>
        <Button variant="outlined">Open Now</Button>
        <Button variant="outlined">Nearby</Button>
      </Box> */}

      {/* Scrollable Facility List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto", // Enables vertical scrolling
          padding: 2,
          marginBottom: 1
        }}
      >
        <Grid container spacing={2}>
          {facilities.map((facility) => (
            <Grid item xs={12} key={facility.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: 300,
                  position: "relative",
                }}
              >
                {/* Upper 60%: Facility Image with Overlay Button */}
                <Box position="relative" sx={{ height: "60%" }}>
                  <CardMedia
                    component="img"
                    image={facility.image}
                    alt={facility.name}
                    sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                  />
                  {/* Book Now Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      fontSize: "0.8rem",
                      textTransform: "none",
                      padding: "4px 12px",
                      cursor: 'pointer'
                    }}
                    onClick={() => alert(`Booking ${facility.name}`)}
                  >
                    Book Now
                  </Button>
                </Box>

                {/* Lower 40%: Facility Details */}
                <CardContent
                  sx={{
                    height: "40%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{facility.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {facility.address}
                    </Typography>
                  </Box>

                  {/* Call and Location Section */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    {/* Left Aligned Call Icon and Phone Number */}
                    <Box display="flex" alignItems="center">
                      <CallIcon fontSize="small" color="primary" />
                      <Typography variant="body2" ml={0.5}>
                        {facility.phone}
                      </Typography>
                    </Box>

                    {/* Right Aligned Location Icon */}
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon fontSize="small" color="primary" />
                      <Typography variant="body2" ml={0.5}>
                        {facility.location}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bottom Navigation */}
      <Box
        display="flex"
        justifyContent="space-around"
        boxShadow={1}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bgcolor="white"
      >
        <IconButton>
          <MenuIcon />
        </IconButton>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <LocationOnIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BoxesScreen;
