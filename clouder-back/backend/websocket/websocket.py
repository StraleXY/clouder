from json import dumps, loads
from math import e
from boto3 import client, resource
from util.const import WEBSOCKET_GATEWAY, CONNECTION_TABLE

def connect_handler(event, context):
    global connected_clients

    route_key = event['requestContext']['routeKey']

    dynamodb = resource('dynamodb')
    table_name = CONNECTION_TABLE
    if route_key == '$connect':
        connection_id = event['requestContext']['connectionId']
        table = dynamodb.Table(table_name)
        table.put_item(Item={'id': connection_id})
        print("Added connection id")
    elif route_key == '$disconnect':
        connection_id = event['requestContext']['connectionId']
        table = dynamodb.Table(table_name)
        table.delete_item(Key={'id': connection_id})
        print("Deleted connection id")
    else:
        print("Did nothing with the id")

    return { "statusCode": 200 }

def send_notification_handler(event, context):
    global connected_clients
    try:
        idList = event['idList']
    except:
        idList = []

    print(event)
    first = "Upload"
    if event['isDelete']:
        first = "Delete"

    second = "successful"
    if not event['isSuccess']:
        second = "failed"

    message = {"message": first + " " + second, "list": idList}

    apigw_management_client = client('apigatewaymanagementapi', endpoint_url='https://3tp4jytxl9.execute-api.eu-central-1.amazonaws.com/Dev')

    for c in get_connected_clients():
        try:
            apigw_management_client.post_to_connection(ConnectionId=c, Data=dumps(message))
        except Exception as e:
            print(str(e))

    return { 'statusCode': 200 }

def get_connected_clients():
    dynamodb = resource('dynamodb')
    table_name = CONNECTION_TABLE
    table = dynamodb.Table(table_name)
    response = table.scan()
    items = response.get('Items', [])
    return set(item['id'] for item in items)
