# Author: Sangramsinh More
# Lambda for Adding rating to an order
import json
import boto3
import random
import re
def lambda_handler(event, context):
    if (event):
        print(event)
        r1 = random.randint(10, 100000)
        db = boto3.resource('dynamodb')
        #getting data from LexBot
        review= event['currentIntent']['slots']['rating']
        username=event['currentIntent']['slots']['user_id']
        order_id=event['currentIntent']['slots']['order_id']
        
        #Checking if details are valid or not before adding rating
        ratingTable = db.Table("orderTable2")
        resposne = ratingTable.update_item(
            Key={'order_id': order_id},
            UpdateExpression='SET rating = :val1',
            ExpressionAttributeValues={
                ':val1': review,
            },
        )
        #Returning Response for Sucessful Added Rating in Lex
        return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Rating has been added. Thanks!."}}}