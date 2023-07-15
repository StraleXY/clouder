from boto3 import resource, client
from json import dumps, loads
from uuid import uuid1
from base64 import b64decode
from util.const import FILES_TABLE, FILES_BUCKET, WEBSOCKET_NOTIFICATION_ARN
from util.func import get_email_from_token

def dynamo_uploader(event, context):
    file = event['body']
    file['id'] = str(uuid1())
    header, data = '', ''
    if len(file['file_base64']):
        header, data = file['file_base64'].split(',')

    dynamodb = resource('dynamodb')
    table = dynamodb.Table(FILES_TABLE)
    table.put_item(Item = {
        'id': file['id'],
        'owner_email': file['owner_email'],
        'file_name': file['file_name'],
        'file_type': file['file_type'],
        'file_path': file['file_path'],
        'file_description': file['file_description'],
        'file_created_at': file['file_created_at'],
        'file_modified_at': file['file_modified_at'],
        'file_size': file['file_size'],
        'file_header': header,
        'shared_with': file['shared_with'],
        'tags': file['tags']
    })
    return {"uploaded_file": dumps(file), "uploaded_id": file['id']}

def s3_uploader(event, context):
    file = loads(event['uploaded_file'])
    # Write file to S3
    if len(file['file_base64']):
        s3 = resource('s3')
        header, data = file['file_base64'].split(',')
        s3.Bucket(FILES_BUCKET).put_object(Key=file['id'],
                                           Body=b64decode(data))
    return {"isSuccess": True, "isDelete": False, "id_list": [event['uploaded_id']]}


def dynamo_upload_reverter(event, context):
    id = event['uploaded_id']
    dynamodb = client('dynamodb')
    delete_request = [{
        'DeleteRequest': {
               'Key': {
                   'id' : {
                       'S' : id
                       }
                   }
               }
           }]

    res = {}
    if (delete_request):
        res = dynamodb.batch_write_item(
                RequestItems={FILES_TABLE : delete_request}
        )
    return {"isSuccess": False, "isDelete": False}

def dynamo_delete_reverter(event, context):
    deleted_items = loads(event['deleted_items'])

    dynamodb = resource('dynamodb')
    table = dynamodb.Table(FILES_TABLE)
    for file in deleted_items:
        table.put_item(Item = {
            'id': file['id'],
            'owner_email': file['owner_email'],
            'file_name': file['file_name'],
            'file_type': file['file_type'],
            'file_path': file['file_path'],
            'file_description': file['file_description'],
            'file_created_at': file['file_created_at'],
            'file_modified_at': file['file_modified_at'],
            'file_size': file['file_size'],
            'file_header': file['file_header'],
            'shared_with': file['shared_with'],
            'tags': file['tags']
        })

    return {"isSuccess": False, "isDelete": True}

def saga_notification(event, context):
    isSuccess = event['isSuccess']
    isDelete = event['isDelete']
    try:
        idList = event['id_list']
    except:
        idList = []

    lambda_client = client('lambda')
    invocation_type = 'Event'
    payload = { 'isSuccess': isSuccess, 'isDelete' : isDelete, 'idList': idList }

    response = lambda_client.invoke(
        FunctionName=WEBSOCKET_NOTIFICATION_ARN,
        InvocationType=invocation_type,
        Payload=dumps(payload)
    )

    return {"statusCode": 200}

def s3_deleter(event, context):
    delete_list = event['delete_list']
    s3_client = client('s3')
    res = s3_client.delete_objects(
        Bucket=FILES_BUCKET,
        Delete={
            'Objects': [
                {'Key': key} for key in delete_list
                ],
            'Quiet': False
            }
        )

    if 'Errors' in res:
        raise Exception("Delete failed")

    return {"isSuccess": True, "isDelete": True, "id_list": delete_list}

def dynamo_deleter(event, context):
    delete_list = event['delete_list']
    user_email = event['email']
    dynamodb = resource('dynamodb')

    response = dynamodb.Table(FILES_TABLE).scan(
            FilterExpression='owner_email = :email',
            ExpressionAttributeValues={':email': user_email}
    )

    if len(response['Items']) == 0:
        raise Exception("No items found")

    for id in delete_list:
        for item in response['Items']:
            if id == item['id']:
                break
        else:
            raise Exception("You don't have delete priveleges")

    dynamodb = client('dynamodb')
    delete_request = [{
        'DeleteRequest': {
               'Key': {
                   'id' : {
                       'S' : key
                       }
                   }
               }
           }for key in delete_list]

    res = {}
    if (delete_request):
        res = dynamodb.batch_write_item(
                RequestItems={FILES_TABLE : delete_request}
        )

    if len(res['UnprocessedItems']) != 0:
        raise Exception("Delete failed")

    return { "delete_list": delete_list, "deleted_items": dumps(response['Items']) }

