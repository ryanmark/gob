import os

APP_PATH = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
DATA_PATH = os.path.join(APP_PATH, 'data')
REPO_PATH = os.path.join(DATA_PATH, 'repos')
WORKING_PATH = os.path.join(DATA_PATH, 'working')
JOB_PATH = os.path.join(DATA_PATH, 'jobs')

from flask import Flask
app = Flask(__name__)

import views
