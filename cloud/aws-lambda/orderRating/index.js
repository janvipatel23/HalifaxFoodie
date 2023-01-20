// Author: Sangramsinh More
// Lambda for Closing ChatRoom
//Reference - https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
const Add_AWS = require("aws-sdk");
const client = new Add_AWS.DynamoDB.DocumentClient();

//Reference - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getLexData(user_id, order_id) {
  try {
    const myParams = {
      TableName: "orderTable2",
    };
    const ratingData = await client.scan(myParams).promise();
    const ratingDynamoData = ratingData.Items;
    for (let i = 0; i < ratingDynamoData.length; i++) {
      if (ratingDynamoData[i].user_id == user_id) {
        if (ratingDynamoData[i].order_id == order_id) {
          return {
            sessionAttributes: {
              user_id: user_id,
              order_id: order_id,
            },
            dialogAction: {
              type: "ElicitSlot",
              intentName: "getRating",
              slots: { rating: "", user_id: user_id, order_id: order_id },
              slotToElicit: "rating",
            },
          };
        }
      }
    }
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
//Reference - https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html#using-lambda-response-format
exports.handler = async (event, context) => {
  const user_id = event.currentIntent.slots.userId;
  const order_id = event.currentIntent.slots.order_id;

  event.sessionAttributes = {
    user_id: user_id,
    order_id: order_id,
  };

  const data = await getLexData(user_id, order_id);
  return data;
};
