import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { SECURITY_QUESTIONS } from "./SecondFactorRegistration";
import axios from "axios";
import { LoaderComp } from "./Loader";
import Navbar from "../Components/NavBar";
import { UserContext } from "../App";
import { messaging } from "../firebase";

/**
 * Author: Janvi Patel
 * Component to validate user using 2nd and 3rd facotr then only it allows user to use this system.
 */
function FactorAuthenticationComp() {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [lastFactor, showLastFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const answer = useRef();
  const secretText = useRef();

  const handleClose = () => {
    navigate("/login");
  };

  const { user, setIsAuthenticated } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      console.log("user : ", user);
      navigate("/login");
    }
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    setQuestion(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const query = {
      requestType: "user-verification",
      question: selectedQuestion,
      answer: answer.current.value,
      emailId: user?.getUsername(),
    };
    axios
      .post(
        "https://us-central1-csci5410serverlessproject.cloudfunctions.net/registrationFunction",
        query
      )
      .then(() => showLastFactor(true))
      .catch(() => setOpen(true))
      .finally(() => setLoading(false));
  };

  const handleLastFactor = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = await messaging.getToken();
      console.log("Token :", token);
      const query = {
        requestType: "user-verification",
        secretText: secretText.current.value,
        emailId: user?.getUsername(),
        token: token ? token : "",
      };
      axios
        .post(
          "https://us-central1-csci5410serverlessproject.cloudfunctions.net/thirdFactorAuth",
          query
        )
        .then(() => {
          setIsAuthenticated(true);
          if (user?.attributes["custom:userType"]=="restaurant"){
            navigate("/userdashboard")
          }
          if (user?.attributes["custom:userType"]=="customer"){
            navigate("/customerdashboard")
          }
        })
        .catch(() => setOpen(true))
        .finally(() => setLoading(false));
    } catch (err) {
      console.log("Error : ", err);
    }
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
            Verification
          </Typography>
          {lastFactor ? (
            <form onSubmit={handleLastFactor}>
              <TextField
                required
                sx={{ marginBottom: 2 }}
                fullWidth
                id="secretText"
                name="text"
                label="Enter secret text"
                type="text"
                inputRef={secretText}
              />
              <Button fullWidth variant="contained" type="submit">
                Verify
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <InputLabel id="security-questions-label">
                Select security question
              </InputLabel>
              <Select
                required
                sx={{ marginBottom: 2 }}
                fullWidth
                type="text"
                name="security_question"
                onChange={handleChange}
                defaultValue={SECURITY_QUESTIONS[0]}
              >
                {SECURITY_QUESTIONS.map((question, index) => (
                  <MenuItem key={index} value={question}>
                    {question}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                required
                sx={{ marginBottom: 2 }}
                fullWidth
                id="answer"
                name="text"
                label="Answer"
                type="text"
                inputRef={answer}
              />
              <Button fullWidth variant="contained" type={"submit"}>
                Verify
              </Button>
            </form>
          )}
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

export default FactorAuthenticationComp;
