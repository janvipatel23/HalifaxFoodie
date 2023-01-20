import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import RegistrationPage from "./Pages/RegistrationPage";
import FactorAuthenticationComp from "./Pages/FactorAuthentication";
import Amplify, { Auth } from "aws-amplify";
import { RestaurantDashboardComp } from "./Pages/RestaurantDashboardPage";
import ProfilePage from "./Pages/ProfilePage";
import MainPage from "./Pages/Main";
import { createTheme } from "@mui/material/styles";
import LoginComp from "./Pages/LoginPage";
import { createContext, useEffect, useState } from "react";
import { LoaderComp } from "./Pages/Loader";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OrderFoodComp from "./Pages/OrderFood";
import RestReviews from "./Pages/RestaurantReviews";
import UserDashboardPage from "./Pages/UserDashboard";
import RealTimeChat from "./Components/ChatRoom/RealTimeChat";
import UploadImageToS3WithNativeSdk from "./Pages/DataProcessing";
import Fetch from "./Pages/fetchIngredientrecipe";
import Polarity from "./Pages/Polarity";
import Similarity from "./Pages/ML_Similarity";
import RecipeVisualization from "./Pages/RecipeVisualization";
import { messaging } from "./firebase";
import CustomerDashboardPage from "./Pages/CustomerDashboard";
import FoodOrders from "./Pages/FoodOrders";
import Chatbot from "./Components/Chatbot/chatbot";

/**
 * Author: Janvi Patel
 * Configuring a Cognito CLient app and User pool for Authentication.
 */
Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_mmyo4zjEo",
    userPoolWebClientId: "1bojl92dbk3utj8j817frbve0m",
  },
});

/**
 * Author: Janvi Patel
 * Foreground Listener for Firebase Cloud Messaging service.
 * This code is referenced from [1].
 * @returns Promise of notification payload.
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const UserContext = createContext({
  user: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isToastOpen, showToast] = useState(false);
  const [notification, setNotification] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const handleClose = (event) => {
    event.preventDefault();
    showToast(false);
    setNotification({});
  };

  const handleClick = (event) => {
    event.preventDefault();
    navigate(`/chat/${notification.body}`);
  };

  const action = (
    <>
      <Button color="secondary" size="large" onClick={handleClick}>
        Click here to open chatroom.
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setIsAuthenticated(true);
        setUser(user);
      })
      .catch((err) => navigate("/"))
      .finally(() => setLoading(false));
  }, []);

  onMessageListener().then((payload) => {
    console.log("payload : ", payload);
    setNotification(payload.notification);
    showToast(true);
  });

  return loading ? (
    <LoaderComp />
  ) : (
    // <ThemeProvider theme={darkTheme}>
    <UserContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
    >
      <Snackbar
        open={isToastOpen}
        onClose={handleClose}
        message={notification.title}
        action={action}
      />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/multi-factor-auth"
          element={<FactorAuthenticationComp />}
        />
        <Route path="/login" element={<LoginComp />} />
        <Route path="/dashboard" element={<RestaurantDashboardComp />} />
        <Route path="/orderfood" element={<OrderFoodComp />} />
        <Route path="/foodorders" element={<FoodOrders />} />
        <Route path="/reviews" element={<RestReviews />} />
        <Route path="/userdashboard" element={<UserDashboardPage />} />
        <Route path="/customerdashboard" element={<CustomerDashboardPage />} />
        <Route path="/chat/:chatRoomId" element={<RealTimeChat />} />
        <Route path="/fetch" element={<Fetch />} />
        <Route
          path="/recipeupload"
          element={<UploadImageToS3WithNativeSdk />}
        />
        <Route path="/polarity" element={<Polarity />} />
        <Route path="/similarity" element={<Similarity />} />
        <Route path="/visualize_recipe" element={<RecipeVisualization />} />
      </Routes>
      <Chatbot />
    </UserContext.Provider>
    // {/* </ThemeProvider> */}
  );
}

export default App;
