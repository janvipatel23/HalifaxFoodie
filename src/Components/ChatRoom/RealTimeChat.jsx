import React, { useEffect, useState, useContext } from "react";
import ChatRoom from "./ChatRoom";
import "./RealTimeChat.scss";
import db from "../../firebase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { CardContent, Card, Typography, Grid, CardHeader } from "@mui/material";

/**
 * Author: Sangramsinh more
 * The below code is implemented enable realtime chat functionality
 * This code is referenced from [8].
 */

export default function RealTimeChat() {
 

  const [cUser, setCuser] = useState(null);
  const [cList, setClist] = useState([]);
  const [sCustomer, setScustomer] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    let localUser = user;
    if (!localUser || localUser === "null") {
      navigate("/");
      return;
    }
    console.log("djnlkknl", localUser?.attributes["custom:userType"]);
    let sang = {
      role: localUser?.attributes["custom:userType"],
      username: localUser?.attributes.email,
      email: localUser?.attributes.email,
      answer: "",
      question: "",
    };
    setCuser(sang);
    console.log("uuuuu", localUser);

    if (cUser?.attributes["custom:userType"].toLowerCase() !== "customer") {
      const users = await db.collection("users");
      const userData = await users.where("role", "==", "customer").get();

      const customerData = [];
      userData.forEach((doc) => {
        customerData.push(doc.data());
      });
      setClist(customerData);
    }
  }

  function SingleCustomer(props) {
    return <Card style={{ cursor: "pointer" }}>{props.customer.email}</Card>;
  }

  function getCardHeading() {
    return "Chat";
  }

  function selectCustomerToChatWith(customer) {
    setScustomer(customer);
  }

  function CustomersList(props) {
    return (
      <div>
        {props.customerList &&
          props.customerList.map((customer, index) => (
            <div onClick={(e) => selectCustomerToChatWith(customer)}>
              <SingleCustomer customer={customer} />
            </div>
          ))}

        {props.customerList && (
          <h1 style={{ color: "red" }}>No Customers !!!</h1>
        )}
      </div>
    );
  }

  return (
    <Grid>
      <Grid>
        <CardHeader title={getCardHeading()} />
        <CardContent>
          {cUser.role.toLowerCase() === "customer" && (
            <ChatRoom currentUser={cUser} />
          )}

          {cUser.role.toLowerCase() !== "customer" && sCustomer && (
            <ChatRoom currentUser={cUser} chatWith={sCustomer} />
          )}

          {cUser.role.toLowerCase() !== "customer" && !sCustomer && (
            <CustomersList customerList={cList} />
          )}

          {!cUser && <h1>Loading !!!!!!</h1>}
        </CardContent>
      </Grid>
    </Grid>
  );
}
