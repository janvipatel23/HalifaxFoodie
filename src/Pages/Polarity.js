import AWS from "aws-sdk";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import awsKeys from "../Keys/awsCred1";
import React from "react";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useContext } from "react";
import ButtonAppBar from "../Components/NavBar";
import { Box } from "@mui/system";
import { UserContext } from "../App";

/**
 * Author: Meghdoot Ojha
 * feature to visualize customers feedbacks and the sentiments associated with it
 */

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});

function Polarity() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  //triggering lambda and fetch keyphrases
  function getData() {
    axios
      .post(
        "https://xnryhupjmvbxyd3t5nsolr74s40mkmhe.lambda-url.us-east-1.on.aws/"
      )
      .then((response) => {
        let data = [
          //  ["End Offset", "Begin Offset", "Score", "Text"],
          ["Feedback"],
          ...response.data.message.KeyPhrases.map((item) => [
            item.Text,
          ]),
        ]
          .map((e) => e.join(","))
          .join("\n");

        console.log("response:", response, data);
        //send received data to the cloud function to process a CSV in cloud storage
        axios
          .post(
            "https://us-central1-group11-369414.cloudfunctions.net/FeedbackFunctionML",
            { data: data }
          )
          .then((response1) => {
            console.log("data is: ", response.data.message.KeyPhrases);
            //visualize data in looker studio
            //   https://developer.mozilla.org/en-US/docs/Web/API/Window/open
            window.open(
              "https://datastudio.google.com/embed/reporting/3dfdb80a-530b-4340-8b94-825ae69ffacb/page/B768C"
            );
          });
      });
  }

  return (
    <Box
      sx={{
        minHeight: 1000,
        color: "text.secondary",
      }}
    >
      <ButtonAppBar />
      <Grid container direction="column" alignItems="center" sx={{ pt: 3 }}>
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
          Hi {user?.attributes.email},
        </Typography>
      </Grid>
      <Grid container direction="column" alignItems="center" sx={{ pt: 2 }}>
        <Grid width="500px" sx={{ border: 1, p: 3 }}>
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
              fontSize: 25,
              textAlign: "center",
            }}
          >
            Feedback Polarity
          </Typography>
          <form>
            <Button
              fullWidth
              variant="contained"
              onClick={getData}
              sx={{ mt: 1 }}
            >
              Click to see the customer's feedback and polarity
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Polarity;
