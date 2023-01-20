# Author: Sangramsinh More
# Lambda for Adding Recipe for an Restaurant
import json
import boto3
import random
import re
def lambda_handler(event, context):
    if (event):
        print(event)
        r1 = random.randint(10, 100000)
        db = boto3.resource('dynamodb')
        rest_id= event['currentIntent']['slots']['restId']
        recipe_name=event['currentIntent']['slots']['recipe_name']
        recipe_price=event['currentIntent']['slots']['recipe_price']
        table = db.Table('user-profile')
        response = table.scan();
        
        #checking if restaurant Id is valid or not
        #https://stackoverflow.com/questions/63677465/check-if-a-value-exists-in-dynamodb-table-using-python-and-fetch-that-record
        check=0
        for i in response['Items']:
            if(i['email']==rest_id):
                check=1
            else:
                check=0
        
        #if restaurant Id is valid then adding recipe and details
        if(check):
            recipeTable = db.Table("recipeTable")
            resposne = recipeTable.put_item(
                    Item={
                      'id':str(r1),    
                      'rest_id' :rest_id,
                      'recipe_name':recipe_name,
                      'recipe_price':recipe_price
                    })
            return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Recipe has been added. Thanks!."}}}
        else:            
            return {"dialogAction":{"type":"Close","fulfillmentState": "Failed","message": { "contentType": "PlainText", "content": "Invalid Restaurant Id Proided."}}}