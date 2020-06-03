import cv2
# import matplotlib.pyplot as plt
import numpy as np
# %matplotlib inline

img = cv2.imread("test.png", 0)
oh, ow = img.shape[:2]

width = 1920
height = int(1920*9/16)
dim = (width, height)
# resize image
img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
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
og_img = cv2.imread("test.png")
oh, ow = og_img.shape[:2]
i = 1
for c in filtered_contours:
    if avg_area - rng < cv2.contourArea(c) < avg_area + rng:
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
        cv2.imwrite(f'output/{i}.png', cropped_img)
        i += 1
