"use strict";

var $ = require('jquery'),
    Backbone = require('backbone'),
    models = require('./models'),
    views = require('./views');

function display(view) {
  $('#main')
    .empty()
    .append(view.$el);
}

module.exports = Backbone.Router.extend({

  routes: {
    "": "listApps",
    "apps": "listApps",
    "apps/:name": "showApp",
    "apps/:name/new-job": "newJob",
    "apps/:name/jobs": "listJobs",
    "apps/:name/jobs/:slug": "showJob",
    "apps/:name/jobs/:slug/edit": "editJob"
  },

  listApps: function() {
    console.log("listApps");
    var apps = this.apps = new models.AppCollection();
    apps.fetch().success(function() {
      var view = new views.ListApps({collection: apps});
      display(view);
    });
  },

  showApp: function(name) {
    console.log("showApp");
    var app = new models.App({id: name});
    app.fetch().success(function() {
      var view = new views.ShowApp({model: app})
      display(view);
    });
  },

  listJobs: function(name) {
    console.log("listJobs");
    var app = new models.App({id: name});
    app.fetch().success(function() {
      app.jobs.fetch().success(function() {
        var view = new views.ListJobs({collection: app.jobs})
        display(view);
      });
    });
  },

  showJob: function(name, slug) {
    console.log("showJob");
    var job = new models.Job({app_name: name, slug: slug});
    job.fetch().success(function() {
      var view = new views.ShowJob({model: job})
      display(view);
    });
  },

});
