import json
import boto3
import xmltodict
import googlemaps
from datetime import datetime

from django.conf import settings


def compare_two_geocodes(original, new):
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    original_geocode_result = gmaps.geocode(original)
    new_geocode_result = gmaps.geocode(new)
    return original_geocode_result, new_geocode_result

def create_sns_endpoint(device_id):
    client = boto3.client(
        'sns',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_DEFAULT_REGION_NAME
    )

    arn = client.create_platform_endpoint(
        PlatformApplicationArn=settings.AWS_SNS_ARN_NOTIFICATION,
        Token=device_id,
    )
    
    return arn

def xml_to_dict(xml):
    return xmltodict.parse(xml)