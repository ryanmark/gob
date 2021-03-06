import mimetypes
from subprocess import check_output
from flask import render_template, request, jsonify, json, redirect

from gob import app, models

HEDS = {'Content-Type': 'application/json'}


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/apps/", methods=['GET'])
def list_apps():
    if not request_wants_json():
        return index()
    return json.dumps(models.all_apps()), 200, HEDS


@app.route("/apps/", methods=['POST'])
def create_app():
    data = request.get_json()
    print data

    try:
        ret = models.create_app(data['name'])
    except models.AlreadyExists:
        return (
            json.dumps({'error': 'App already exists'}),
            400, HEDS)

    return json.dumps(ret), 201, HEDS


@app.route("/apps/<name>/", methods=['GET'])
def show_app(name):
    if not request_wants_json():
        return index()
    return jsonify(models.get_app_or_404(name))


@app.route("/apps/<name>/thumb", methods=['GET'])
def app_thumb(name):
    try:
        app = models.get_app(name)
        thumb = models.get_app_thumb(name).read()
        mimetype = mimetypes.guess_type(app['thumb'])[0]
        return thumb, 200, {'Content-Type': mimetype}
    except models.DoesNotExist:
        return redirect('/static/gray.gif')


@app.route("/apps/<name>/", methods=['DELETE'])
def delete_app(name):
    models.delete_app_or_404(name)
    return 'Deleted', 204, []


@app.route("/apps/<name>/jobs/new")
def new_app(name):
    return index()


@app.route("/apps/<name>/jobs/", methods=['GET'])
def list_job(name):
    if not request_wants_json():
        return index()

    if not models.is_app_ready(name):
        return json.dumps({'error': 'App is not ready'}), 400, HEDS

    ret = models.all_jobs(name)
    return json.dumps(ret), 200, HEDS


@app.route("/apps/<name>/jobs/", methods=['POST'])
def create_job(name):
    if not models.is_app_ready(name):
        return json.dumps({'error': 'App is not ready'}), 400, HEDS

    data = request.get_json()
    ret = create_job(data)
    return json.dumps(ret), 201, HEDS


@app.route("/apps/<name>/jobs/<slug>/", methods=['GET'])
def show_job(name, slug):
    if not request_wants_json():
        return index()
    return jsonify(models.get_job_or_404(name, slug))


@app.route("/apps/<name>/jobs/<slug>/run", methods=['POST'])
def run_job(name, slug):
    app_config = models.get_job_or_404(name, slug)

    data = request.get_json()
    cmd = './job-repo.sh %s "%s" "%s"' % (
        name,
        json.dumps(data).replace('"', '\\"'),
        json.dumps(app_config).replace('"', '\\"'))
    return check_output(cmd, shell=True)
    return jsonify(models.get_job_or_404(name, slug))


@app.route("/apps/<name>/jobs/<slug>/edit")
def edit_job(name, slug):
    return index()


def request_wants_json():
    best = request.accept_mimetypes \
        .best_match(['application/json', 'text/html'])
    return best == 'application/json' and \
        request.accept_mimetypes[best] > \
        request.accept_mimetypes['text/html']
