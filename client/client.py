import requests
import pyscreenshot
import argparse
from datetime import datetime
import time
from io import BytesIO


def init_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-c", "--client", help="video conferencing client app", required=True)
    parser.add_argument("-r", "--refresh",
                        help="refresh rate", required=True, type=int)
    return parser


def zoom(refresh_rate):
    time.sleep(10)  # Initial wait to let user switch
    url = 'http://ptsv2.com/t/fs64w-1591270553/post'
    while True:
        # Grab a Screenshot
        img_buffer = BytesIO()
        pyscreenshot.grab().save(img_buffer, 'PNG', quality=50)
        img_buffer.seek(0)

        files = {'media': (f'{datetime.now()}.png', img_buffer, 'image/png')}

        res = requests.post(url, files=files)
        print(res.text)

        time.sleep(refresh_rate)
    return


def main():
    parser = init_parser()
    args = parser.parse_args()
    if args.client == 'zoom':
        zoom(args.refresh)
    else:
        print(f'{args.client} is not supported currently')
    return


if __name__ == "__main__":
    main()
