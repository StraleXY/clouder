from json import loads, dumps
from boto3 import client
from util.const import STATE_MACHINE
from util.func import get_email_from_token, response_builder

def delete_content_handler(event, context):
    request = loads(event['body'])
    delete_list = request['delete_list']
    email = get_email_from_token(event)

    c = client('stepfunctions')
    response = c.start_execution(
        stateMachineArn=STATE_MACHINE,
        input='{"isDelete": true, "email":' + dumps(email) + ', "delete_list":' + dumps(delete_list) + '}'
    )

    return response_builder(200, "{message: Delete started}")
