from json import loads
from boto3 import resource
from util.func import response_builder
from util.const import FILES_TABLE

def unshare_files_handler(event, context):
    request = loads(event['body'])
    file_id_list = request['file_list']
    shared_email = request['email']

    dynamodb = resource('dynamodb')
    response = dynamodb.Table(FILES_TABLE).scan()
    items = response['Items']

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

    return response_builder(200, {"message" : "Unshare done!"})
