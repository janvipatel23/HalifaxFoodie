import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Auth } from "aws-amplify";
import SecondFactorRegistrationComp from "./SecondFactorRegistration";
import { LoaderComp } from "./Loader";

/**
 * Author: Janvi Patel
 * Component for Confirming Email after successful registration of User in AWS Cognito.
 */
function ConfirmEmailComp({ email, userType }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [code, setCode] = useState("");

  const handleChange1 = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    Auth.confirmSignUp(email, code)
      .then((res) => {
        setOpen(true);
      })
      .finally(() => setLoading(false));
  };

  return open ? (
    <SecondFactorRegistrationComp email={email} userType={userType} />
  ) : (
    <>
      <LoaderComp open={loading} />
      <Grid container direction="column" alignItems="center" sx={{ pt: 15 }}>
        <Grid width="500px" sx={{ border: 1, borderColor: "black", p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            noWrap
            textAlign="center"
            sx={{
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: ".3rem",
              textDecoration: "none",
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Verify Email id
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              sx={{ marginBottom: 2 }}
              fullWidth
              id="code"
              name="code"
              label="Code"
              onChange={handleChange1}
            />
            <Button fullWidth variant="contained" type={"submit"}>
              Verify Code
            </Button>
          </form>
        </Grid>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle id="simple-dialog-title">
            Invalid Credentials: Please try again
          </DialogTitle>
          <List>
            <ListItem
              style={{ display: "flex", justifyContent: "flex-end" }}
              button
              onClick={handleClose}
            >
              close
            </ListItem>
          </List>
        </Dialog>
      </Grid>
    </>
  );
}

export default ConfirmEmailComp;
