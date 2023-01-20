# Author: Janvi Patel
# Publisher for commnunication_histoy topic.

import base64
import json
import os
from google.cloud import pubsub_v1                                      # pip install google-cloud-pubsub

publisher = pubsub_v1.PublisherClient()
PROJECT_ID = 'csci5410serverlessproject'                                 # GOOGLE_CLOUD_PROJECT
headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
}

def my_cloud_function(request):

    if request.method == 'OPTIONS':
        return ('', 204, headers)
    data = request.get_json()

    if data is None:
        print('request.data is empty')
        return ('request.data is empty', 400)

    # print(f'request data: {data}')
    
    #data_json = json.loads(data)                                        # turn the string into a dictionary
    print(f'json = {data}')

    ###############################
    # move the data to Pubsub!

    topic_path = 'projects/csci5410serverlessproject/topics/communication_history'                    # Pubsub topic path

    # message_json = json.dumps(data)
    # print(f'json = {message_json}')
    message_json = data['chatRoomId']
    message_bytes = message_json.encode('utf-8')

    try:
        publish_future = publisher.publish(topic_path, data=message_bytes)
        return (publish_future.result(), 200, headers)                                         # verify that the publish succeeded
    except Exception as e:
        print(e)
        return (e, 500, headers)

    return ('Message received and published to Pubsub', 200)

