import React from "react";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as AWS from "aws-sdk";
import awsKeys from "../Keys/awsCred";
import ButtonAppBar from "../Components/NavBar";
import { Box } from "@mui/system";
import { UserContext } from "../App";

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});

const docClient = new AWS.DynamoDB.DocumentClient();

function OrderFoodComp() {
  const { user } = useContext(UserContext);

  console.log("User :", user);
  console.log("User :", user?.attributes.email);

  const [restaurantList, setRestaurantList] = useState([]);

  useEffect(() => {
    var params = {
      TableName: "user-profile",
    };

    docClient.scan(params, function (err, data) {
      if (!err) {
        console.log(data.Items);
        let p = data.Items.filter((x) => x.userType == "restaurant");
        console.log("sss", p);
        setRestaurantList(p);
      }
    });
  }, []);

  const [open, setOpen] = useState(false);

  const [foodItem, setFoodItem] = React.useState("");

  const handleChangeFood = (event) => {
    setFoodItem(event.target.value);
  };

  const [restaurant, setRestaurant] = React.useState([]);

  const handleChangeRest = (event) => {
    console.log("event", event);
    let k = {
      restId: event.target.value.email,
      restName: event.target.value.restaurantName,
    };
    setRestaurant(k);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("rests", restaurantList);

    let y = Math.floor(Math.random() * 100000) + 1;

    docClient
      .put({
        Item: {
          order_id: y.toString(),
          order_item: foodItem,
          rest_id: restaurant.restId,
          rest_Name: restaurant.restName,
          user_id: user?.attributes.email,
          status: "preparing",
        },
        TableName: "orderTable2",
      })
      .promise()
      .then((data) => console.log(data.Attributes))
      .catch(console.error);

    setOpen(true);
  };
  return (
    /**
     * Author: Sangramsinh More
     * Page for Ordering Food
     */
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
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Order Food
          </Typography>
          <form onSubmit={handleSubmit}>
            <InputLabel id="demo-simple-select-label">
              Please Select your restaurant
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              fullWidth
              value={restaurant.restName}
              label="restaurant"
              onChange={handleChangeRest}
            >
              {restaurantList.map((p) => (
                <MenuItem key={p} value={p}>
                  {p.restaurantName}
                </MenuItem>
              ))}
            </Select>

            <InputLabel id="demo-simple-select-label">
              Please Select your food item
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              fullWidth
              value={foodItem}
              label="foodItem"
              onChange={handleChangeFood}
            >
              <MenuItem value="pizza">pizza</MenuItem>
              <MenuItem value="pasta">pasta</MenuItem>
              <MenuItem value="lasagna">lasagna</MenuItem>
            </Select>

            <Button
              fullWidth
              variant="contained"
              type={"submit"}
              sx={{ mt: 1 }}
            >
              Place Order
            </Button>
          </form>
        </Grid>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle id="simple-dialog-title">Food Order Placed</DialogTitle>
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

export default OrderFoodComp;
