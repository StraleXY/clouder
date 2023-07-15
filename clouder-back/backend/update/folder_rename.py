from json import loads
from boto3 import resource
from util.const import FILES_TABLE
from util.func import response_builder

def folder_rename_handler(event, context):

    request = loads(event['body'])
    old_prefix = request['old_prefix']
    new_prefix = request['new_prefix']

    dynamodb = resource('dynamodb')
    response = dynamodb.Table(FILES_TABLE).scan(
        FilterExpression='begins_with(file_path, :prefix)',
        ExpressionAttributeValues={':prefix': old_prefix }
    )

    for file in response['Items']:
        file_path = file['file_path']
        new_file_path = file_path.replace(old_prefix, new_prefix)

        dynamodb.Table(FILES_TABLE).update_item(
            Key={'id': file['id']},
            UpdateExpression='SET file_path = :new_file_path',
            ExpressionAttributeValues={':new_file_path': new_file_path }
        )

    return response_builder(200, {"message" : "Rename done!"})
