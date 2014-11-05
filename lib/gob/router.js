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
    "apps/": "listApps",
    "apps/:name/": "showApp",
    "apps/:name/jobs/": "listJobs",
    "apps/:name/jobs/new": "newJob",
    "apps/:name/jobs/:slug/": "showJob",
    "apps/:name/jobs/:slug/edit": "editJob"
  },

  listApps: function() {
    console.log("listApps");
    var apps = this.apps = new models.AppCollection();
    apps.fetch().always(function() {
      var view = new views.ListApps({collection: apps});
      display(view);
    });
  },

  showApp: function(name) {
    console.log("showApp");
    var app = new models.App({id: name});
    app.fetch().always(function() {
      var view = new views.ShowApp({model: app})
      display(view);
    });
  },

  listJobs: function(name) {
    console.log("listJobs");
    var app = new models.App({id: name});
    app.fetch().always(function() {
      app.jobs.fetch().always(function() {
        var view = new views.ListJobs({collection: app.jobs})
        display(view);
      });
    });
  },

  newJob: function(name, slug) {
    console.log("newJob");
    var app = new models.App({id: name});
    app.fetch().always(function() {
      var job = new models.Job({app: app});
      var view = new views.EditJob({model: job})
      display(view);
    });
  },

  showJob: function(name, slug) {
    console.log("showJob");
    var job = new models.Job({app_name: name, slug: slug});
    job.fetch().always(function() {
      var view = new views.ShowJob({model: job})
      display(view);
    });
  },

  editJob: function(name, slug) {
    console.log("editJob");
    var job = new models.job({app_name: name, slug: slug});
    job.fetch().always(function() {
      var view = new views.EditJob({model: job})
      display(view);
    });
  },

});
