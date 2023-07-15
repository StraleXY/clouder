from boto3 import resource
from util.const import FILES_TABLE
from util.func import get_email_from_token, response_builder

def get_files_handler(event, context):

    dynamodb = resource('dynamodb')
    user_email = get_email_from_token(event)

    response = dynamodb.Table(FILES_TABLE).scan(
        FilterExpression='owner_email = :email',
        ExpressionAttributeValues={':email': user_email}
    )

    return response_builder(200, response['Items'])
