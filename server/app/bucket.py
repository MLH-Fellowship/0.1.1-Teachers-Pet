import boto3
import os


def put_bucket(image, img_name):
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name='nyc3',
                            endpoint_url=os.environ['ENDPOINT'],
                            aws_access_key_id=os.environ['KEYID'],
                            aws_secret_access_key=os.environ['ACCESSKEY'])  # noqa

    client.put_object(Bucket=os.environ['BUCKET'],
                      Key=img_name,
                      Body=image,
                      ACL='private')
    return
