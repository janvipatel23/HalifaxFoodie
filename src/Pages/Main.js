import React, { useContext } from "react";
import Navbar from "../Components/NavBar";
import { Box } from "@mui/system";
import Chatbot from "../Components/Chatbot/chatbot";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import awsKeys from "../Keys/awsCred";
import { UserContext } from "../App";
import * as AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";
import db from "../firebase";

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});

const docClient = new AWS.DynamoDB.DocumentClient();

function MainPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log("User :", user);

  var params = {
    TableName: "chatRoom",
  };

  return (
    /**
     * Author: Sangramsinh More
     * Main Page of Application
     */
    <Box sx={{ backgroundColor: "#121212", minHeight: 1000 }}>
      <Navbar />
      <Stack
        direction="row"
        spacing={4}
        sx={{ pt: 5, justifyContent: "center" }}
      >
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="240"
              image="https://thumbs.dreamstime.com/b/people-eating-healthy-meals-wooden-table-top-view-food-delivery-people-eating-healthy-meals-wooden-table-food-delivery-160387494.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Order Food
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get contactless delivery for restaurant takeout, and more! Order
                food online or in the Halifax-Foodie app and support local
                restaurants.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="240"
              image="https://cdn.pixabay.com/photo/2020/05/25/08/40/food-delivery-5217579_960_720.png"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Fastest Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get the food you want delivered, fast. Order food delivery &
                take out from the best restaurants near you. Halifax-Foodie has
                100+ restaurants in Halifax Metropolitian Area. Order Now.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="240"
              image="https://c0.wallpaperflare.com/preview/723/104/38/restaurant-reservation-food-customer.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Order Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get seamless food delivery support through our AI Powered
                Application for your food orders.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>

      <Stack
        direction="row"
        spacing={4}
        sx={{ pt: 5, justifyContent: "center" }}
      >
        <Card sx={{ minWidth: 345 }}>
          <CardActionArea>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                textAlign="center"
                component="div"
              >
                Join Us Now For:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get it delivered right to your door. Or, try Pickup on your way
                home. It's mealtime on your time.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get contactless delivery for restaurant takeout, and more! Order
                food online or in the Halifax-Foodie app and support local
                restaurants.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get seamless food delivery support through our AI Powered
                Application for your food orders.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Box>
  );
}

export default MainPage;
