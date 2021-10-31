from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

import boto3

def create_request_sms(sender, mobile_number, pk, current_site, expiry):
    url_b64_endpoint = urlsafe_base64_encode(force_bytes(f'{mobile_number}-{pk}'))
    final_url = f'http://{current_site.domain}/web/address-request/{url_b64_endpoint}/'
    
    message = f'{sender} has requested access to your address. Please visit: {final_url}. Expiry: {str(expiry)}'
    print(message)
    return message

def send_message_using_sns(mobile, message):
    try:
        if settings.SEND_MESSAGES:
            client = boto3.client(
                "sns",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_DEFAULT_REGION_NAME
            )
            client.publish(
                PhoneNumber=f"+91{mobile}",
                Message=message
            )
        return True
    except Exception as e:
        print(e)
        return False