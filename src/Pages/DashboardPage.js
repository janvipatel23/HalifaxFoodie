import { Grid, Box, Typography } from "@mui/material";
import React from "react";
// import { useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonAppBar from "../Components/NavBar";

function ProfilePage() {
  /**
 * Author: Sangramsinh More
 * Page for Dahboard 
 */

  return (
    <Box sx={{ backgroundColor: "white", minHeight: 1000 }}>
      <ButtonAppBar />
      <Grid container direction="row">
        <Grid item xs={3.8} sx={{ borderRadius: 2, border: 1, mt: 2, ml: 2, minHeight: 700 }}>
          <Grid container direction="column">
            <Grid item>
              <AccountCircleIcon
                sx={{ pt: 10, pl: 23, color: "black", fontSize: "100px" }}
                justifyContent="center"
              />
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 900,
                  letterSpacing: ".3rem",
                  color: "black",
                  textDecoration: "none",
                  fontSize: 25,
                  textAlign: "center",
                  pt: 2
                }}
              >
                Welcome! Sangram
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column">
            <Grid item sx={{ border: 1, borderRadius: 2, mt: 2, ml: 2, minHeight: 700 }}>
              <Stack spacing={5} direction="column" alignItems="center" sx={{ pt: 7 }}>
                <Button sx={{ minWidth: 200, minHeight: 90 }} variant="contained" size="large">
                  Recipe Upload
                </Button>
                <Button sx={{ minWidth: 200, minHeight: 90 }} variant="contained" size="large">
                  Order Food
                </Button>
                <Button sx={{ minWidth: 200, minHeight: 90 }} variant="contained" size="large">
                  Visualization
                </Button>
                <Button sx={{ minWidth: 200, minHeight: 90 }} variant="contained" size="large">
                  Chat
                </Button>
                <Button sx={{ minWidth: 200, minHeight: 90 }} variant="contained" size="large">
                  Logout
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
