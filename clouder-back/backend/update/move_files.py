from json import loads
from boto3 import resource
from util.const import FILES_TABLE
from util.func import response_builder

def move_files_handler(event, contex):

    request = loads(event['body'])
    file_ids_list = request['file_ids_list']
    new_path = request['new_path']

    dynamodb = resource('dynamodb')
    for id in file_ids_list:
        dynamodb.Table(FILES_TABLE).update_item(
            Key={'id': id },
            UpdateExpression='SET file_path = :path',
            ExpressionAttributeValues={
                ':path': new_path,
            }
        )

    return response_builder(200, {"message" : "Move done!"})
