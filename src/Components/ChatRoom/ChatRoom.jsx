import React, { useState, useRef, useContext } from "react";
import db from "../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import ChatMessage from "./ChatMessage";
import { Button, OutlinedInput } from "@mui/material";
import { UserContext } from "../../App";
import * as AWS from "aws-sdk";
import awsKeys from "../../Keys/awsCred";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});

const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Author: Sangramsinh more
 * The below code is component of chatroom
 * This code is referenced from [1].
 */

export default function ChatRoom({ currentUser, chatWith }) {

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { chatRoomId } = useParams();

  const [formValue, setFormValue] = useState("");
  const sentBy =
    currentUser.role === "customer" ? currentUser.email : "restaurant";
  const sentTo = chatWith ? chatWith.email : "restaurant";

  console.log("chatWith", chatWith);
  console.log("sentBy", sentBy);
  console.log("sentTo", sentTo);

  const msg = db.collection("messages");
  const msgQuery = msg
    .where("sentBy", "in", [sentBy, sentTo])
    .orderBy("createdAt")
    .limit(25);

    const [msgs] = useCollectionData(msgQuery, { idField: "id" });

  const dummy = useRef();

  function getFilteredMessages() {
    if (!msgs) return;
    const usrs = new Set([sentBy, sentTo]);
    return msgs.filter((message) => usrs.has(message.sentTo));
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      await msg.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        sentBy,
        sentTo,
        chatRoomId,
      });

      setFormValue("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (e) => {
    var config = {
      method: "post",
      url: "https://us-central1-csci5410serverlessproject.cloudfunctions.net/communication_history_publisher",
      headers: {
        "Content-Type": "application/json",
      },
      data: { chatRoomId },
    };

    await axios(config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
        console.log(error.response);
        console.log(error.request);
      });

    const params1 = {
      TableName: "chatRoom",
      Key: {
        user_id: user?.attributes.email,
      },
      UpdateExpression: "set flag = :r",
      ExpressionAttributeValues: {
        ":r": 0,
      },
    };

    await docClient.update(params1).promise(1);

    navigate("/");
  };

  return (
    <>
      <main>
        {getFilteredMessages() &&
          getFilteredMessages().map((msg) => (
            <ChatMessage key={msg.id} message={msg} currentUser={currentUser} />
          ))}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <OutlinedInput
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />

        <Button style={{ marginLeft: "10px" }} disabled={!formValue}>
          Send
        </Button>
        <Button onClick={handleClick}>End Chat</Button>
      </form>
    </>
  );
}
