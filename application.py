from glob import glob, iglob
from subprocess import check_output
import os
from flask import Flask, render_template, request, jsonify, abort, json
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/apps", methods=['GET'])
def list():
    return jsonify(glob('repos/*.git'))

@app.route("/apps", methods=['POST'])
def create_app():
    data = request.get_json()
    if os.path.isdir('repos/%s.git' % data['name']):
        return json.dumps({'error': 'App already exists'}), 400, []

    check_output('./create-repo.sh %s' % data['name'], shell=True)
    with open('repos/%s.json' % data['name'], 'w') as fp:
        json.dump(data, fp)

    data['repo_url'] = repo_url(data['name'])
    return json.dumps(data), 201, []

@app.route("/apps/<name>", methods=['GET'])
def show_app(name):
    if not os.path.isdir('repos/%s.git' % name):
        abort(404)

    with open('repos/%s.json' % name) as fp:
        data = json.load(fp)

    data['repo_url'] = repo_url(name)
    return json.dumps(data)

@app.route("/apps/<name>", methods=['DELETE'])
def delete_app(name):
    if not os.path.isdir('repos/%s.git' % name):
        abort(404)

    check_output('./delete-repo.sh %s' % name, shell=True)
    return 'Deleted', 204, []

@app.route("/apps/<name>/build", methods=['POST'])
def build_app(name):
    if not os.path.isdir('repos/%s.git' % name):
        abort(404)

    with open('repos/%s.json' % name) as fp:
        app_config = json.load(fp)

    data = request.get_json()
    cmd = './build-repo.sh %s "%s" "%s"' % (
        name,
        json.dumps(data).replace('"', '\\"'),
        json.dumps(app_config).replace('"', '\\"'))
    print cmd
    return check_output(cmd, shell=True)

def repo_url(name):
    return "git://%s/%s.git" % (request.host, name)

if __name__ == "__main__":
    app.run(debug=True)
