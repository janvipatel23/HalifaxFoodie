import * as AWS from 'aws-sdk'
import awsKeys from "../Keys/awsCred1";

/**
 * Author: Meghdoot Ojha
 * Establishing Connection with DynamoDB
 */

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});

const docClient = new AWS.DynamoDB.DocumentClient()

export const fetchData = (ingredient,cb) => {
    console.log("check ShowIngredient")
    var params = {
        TableName: "RecipeTable",
        Key: {
            "RecipeName": ingredient
        }
    }

    console.log("check ShowIngredient param", params)

  return docClient.scan(params, cb)
}
