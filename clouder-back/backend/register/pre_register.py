from boto3 import resource, client
from uuid import uuid1
from util.const import TOKENS_TABLE, CLOUDER_EMAIL

def pre_register_handler(event, context):
    userAttributes = event['request']['userAttributes']
    familyMemberKey = 'custom:familyMemberEmail'
    if familyMemberKey in userAttributes:
        familyMemberEmail = userAttributes[familyMemberKey]
        shared_email = userAttributes['email']
        print("Family member email is " + familyMemberEmail)

        # Generate and save verification token
        dynamodb = resource('dynamodb')
        table = dynamodb.Table(TOKENS_TABLE)
        token = str(uuid1())
        table.put_item(Item = {
            'key': token,
            'share_from': familyMemberEmail,
            'share_to': shared_email,
        })

        # Send verification email
        ses = client('ses')
        response = ses.send_email(
            Source=CLOUDER_EMAIL,
            Destination={
                'ToAddresses': [
                    familyMemberEmail
                ]
            },
            Message={
                'Subject': {
                    'Data': 'Family member verification'
                },
                'Body': {
                    'Text': {
                        'Data': 'http://localhost:4200/family/verify?token=' + token
                    }
                }
            }
        )

    else:
        print("No family member email")
    return event
