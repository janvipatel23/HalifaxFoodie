import { Grid, Box, Typography } from "@mui/material";
import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonAppBar from "../Components/NavBar";
import ProfileComp from "./ProfilePage";

function CustomerDashboardPage() {
  /**
 * Author: Sangramsinh More
 * Page for Customer Dahboard 
 */

  return (
    <Box sx={{ backgroundColor: "white", minHeight: 1000 }}>
      <ButtonAppBar />
      <Grid container direction="row">
        <Grid item xs={3.8} sx={{ borderRadius: 2, border: 1, mt: 2, ml: 2, minHeight: 700 }}>
          <Grid container direction="column">
            <Grid item>
              <ProfileComp />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column">
            <Grid item sx={{ border: 1, borderRadius: 2, mt: 2, ml: 2, minHeight: 700 }}>
              <Stack spacing={5} direction="column" alignItems="center" sx={{ pt: 7 }}>
                <Button sx={{ minWidth: 200, minHeight: 100 }} href="/orderFood" variant="contained" size="large">
                  Order Food
                </Button>
                <Button sx={{ minWidth: 200, minHeight: 100 }} href="/foodorders" variant="contained" size="large">
                  Previous Orders
                </Button>
                <Button sx={{ minWidth: 200, minHeight: 100 }} href="/" variant="contained" size="large">
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

export default CustomerDashboardPage;
