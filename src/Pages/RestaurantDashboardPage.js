import { Grid, Typography } from "@mui/material";

{
  /* <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/08b79574-1587-4ce3-9637-be1a82d44524/page/UOJ8C" frameborder="0" style="border:0" allowfullscreen></iframe> */
}

/**
 * Author: Janvi Patel
 * Component to render Google Data-Studio (Looker) report in iframe.
 */
export function RestaurantDashboardComp() {
  return (
    <>
      <Grid container direction="column" alignItems="center">
        <Grid sx={{ border: 1, borderColor: "black", mt: 10, p: 2 }}>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
              fontSize: 35,
              textAlign: "center",
              borderBottom: 1,
            }}
          >
            Analytics dashboard
          </Typography>
          <iframe
            width={1600}
            height={500}
            src="https://datastudio.google.com/embed/reporting/08b79574-1587-4ce3-9637-be1a82d44524/page/UOJ8C"
            allowFullScreen
          ></iframe>
        </Grid>
      </Grid>
    </>
  );
}
