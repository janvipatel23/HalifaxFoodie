import { Grid, Box, Typography } from "@mui/material";
import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonAppBar from "../Components/NavBar";
import ProfileComp from "./ProfilePage";

function UserDashboardPage() {
  return (
    /**
     * Author: Sangramsinh More
     * Page for User Dahboard
     */
    <Box sx={{ backgroundColor: "white", minHeight: 1000 }}>
      <ButtonAppBar />
      <Grid container direction="row">
        <Grid
          item
          xs={3.8}
          sx={{ borderRadius: 2, border: 1, mt: 2, ml: 2, minHeight: 700 }}
        >
          <Grid container direction="column">
            <Grid item>
              <ProfileComp />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid container direction="column">
            <Grid
              item
              sx={{ border: 1, borderRadius: 2, mt: 2, ml: 2, minHeight: 700 }}
            >
              <Stack
                spacing={5}
                direction="column"
                alignItems="center"
                sx={{ pt: 7 }}
              >
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/recipeupload"
                  variant="contained"
                  size="large"
                >
                  Recipe Upload
                </Button>
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/fetch"
                  variant="contained"
                  size="large"
                >
                  Check Ingredients
                </Button>
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/visualize_recipe"
                  variant="contained"
                  size="large"
                >
                  Visualization
                </Button>
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/chat/b1478de3-c520-4ada-8d20-3f44d2dca0e2"
                  variant="contained"
                  size="large"
                >
                  Chat
                </Button>
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/polarity"
                  variant="contained"
                  size="large"
                >
                  Polarity
                </Button>
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/similarity"
                  variant="contained"
                  size="large"
                >
                  Similarity
                </Button>
                <Button
                  sx={{ minWidth: 200, minHeight: 40 }}
                  href="/reviews"
                  variant="contained"
                  size="large"
                >
                  Check Reviews
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserDashboardPage;
