from json import loads
from boto3 import client
from util.const import STATE_MACHINE
from util.func import response_builder

def upload_handler(event, context):

    c = client('stepfunctions')
    response = c.start_execution(
        stateMachineArn=STATE_MACHINE,
        input='{"isDelete": false, "body":' + event['body'] + '}'
    )


    return response_builder(200, {"message" : "Upload started!"})
