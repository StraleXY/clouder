from boto3 import resource
from util.const import TOKENS_TABLE, FILES_TABLE
from util.func import response_builder

def family_verification_handler(event, context):
    token = event['queryStringParameters']['token']
    dynamodb = resource('dynamodb')
    table = dynamodb.Table(TOKENS_TABLE)
    entry = table.get_item(Key={'key': token})
    print(entry)
    shared_email = entry['Item']['share_to']
    familyMemberEmail = entry['Item']['share_from']

    # Share files
    file_list = dynamodb.Table(FILES_TABLE).scan(
        FilterExpression='owner_email = :email',
        ExpressionAttributeValues={':email': familyMemberEmail}
    )
    print(file_list)
    for item in file_list['Items']:
        file_id = item['id']
        file_path = item['file_path']
        dynamodb.Table(FILES_TABLE).update_item(
            Key={'id': file_id },
            UpdateExpression="SET shared_with = list_append(shared_with, :i)",
            ExpressionAttributeValues={
                ':i': [[shared_email, file_path ]],
            },
        )

    table.delete_item(Key={'key': token})

    return response_builder(200, {})
