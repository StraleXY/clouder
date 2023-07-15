from boto3 import resource
from util.const import FILES_TABLE
from util.func import response_builder, get_email_from_token

def get_shared_files_handler(event, context):

    dynamodb = resource('dynamodb')
    user_email = get_email_from_token(event)

    response = dynamodb.Table(FILES_TABLE).scan()
    items = response['Items']
    ret_val = []
    for item in items:
        for key_val_pair in item['shared_with']:
            if key_val_pair[0] == user_email:
                ret_val.append(item)


    return response_builder(200, ret_val)


