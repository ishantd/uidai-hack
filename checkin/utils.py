import boto3
from django.conf import settings

client = boto3.client(
    'rekognition',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_DEFAULT_REGION_NAME
)
def compare_faces_for_checkin(target, source):
    # response = client.compare_faces(
    # SourceImage={
    #     'Bytes': b'bytes',
    #     'S3Object': {
    #         'Bucket': 'string',
    #         'Name': 'string',
    #         'Version': 'string'
    #     }
    # },
    #     TargetImage={
    #         'Bytes': b'bytes',
    #         'S3Object': {
    #             'Bucket': 'string',
    #             'Name': 'string',
    #             'Version': 'string'
    #         }
    #     },
    #     SimilarityThreshold=...,
    #     QualityFilter='NONE'|'AUTO'|'LOW'|'MEDIUM'|'HIGH'
    # )
    return True