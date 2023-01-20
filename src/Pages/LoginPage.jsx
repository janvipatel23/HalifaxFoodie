import React, { useContext, useState } from "react";
import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "./Loader";
import Navbar from "../Components/NavBar";
import { UserContext } from "../App";

/**
 * Author: Janvi Patel
 * Component for 1st factor login using email and password.
 * It uses AWS Cognito service for 1st Factor Auhtentication.
 */
function LoginComp() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useContext(UserContext);

  const handleClose = () => {
    setOpen(false);
  };

  const [myEmail, setEmail] = useState("");
  const [myPassword, setPassword] = useState("");

  const navigate = useNavigate();

  const handleChange1 = (event) => {
    setEmail(event.target.value);
  };

  const handleChange2 = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    Auth.signIn(myEmail, myPassword)
      .then((res) => {
        setUser(res);
        navigate("/multi-factor-auth");
      })
      .catch((err) => setOpen(true))
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        minHeight: 1000,
        color: "text.secondary",
      }}
    >
      <LoaderComp open={loading} />
      <Navbar />
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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              sx={{ marginBottom: 2 }}
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              onChange={handleChange1}
            />
            <TextField
              required
              sx={{ marginBottom: 2 }}
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={handleChange2}
            />
            <Button fullWidth variant="contained" type={"submit"}>
              Sign in
            </Button>

            <Divider sx={{ marginTop: 2, marginBottom: 2 }}>
              <Chip label="OR" />
            </Divider>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/register")}
            >
              Don't have an Account?
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
    </Box>
  );
}

export default LoginComp;
