import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { Auth } from "aws-amplify";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";

export default function ButtonAppBar() {
  const navigate = useNavigate();

  // Handling navigation once user is authenticated successfully
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    React.useContext(UserContext);
  const handleProfile = () => {
    if (user?.attributes["custom:userType"] == "restaurant") {
      navigate("/userdashboard");
    }
    if (user?.attributes["custom:userType"] == "customer") {
      navigate("/customerdashboard");
    }
  };

  /**
   * Author: Janvi Patel
   * It calls cloud-function api on logout to update status in firestore and then
   * it call sign out method of cognito.
   * THis code is referenced from [9]
   */
  const handleLogout = (event) => {
    event.preventDefault();
    axios
      .post(
        "https://us-central1-csci5410serverlessproject.cloudfunctions.net/logoutCloudFunction",
        {
          emailId: user?.username,
        }
      )
      .catch((err) => console.log(err));
    Auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    /**
     * Author: Sangramsinh More
     * Page for App Bar
     */
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={() => navigate("/")}>
            <HomeIcon />
          </Button>
          <Typography
            variant="h2"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 900,
              color: "inherit",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Halifax-Foodie
          </Typography>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={handleProfile}>
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
