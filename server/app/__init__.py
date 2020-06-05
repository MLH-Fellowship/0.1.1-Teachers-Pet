from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

# Initialize the app
app = Flask(__name__, instance_relative_config=True)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app)

# Load the views
from app import views

# Load the config file
app.config.from_object('config')
