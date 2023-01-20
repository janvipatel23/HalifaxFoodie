// Author: Sangramsinh More
// Lambda for Order Tracking Lex
//Reference - https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
const Add_AWS = require("aws-sdk");
const myClient = new Add_AWS.DynamoDB.DocumentClient();

//Reference - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getLexData(user_id, order_id) {
  try {
    const myParams = {
      TableName: "orderTable2",
    };
    const order = await myClient.scan(myParams).promise();
    const dynamO = order.Items;
    for (let i = 0; i < dynamO.length; i++) {
      if (dynamO[i].user_id == user_id) {
        if (dynamO[i].order_id == order_id) {
          return {
            dialogAction: {
              type: "Close",
              fulfillmentState: "Fulfilled",
              message: {
                contentType: "PlainText",
                content: "Order status is: " + dynamO[i].status,
              },
            },
          };
        }
      }
    }
    return {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Failed",
        message: { contentType: "PlainText", content: "Invalid Order Details" },
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
  const data = await getLexData(user_id, order_id);
  return data;
};
