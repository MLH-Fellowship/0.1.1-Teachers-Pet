#gaze tracking https://github.com/antoinelame/GazeTracking


import numpy as np
import argparse
import matplotlib.pyplot as plt
import cv2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import MaxPooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from gaze_tracking import GazeTracking
import os
import dlib
from flask import Flask, request, Response
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
app = Flask(__name__)


detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('shape_68.dat')

left = [36, 37, 38, 39, 40, 41]
right = [42, 43, 44, 45, 46, 47]

gaze = GazeTracking()
kernel = np.ones((9, 9), np.uint8)

cv2.ocl.setUseOpenCL(False)

@app.route('/analyze', methods=['POST'])
def analysis():

    img = cv2.imdecode(np.frombuffer(request.data, np.uint8),flags=1)
    cv2.imwrite('newoutput.jpg', img)

    # We send this frame to GazeTracking to analyze it
    gaze.refresh(img)
    img = gaze.annotated_frame()
    text = ""
    if gaze.is_blinking() or gaze.is_right() or gaze.is_left():
        text = "Pag attention!"
    elif gaze.is_center():
        text = "Looking @ Screen"
    return text


app.run(host="0.0.0.0", port=5000)
