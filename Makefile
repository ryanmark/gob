name=`basename $(PWD)`
env=$(PWD)/env

ifdef WORKON_HOME
	env=$(WORKON_HOME)/$(name)
endif

all: setup build

setup:
	@echo "\nInstalling stuff...\n"
	virtualenv --clear $(env)
	pip install -r requirements.txt
	npm install
	@echo "\nDone!"

build:
	@echo "\nBuilding...\n"
	./node_modules/.bin/browserify application.js -o gob/static/app.js
	@echo "\nDone!"

server:
	@echo "\nStarting watchers and dev server...\n"
	(./node_modules/.bin/watchify application.js -o gob/static/app.js -v &)
	(./run_server.sh &)
	$(env)/bin/python application.py
	@echo "\nDone!"
