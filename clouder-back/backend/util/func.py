from json import dumps
from jwt import decode

def response_builder(statusCode, body):
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": dumps(body),
    }

def get_email_from_token(event):
    email = None
    token = event['headers'].get('Authorization', '').split(' ')[1]
    decoded = decode(token, algorithms=["RS256"], options={"verify_signature": False})
    return decoded['email']
