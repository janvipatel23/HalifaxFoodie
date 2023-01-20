// Author: Sangramsinh More
// Lambda for Closing ChatRoom
exports.handler = async (event) => {
  // TODO implement
  const https = require("https");
  const fetch = require("node-fetch");
  console.log("chatRoomId", event.body);
  const chatRoomId = event.body;
  const d = {
    chatRoomId: chatRoomId,
  };

  publishMessage(d);

  // Calling cloud function and passing chatId for closing of the chatroom
  async function publishMessage(data) {
    try {
      const res = await fetch(
        "https://us-central1-csci5410serverlessproject.cloudfunctions.net/communication_history_publisher",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Res", res);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
    }
  }

  const response = {
    event: event,
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
