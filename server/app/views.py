from flask import render_template, Flask, request, send_from_directory, Response
from flask_cors import CORS, cross_origin
from app import app
from app.seg import *
import os
import json


@app.route('/')
@cross_origin()
def index():
    return render_template("index.html")


@app.route('/api/')
@cross_origin()
def api():
    root_dir = os.path.dirname(os.getcwd())
    base = os.path.join(root_dir, 'server/dummy.json')
    json_file = open(base,)
    dic = json.load(json_file)
    return Response(json.dumps(dic), mimetype='application/json')


@app.route('/images/<path:path>')
def send_image(path):
    root_dir = os.path.dirname(os.getcwd())
    base = os.path.join(root_dir, '../uploads/')
    print('##', path, root_dir, base)
    return send_from_directory(base, path)


@app.route('/upload', methods=['POST'])
def upload():
    if 'media' not in request.files:
        return 'Media not found'
    media = request.files['media']
    media.save(os.path.join('./uploads', media.filename))
    segment_image(f'./uploads/{media.filename}')
    os.remove(f'./uploads/{media.filename}')
    return 'ok'
