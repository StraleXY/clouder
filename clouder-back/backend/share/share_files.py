from json import loads
from boto3 import resource
from util.const import FILES_TABLE
from util.func import get_email_from_token, response_builder

def share_files_handler(event, context):
    request = loads(event['body'])
    email = get_email_from_token(event)
    file_list = request['file_list']
    shared_email = request['email']

    dynamodb = resource('dynamodb')
    response = dynamodb.Table(FILES_TABLE).scan()
    items = response['Items']

    # Check privileges
    for item in items:
        for file in file_list:
            if file['file_id'] == item['id']:
                if item['owner_email'] != email:
                    raise Exception("You don't have share privileges")

    file_id_list = [id['file_id'] for id in file_list]

    # Unshare everything
    item_list_pairs = []
    for item in items:
        if item['id'] not in file_id_list:
            continue
        for key_val_pair in item['shared_with']:
            if key_val_pair[0] == shared_email:
                new_list = [i for i in item['shared_with'] if i[0] != key_val_pair[0]]
                item_list_pairs.append([item['id'], new_list])

    for item in item_list_pairs:
        dynamodb.Table(FILES_TABLE).update_item(
            Key={'id': item[0]},
            UpdateExpression="SET shared_with = :i",
            ExpressionAttributeValues={
                ':i': item[1],
            },
        )


    # Share everything
    dynamodb = resource('dynamodb')
    for item in file_list:
        file_id = item['file_id']
        file_path = item['file_path']
        dynamodb.Table(FILES_TABLE).update_item(
            Key={'id': file_id },
            UpdateExpression="SET shared_with = list_append(shared_with, :i)",
            ExpressionAttributeValues={
                ':i': [[shared_email, file_path ]],
            },
        )

    return response_builder(200, {"message" : "Share done!"})
