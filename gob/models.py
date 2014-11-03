from gob import utils, APP_PATH
from glob import iglob
from flask import json, abort
from os.path import basename, dirname, splitext
import os
import shutil
import git


def all_apps():
    repo_names = map(
        lambda x: splitext(basename(x))[0],
        iglob(utils.repo_path('*')))

    ret = list()
    for name in repo_names:
        ret.append(get_app(name))

    return ret


def get_app(name):
    if not os.path.isdir(utils.repo_path(name)):
        raise DoesNotExist("The app '%s' does not exist" % name)

    repo = git.Repo(utils.repo_path(name))
    try:
        raw = repo.tree()["gob.json"].data_stream.read()
        try:
            data = json.loads(raw)
            data['status'] = 'ready'
        except ValueError:
            data = {
                'status': 'error',
                'error': 'The JSON config file has problems'
            }
    except (KeyError, ValueError):
        data = {'status': 'setup'}

    data['name'] = name
    data['repo_url'] = utils.repo_url(name)
    return data


def delete_app(name):
    get_app(name)
    shutil.rmtree(utils.repo_path(name))


def get_app_thumb(name):
    app = get_app(name)

    if 'thumb' not in app:
        raise DoesNotExist("The app's config does not contain a thumb[nail]")

    repo = git.Repo(utils.repo_path(name))
    try:
        return repo.tree()[app['thumb'].lstrip('/')].data_stream
    except KeyError:
        raise DoesNotExist(
            "The file '%s' does not exist in the app repo" % app['thumb'])


def get_app_or_404(name):
    return _or_404(get_app, args=[name])


def delete_app_or_404(name):
    return _or_404(delete_app, args=[name])


def get_app_thumb_or_404(name):
    return _or_404(get_app_thumb, args=[name])


def create_app(name):
    if os.path.isdir(utils.repo_path(name)):
        raise AlreadyExists("The app '%s' already exists" % name)

    repo = git.Repo.init(utils.repo_path(name), bare=True, shared=True)
    config = repo.config_writer()
    config.set('receive', 'denyNonFastForwards', False)
    config.write()
    os.symlink(
        os.path.join(APP_PATH, 'hooks', 'post-receive'),
        os.path.join(utils.repo_path(name), 'hooks', 'post-receive'))

    return get_app(name)


def is_app_ready(name):
    app = get_app(name)
    return app['status'] == 'ready'


def all_jobs(app='*'):
    jobs = map(
        lambda x: (basename(dirname(x)), splitext(basename(x))[0]),
        iglob(utils.job_json_path(app, '*')))

    ret = list()
    for app, slug in jobs:
        ret.append(get_job(app, slug))

    return ret


def get_job(app_name, slug):
    fname = utils.job_json_path(app_name, slug)

    if not os.path.exists(fname):
        raise DoesNotExist(
            "The job '%s' for app '%s' does not exist" % (slug, app_name))

    with open(fname) as fp:
        return json.load(fp)


def get_job_or_404(*args):
    return _or_404(get_job, args=args)


def save_job(data):
    # make sure the app is ready
    app = get_app(data['app_name'])

    if app['status'] != 'ready':
        raise ConfigError("The App '%s' is not ready" % data['app_name'])

    fname = utils.job_json_path(data['app_name'], data['slug'])
    with open(fname, 'w') as fp:
        json.dump(data, fp)


def create_job(data):
    fname = utils.job_json_path(data['app_name'], data['slug'])

    if os.path.exists(fname):
        raise AlreadyExists(
            "The job '%s' for app '%s' already exists" % (
                data['app_name'], data['slug']))

    return save_job(data)


def _or_404(func, args=[]):
    try:
        return func(*args)
    except DoesNotExist:
        abort(404)


class AlreadyExists(Exception):
    pass


class DoesNotExist(Exception):
    pass


class ConfigError(Exception):
    pass
