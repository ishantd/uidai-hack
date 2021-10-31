import json
import boto3
import xmltodict
import googlemaps
from datetime import datetime
from haversine import haversine, Unit

from django.conf import settings

client = boto3.client(
    'sns',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_DEFAULT_REGION_NAME
)

def compare_two_geocodes(original, new):
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    original_geocode_result = gmaps.geocode(original)
    new_geocode_result = gmaps.geocode(new)
    original_location = original_geocode_result[0]["geometry"]["location"]
    new_location = new_geocode_result[0]["geometry"]["location"]
    distance = int(haversine(patient_location, hcc_location))
    return original_location, new_location

def create_sns_endpoint(device_id):

    arn = client.create_platform_endpoint(
        PlatformApplicationArn=settings.AWS_SNS_ARN_NOTIFICATION,
        Token=device_id,
    )
    
    return arn

def trigger_single_notification(device_id, title, body):
    GCM_data = { 'data' : { 'body' : body, 'title': title}}

    data = { "default" : "test",
            "GCM": json.dumps(GCM_data)
            }
    jsonData =  json.dumps(data)
    notify = client.publish(
        Message=jsonData,
        Subject=body,
        MessageStructure='json',
        TargetArn=device_id,

    )
    
    return notify

def xml_to_dict(xml):
    return xmltodict.parse(xml)