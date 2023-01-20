/**
 * Author: Janvi Patel
 * AWS Lambda that will be triggered from AWS Lex to register a complaint and it will call the cloud function api to publish the complaint message.
 */

//Reference - https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
// import { PubSub } from "@google-cloud/pubsub";
// import { DynamoDB } from "aws-sdk";

const { DynamoDB, HttpRequest, AlexaForBusiness } = require("aws-sdk");
const https = require("https");
const fetch = require("node-fetch");

const myClient = new DynamoDB.DocumentClient();
//Reference - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getLexData(user_id, order_id, rest_id, chatRoomId) {
  try {
    const myParams = {
      TableName: "orderTable2",
    };
    const myParams1 = {
      TableName: "chatRoom",
    };
    const stuData = await myClient.scan(myParams).promise();
    const dynamoData = stuData.Items;
    console.log("data : ", JSON.stringify(dynamoData));
    for (let i = 0; i < dynamoData.length; i++) {
      if (dynamoData[i].user_id == user_id) {
        if (dynamoData[i].order_id == order_id) {
          if (dynamoData[i].rest_id == rest_id) {
            // Valid User_Id and Order_Id, write your code below, the commented return in this current If condition will return back to lex console.
            // use the column user_id and order_id for now, also modify the orderTable in dynamo as per your need.
            // return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "back from lambda, details are valid"}}}
            //   publishMessage(dynamoData[i]);

            const data = {
              chatRoomId: chatRoomId,
              orderId: order_id,
              restId: rest_id,
              userId: user_id,
            };
            console.log("Inside loop");
            await publishMessage(data);

            // chatRoom = db.Table("chatRoom")
            //     resposne = chatRoom.update_item(
            //     Key={'user_id': user_id},
            //     UpdateExpression='SET flag = :val1',
            //     ExpressionAttributeValues={
            //       ':val1': 1,
            //       },
            //   )

            const params2 = {
              TableName: "chatRoom",
              Key: {
                user_id: user_id,
              },
              UpdateExpression: "set chatRoomId = :r",
              ExpressionAttributeValues: {
                ":r": chatRoomId,
              },
            };

            await myClient.update(params2).promise(1);

            const params1 = {
              TableName: "chatRoom",
              Key: {
                user_id: user_id,
              },
              UpdateExpression: "set flag = :r",
              ExpressionAttributeValues: {
                ":r": 1,
              },
            };

            await myClient.update(params1).promise(1);

            return {
              dialogAction: {
                type: "Close",
                fulfillmentState: "Fulfilled",
                message: {
                  contentType: "PlainText",
                  content:
                    "Details Verified!, You can connect to a representative using chatroom id : " +
                    chatRoomId,
                },
              },
            };
          }
        }
      }
    }

    // Invalid Details return here
    return {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Failed",
        message: { contentType: "PlainText", content: "Invalid Details" },
      },
    };
  } catch (error) {
    return error;
  }
}

async function publishMessage(data) {
  try {
    // fetch(
    //   "https://us-central1-csci5410serverlessproject.cloudfunctions.net/complaint-publisher",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(data),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //   }
    // )
    //   .then((response) => console.log("response is : ",response.text()))
    //   .then((result) => console.log('then block : ', result))
    //   .catch((error) => console.log("error", error));

    const res = await fetch(
      "https://us-central1-csci5410serverlessproject.cloudfunctions.net/complaint-publisher",
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

//Reference - https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html#using-lambda-response-format
exports.handler = async (event, context) => {
  const user_id = event.currentIntent.slots.userId;
  const order_id = event.currentIntent.slots.order_id;
  const rest_id = event.currentIntent.slots.restId;
  console.log("INside handler", rest_id);
  event.sessionAttributes = {
    user_id: user_id,
    order_id: order_id,
    rest_id: rest_id,
  };

  const data = await getLexData(
    user_id,
    order_id,
    rest_id,
    context.awsRequestId
  );
  return data;
};
