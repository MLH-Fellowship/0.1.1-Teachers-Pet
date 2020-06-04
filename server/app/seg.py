import cv2
# import matplotlib.pyplot as plt
import numpy as np
from app.bucket import *
import os
from datetime import datetime
import hashlib
# %matplotlib inline

UPLOAD_FOLDER = '~/root/uploads'


def segment_image(img_name):

    img = cv2.imread(img_name)
    oh, ow = img.shape[:2]

    width = 1920
    height = int(1920*9/16)
    dim = (width, height)
    # resize image
    img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)

    lower_g = np.array([0, 200, 0], dtype="uint16")
    upper_g = np.array([50, 255, 50], dtype="uint16")
    g_mask = cv2.inRange(img, lower_g, upper_g)
    g_mask = 255 - g_mask
    img = cv2.bitwise_and(img, img, mask=g_mask)

    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = img.shape[:2]
    kernel = np.ones((15, 15), np.uint8)
    e = cv2.erode(img, kernel, iterations=1)
    d = cv2.dilate(e, kernel, iterations=1)
    ret, th = cv2.threshold(d, 0, 1, cv2.THRESH_BINARY)
    # plt.imshow(th, cmap='gray')
    # plt.show()

    contours, hierarchy = cv2.findContours(
        th, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    areas = [cv2.contourArea(c) for c in contours]
    print(areas)
    filtered_contours = []

    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        # filtering contours with approximately 16/9 ratio
        # and min area of 35000
        if (1.9 > (w/h) > 1.5) and cv2.contourArea(c) > 35000:
            filtered_contours.append(c)

    areas = [cv2.contourArea(c) for c in filtered_contours]
    print(sorted(areas))
    avg_area = sum(areas) / len(areas)
    rng = 20000
    print(avg_area, len(areas))

    h, w = img.shape[:2]
    og_img = cv2.imread(img_name)
    oh, ow = og_img.shape[:2]
    i = 1
    t = hashed(img_name)
    storage(og_img, t, 'original.png')
    for c in filtered_contours:
        # if avg_area - rng < cv2.contourArea(c) < avg_area + rng:
        x, y, iw, ih = cv2.boundingRect(c)
        x = int(x*ow/w)
        y = int(y*oh/h)
        iw = int(iw*ow/w)
        ih = int(ih*oh/h)
        # cv2.rectangle(img, (x, y), (x+w, y+h), (255, 255, 255), 3)
        # convert this coords to points on original image
        cropped_img = og_img[y:y+ih, x:x+iw]
        # plt.imshow(cropped_img)
        # plt.show()
        # b_img = cv2.imencode('.png', cropped_img)[1].tostring()
        storage(cropped_img, t, f'part-{i}.png')
        # cv2.imwrite(f'./uploads/output/{i}.png', cropped_img)
        print(i)
        i += 1
    return


def storage(image, dir_name, img_name):
    upload_path = f'{UPLOAD_FOLDER}/{dir_name}'
    if os.environ['USE_BUCKET'] == 'True':
        b_img = cv2.imencode('.png', image)[1].tostring()
        put_bucket(b_img, f'{dir_name}/{img_name}')
    else:
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
        cv2.imwrite(f'{upload_path}/{img_name}', image)
    return


def hashed(img):
    BUF_SIZE = 65536  # lets read stuff in 64kb chunks!
    sha1 = hashlib.sha1()
    with open(img, 'rb') as f:
        while True:
            data = f.read(BUF_SIZE)
            if not data:
                break
            sha1.update(data)
    return sha1.hexdigest()
