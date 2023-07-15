from boto3 import resource, client
from base64 import b64encode
from util.const import FILES_TABLE, FILES_BUCKET
from util.func import response_builder


def download_handler(event, context):
    file_id = event['queryStringParameters']['file_id']

    dynamodb = resource('dynamodb')

    response = dynamodb.Table(FILES_TABLE).scan(
        FilterExpression='id = :id',
        ExpressionAttributeValues={':id': file_id}
    )
    items = response['Items']
    item = items[0]
    file_header = item['file_header']

    s3 = client('s3')
    file_obj = s3.get_object(Bucket=FILES_BUCKET, Key=file_id)
    file_content = file_obj['Body'].read()
    file_content = file_header + ',' + b64encode(file_content).decode('utf-8')

    return response_builder(200, file_content)
