from flask import render_template, request
from app import app
from app.seg import *
import os

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/upload', methods=['POST'])
def upload():
    if 'media' not in request.files:
        return 'Media not found'
    media = request.files['media']
    media.save(os.path.join('./uploads', media.filename))
    segment_image(f'./uploads/{media.filename}')
    os.remove(f'./uploads/{media.filename}')
    return 'ok'
