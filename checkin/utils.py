import boto3

def compare_faces_for_checkin(target, source):
    response = client.compare_faces(
    SourceImage={
        'Bytes': b'bytes',
        'S3Object': {
            'Bucket': 'string',
            'Name': 'string',
            'Version': 'string'
        }
    },
        TargetImage={
            'Bytes': b'bytes',
            'S3Object': {
                'Bucket': 'string',
                'Name': 'string',
                'Version': 'string'
            }
        },
        SimilarityThreshold=...,
        QualityFilter='NONE'|'AUTO'|'LOW'|'MEDIUM'|'HIGH'
    )
    return True