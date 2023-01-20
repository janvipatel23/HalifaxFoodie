import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "./Loader";

export const SECURITY_QUESTIONS = [
  "What is your birth city?",
  "What is your pet name?",
];

/**
 * Author: Janvi Patel
 * Component to setup 2nd and 3rd factors authentication after successful confirming email address.
 */
function SecondFactorRegistrationComp({ email, userType }) {
  const [showFirstFactor, setShowFirstFactor] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const secretText = useRef();
  const securityKey = useRef();

  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState();
  const answers = SECURITY_QUESTIONS.map((question) => ({
    question: question,
  }));

  const handleChange = (answer, index) => {
    console.log("Answer :", answer);
    answers[index].answer = answer;
  };

  const handleClose = (event) => {
    event.preventDefault();

    if (messageText) {
      navigate("/login");
    }

    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(answers);
    setLoading(true);
    axios
      .post(
        "https://us-central1-csci5410serverlessproject.cloudfunctions.net/registrationFunction",
        {
          emailId: email,
          requestType: "user-registration",
          userType,
          answers,
        }
      )
      .then((res) => setShowFirstFactor(false))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleLastFactor = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(
        "https://us-central1-csci5410serverlessproject.cloudfunctions.net/thirdFactorAuth",
        {
          emailId: email,
          securityKey: securityKey.current.value,
          secretText: secretText.current.value,
          requestType: "user-registration",
        }
      )
      .then((res) => {
        console.log("Encrypted Text : ", res);
        setMessageText(
          `Go back to login and use this key while doing login : ${res.data.encryptedText}`
        );
        setOpen(true);
      })
      .catch((err) => {
        setMessageText("Please try again");
        setOpen(true);
      })
      .finally(() => setLoading(false));
  };

  return (
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
            {showFirstFactor ? "Set 2nd Factor" : "Set 3rd Factor"}
          </Typography>
          {showFirstFactor ? (
            <form onSubmit={handleSubmit}>
              {SECURITY_QUESTIONS.map((question, index) => (
                <TextField
                  required
                  sx={{ marginBottom: 2 }}
                  fullWidth
                  type="text"
                  name={"securityQA_" + index}
                  id={"securityQA_" + index}
                  key={index}
                  placeholder={question}
                  onChange={(event) => handleChange(event.target.value, index)}
                />
              ))}
              <Button fullWidth variant="contained" type="submit">
                Next
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLastFactor}>
              <TextField
                required
                sx={{ marginBottom: 2 }}
                fullWidth
                type="text"
                name="securityKey"
                id="securityKey"
                label="Security Key"
                inputRef={securityKey}
              />
              <TextField
                required
                sx={{ marginBottom: 2 }}
                fullWidth
                type="text"
                name="secretText"
                id="secretText"
                label="Secret Text"
                inputRef={secretText}
              />
              <Button fullWidth variant="contained" type="submit">
                Next
              </Button>
            </form>
          )}
        </Grid>
      </Grid>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle id="simple-dialog-title">{messageText}</DialogTitle>
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
    </>
  );
}

export default SecondFactorRegistrationComp;
