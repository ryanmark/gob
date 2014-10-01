import gob
import os
from flask import request
from datetime import datetime


def repo_url(name):
    return "git://%s/%s.git" % (request.host, name)


def repo_path(name):
    return os.path.join(gob.REPO_PATH, name + '.git')


def repo_json_path(name):
    return os.path.join(gob.REPO_PATH, name + '.json')


def working_path(name):
    return os.path.join(gob.WORKING_PATH, name)


def job_json_path(app_name, slug):
    return os.path.join(gob.JOB_PATH, app_name, slug + '.json')


def timestamp():
    return datetime.now().strftime("%Y%m%d-%H%M")
