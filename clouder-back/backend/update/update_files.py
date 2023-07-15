from json import loads
from boto3 import resource
from base64 import b64decode
from util.const import FILES_TABLE, FILES_BUCKET
from util.func import get_email_from_token, response_builder

def update_handler(event, context):

    file = loads(event['body'])
    header = file['file_header']
    email = get_email_from_token(event)


    # Check if the data has changed and write to S3
    if file['file_base64'] != '':
        s3 = resource('s3')
        header, data = file['file_base64'].split(',')
        s3.Bucket(FILES_BUCKET).put_object(Key=file['id'], Body=b64decode(data))

    # Write metadata to DynamoDB
    dynamodb = resource('dynamodb')

    response = dynamodb.Table(FILES_TABLE).scan(
        FilterExpression='id = :id',
        ExpressionAttributeValues={':id': file['id']}
    )
    items = response['Items']

    if (len(items) == 0 or items[0]['owner_email'] != email):
        raise Exception("You don't have update privileges")

    dynamodb.Table(FILES_TABLE).update_item(
        Key={'id': file['id']},
        UpdateExpression='SET file_name = :name,  file_path = :path, file_description = :desc, file_type = :type, file_modified_at = :date, file_size = :size, file_header = :header, shared_with = :shared, tags = :tags',
        ExpressionAttributeValues={
            ':name': file['file_name'],
            ':path': file['file_path'],
            ':desc': file['file_description'],
            ':type': file['file_type'],
            ':size': file['file_size'],
            ':date': file['file_modified_at'],
            ':header': header,
            ':shared':  file['shared_with'],
            ':tags': file['tags']
        }
    )

    return response_builder(200, {"message" : "Update done!"})
