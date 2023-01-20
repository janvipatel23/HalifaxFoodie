# Author: Janvi Patel
# Publisher for complaint topic.

import base64
import json
import os
from google.cloud import pubsub_v1                                      # pip install google-cloud-pubsub

publisher = pubsub_v1.PublisherClient()
PROJECT_ID = 'csci5410serverlessproject'                                 # GOOGLE_CLOUD_PROJECT

def my_cloud_function(request):
    data = request.get_json()

    if data is None:
        print('request.data is empty')
        return ('request.data is empty', 400)

    # print(f'request data: {data}')
    
    #data_json = json.loads(data)                                        # turn the string into a dictionary
    print(f'json = {data}')

    ###############################
    # move the data to Pubsub!

    topic_path = 'projects/csci5410serverlessproject/topics/customer_complaint'                    # Pubsub topic path

    message_json = json.dumps(data)
    # print(f'json = {message_json}')
    message_bytes = message_json.encode('utf-8')

    try:
        publish_future = publisher.publish(topic_path, data=message_bytes)
        publish_future.result()                                         # verify that the publish succeeded
    except Exception as e:
        print(e)
        return (e, 500)

    return ('Message received and published to Pubsub', 200)

