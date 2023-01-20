import {
  Box,
  Chip,
  Divider,
  Grid,
  InputLabel,
  NativeSelect,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Auth } from "aws-amplify";
import ConfirmEmailComp from "./ConfirmEmailPage";
import { LoaderComp } from "./Loader";
import axios from "axios";
import Navbar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import * as AWS from "aws-sdk";
import awsKeys from "../Keys/awsCred";

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const names = /^[a-zA-Z]+$/;
const mailCheck = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

/**
 * Author: Janvi Patel
 * Functional component for Registration of restaurant and customer.
 * The code for verification is referenced from [10]
 * It uses AWS Cognito.
 */
function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialValues = {
    password: "",
    confpassword: "",
    fname: "",
    lname: "",
    email: "",
    userType: "restaurant",
    restaurantName: "",
    address: "",
  };
  const [formVal, setFormVal] = useState(initialValues);
  const [formErr, setFormErr] = useState({});
  const [showConfirmPage, setShowConfirmPage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormVal({ ...formVal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loading);
    setFormErr(validationFunc(formVal));
  };

  const validationFunc = (values) => {
    const errs = {};

    if (values.password.length < 8) {
      errs.password = "Password must be more than 8 characters";
    } else if (values.password !== values.confpassword) {
      errs.confpassword = "Password does not match";
      errs.password = "Password does not match";
    }
    if (!values.fname.match(names)) {
      errs.fname = "Characters Only";
    }
    if (!values.lname.match(names)) {
      errs.lname = "Characters Only";
    }
    if (!values.email.match(mailCheck)) {
      errs.email = "Not proper email format";
    }

    if (values.userType == "restaurant") {
      if (!values.restaurantName?.trim()) {
        errs.restaurantName = "Provide valid restaurant name";
      }

      if (!values.address?.trim()) {
        errs.address = "Provide valid address name";
      }
    }

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      Auth.signUp({
        username: values.email,
        password: values.password,
        attributes: {
          email: values.email,
          name: values.fname,
          "custom:userType": values.userType,
        },
      })
        .then((res) => {
          const userProfile = {
            TableName: "user-profile",
            Item: {
              email: {
                S: formVal.email,
              },
              firstName: {
                S: formVal.fname,
              },
              lastName: {
                S: formVal.lname,
              },
              userType: {
                S: formVal.userType,
              },
            },
          };

          if (formVal.userType == "restaurant") {
            userProfile.Item.restaurantName = {
              S: formVal.restaurantName,
            };

            userProfile.Item.address = {
              S: formVal.address,
            };
          }

          axios
            .post(
              "https://576mnvmj83.execute-api.us-east-1.amazonaws.com/default/dynamoDbOp",
              userProfile
            )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));

          if (formVal.userType == "restaurant") {
            docClient
              .put({
                Item: {
                  email: formVal.email,
                  address: formVal.address,
                  firstName: formVal.fname,
                  lastName: formVal.lname,
                  restaurantName: formVal.restaurantName,
                  userType: formVal.userType,
                },
                TableName: "user-profile",
              })
              .promise()
              .then((data) => console.log(data.Attributes))
              .catch(console.error);
          }

          if (formVal.userType == "customer") {
            docClient
              .put({
                Item: {
                  email: formVal.email,
                  firstName: formVal.fname,
                  lastName: formVal.lname,
                  userType: formVal.userType,
                },
                TableName: "user-profile",
              })
              .promise()
              .then((data) => console.log(data.Attributes))
              .catch(console.error);
          }

          console.log(res);
          setShowConfirmPage(true);
        })
        .finally(() => setLoading(false));
    }
    return errs;
  };

  return (
    <Box
      sx={{
        minHeight: 1000,
        color: "text.secondary",
      }}
    >
      <Navbar />
      {showConfirmPage ? (
        <ConfirmEmailComp email={formVal.email} userType={formVal.userType} />
      ) : (
        <>
          <LoaderComp open={loading} />
          <Grid container direction="column" alignItems="center" sx={{ pt: 5 }}>
            <Grid width="600px" sx={{ border: 1, borderColor: "black", p: 3 }}>
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
                Register Here
              </Typography>
              <form onSubmit={handleSubmit}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  User Type
                </InputLabel>
                <NativeSelect
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  required
                  name="userType"
                  value={formVal.userType}
                  error={formErr.userType}
                  onChange={handleChange}
                >
                  <option value={"restaurant"}>Restaurant</option>
                  <option value={"customer"}>Customer</option>
                </NativeSelect>
                {formVal.userType == "restaurant" && (
                  <>
                    <TextField
                      label="Restaurant Name"
                      name="restaurantName"
                      required
                      sx={{ marginBottom: 2 }}
                      helperText={formErr.restaurantName}
                      error={formErr.restaurantName}
                      value={formVal.restaurantName}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Address"
                      name="address"
                      required
                      sx={{ marginBottom: 2 }}
                      helperText={formErr.address}
                      error={formErr.address}
                      value={formVal.address}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                      fullWidth
                    />
                  </>
                )}
                <TextField
                  label="First Name"
                  name="fname"
                  required
                  sx={{ marginBottom: 2 }}
                  helperText={formErr.fname}
                  error={formErr.fname}
                  value={formVal.fname}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  name="lname"
                  required
                  helperText={formErr.lname}
                  error={formErr.lname}
                  value={formVal.lname}
                  sx={{ marginBottom: 2 }}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Email Address"
                  required
                  name="email"
                  sx={{ marginBottom: 2 }}
                  helperText={formErr.email}
                  error={formErr.email}
                  value={formVal.email}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type={"password"}
                  required
                  sx={{ marginBottom: 1 }}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  value={formVal.password}
                  error={formErr.password}
                  helperText={formErr.password}
                  fullWidth
                />
                <TextField
                  label="Confirm Password"
                  name="confpassword"
                  type={"password"}
                  required
                  sx={{ marginBottom: 1 }}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  value={formVal.confpassword}
                  error={formErr.confpassword}
                  helperText={formErr.confpassword}
                  fullWidth
                />
                <Button fullWidth variant="contained" type={"submit"}>
                  Sign Up
                </Button>

                <Divider sx={{ marginTop: 2, marginBottom: 2 }}>
                  <Chip label="OR" />
                </Divider>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/login")}
                >
                  Already have an Account?
                </Button>
              </form>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default RegistrationPage;
