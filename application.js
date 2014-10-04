// Load jQuery and Backbone, make sure Backbone uses jQuery
var $ = require('jquery'),
    Backbone = require('backbone');

Backbone.$ = $;

// Configure helpers and partials for handlebars
var Handlebars = require("hbsfy/runtime");
Handlebars.registerHelper(require('./lib/gob/helpers'));

// Load our components and run the app
var models = require('./lib/gob/models'),
    Router = require('./lib/gob/router');

var router = new Router();

$(document).ready(function() {
  Backbone.history.start({pushState: true});
});

