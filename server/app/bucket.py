import boto3


def put_bucket(image, img_name):
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name='nyc3',
                            endpoint_url='https://nyc3.digitaloceanspaces.com',
                            aws_access_key_id='G55BPTQOTP7JNGDJGPQ3',
                            aws_secret_access_key='DwGpX8Fxet6nj4lBUQ8l6b3eL3OLB08c9pAZaMqLL+c')  # noqa

    client.put_object(Bucket='pod-0-1-1',
                      Key=img_name,
                      Body=image,
                      ACL='private')
    return
