# Author: Janvi Patel
# AWS Lambda to perform CRUD operations on DynamoDB.

import boto3
import json

print('Loading function')
dynamo = boto3.client('dynamodb')


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "*",
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Request-Headers" : "*"
        },
    }

def lambda_handler(event, context):
    '''Demonstrates a simple HTTP endpoint using API Gateway. You have full
    access to the request and response payload, including headers and
    status code.

    To scan a DynamoDB table, make a GET request with the TableName as a
    query string parameter. To put, update, or delete an item, make a POST,
    PUT, or DELETE request respectively, passing in the payload to the
    DynamoDB API as a JSON body.
    '''
    print("Received event: " + json.dumps(event, indent=2))

    operations = {
        'DELETE': lambda dynamo, x: dynamo.delete_item(**x),
        'GET': lambda dynamo, x: dynamo.get_item(**x),
        'POST': lambda dynamo, x: dynamo.put_item(**x),
        'PUT': lambda dynamo, x: dynamo.update_item(**x),
    }

    operation = event['httpMethod']
    if operation in operations:
        if operation == 'GET':
            if 'email' in event['queryStringParameters']:
                payload = {
                    "TableName" : event['queryStringParameters']["TableName"],
                    "Key" : {
                        "email" : {
                            "S" : event['queryStringParameters']["email"]
                        }
                    }
                }
                return respond(None, operations[operation](dynamo, payload))
            else:
                return respond(None, dynamo.scan(TableName = event['queryStringParameters']["TableName"]))
        else:
            payload = json.loads(event['body'])
            return respond(None, operations[operation](dynamo, payload))
        # payload = event['queryStringParameters'] if operation == 'GET' else json.loads(event['body'])
        # return respond(None, operations[operation](dynamo, payload))
    else:
        return respond(ValueError('Unsupported method "{}"'.format(operation)))
