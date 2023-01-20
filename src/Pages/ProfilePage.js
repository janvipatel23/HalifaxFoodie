import { Box, Grid, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "./Loader";
import { UserContext } from "../App";

/**
 * Author: Janvi Patel
 * Component for Profile page. It allows update profile information.
 */
function ProfileComp() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [saveProfile, startSaveProfile] = useState(false);
  const [userData, setUserData] = useState({});

  console.log("User :", user);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name + " : " + value);
    startSaveProfile(true);

    const userProfile = {
      TableName: "user-profile",
      Item: {
        email: {
          S: user?.attributes.email,
        },
        firstName: {
          S: userData.firstName,
        },
        lastName: {
          S: userData.lastName,
        },
        userType: {
          S: user?.attributes["custom:userType"],
        },
      },
    };

    if (user?.attributes["custom:userType"] == "restaurant") {
      userProfile.Item.restaurantName = {
        S: userData.restaurantName,
      };

      userProfile.Item.address = {
        S: userData.address,
      };
    }
    axios
      .post(
        "https://576mnvmj83.execute-api.us-east-1.amazonaws.com/default/dynamoDbOp",
        userProfile
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => startSaveProfile(false));
  };

  useEffect(() => {
    axios
      .get(
        `https://576mnvmj83.execute-api.us-east-1.amazonaws.com/default/dynamoDbOp`,
        {
          params: {
            TableName: "user-profile",
            email: user?.attributes.email,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data?.Item) {
          userData.firstName = res.data?.Item?.firstName?.S;
          userData.lastName = res.data?.Item?.lastName?.S;

          console.log("Restaurant Name : ", res.data.Item.restaurantName?.S);
          if (res.data.Item.userType?.S == "restaurant") {
            userData.restaurantName = res.data.Item.restaurantName?.S;
            userData.address = res.data.Item.address?.S;
          }
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <Box
      sx={{
        color: "text.secondary",
      }}
    >
      <Grid container direction="column" alignItems="center">
        <Grid sx={{ p: 2 }}>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: ".3rem",
              textDecoration: "none",
              fontSize: 35,
              color: "black",
              textAlign: "center",
              borderBottom: 1,
            }}
          >
            Profile Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              sx={{ marginBottom: 2, marginTop: 5 }}
              fullWidth
              id="userType"
              name="userType"
              label="User Type"
              disabled={true}
              value={user?.attributes["custom:userType"]}
            />
            <TextField
              sx={{ marginBottom: 2 }}
              fullWidth
              id="email"
              name="email"
              label="Email"
              disabled={true}
              value={user?.attributes.email}
            />
            <TextField
              sx={{ marginBottom: 2 }}
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              value={userData.firstName}
              onChange={handleChange}
            />
            <TextField
              sx={{ marginBottom: 2 }}
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              value={userData.lastName}
              onChange={handleChange}
            />
            {user?.attributes["custom:userType"] == "restaurant" && (
              <>
                <TextField
                  sx={{ marginBottom: 2 }}
                  fullWidth
                  id="restaurantName"
                  name="restaurantName"
                  label="Restaurant Name"
                  type="text"
                  value={userData.restaurantName}
                  onChange={handleChange}
                />
                <TextField
                  sx={{ marginBottom: 2 }}
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  type="text"
                  value={userData.address}
                  onChange={handleChange}
                />
              </>
            )}

            <LoadingButton
              loading={saveProfile}
              variant="contained"
              type="submit"
              fullWidth
            >
              Update details
            </LoadingButton>
          </form>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <LoaderComp open={true} />
  );
}

export default ProfileComp;
