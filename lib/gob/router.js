"use strict";

var $ = require('jquery'),
    Backbone = require('backbone'),
    models = require('./models'),
    views = require('./views');

//var PageSlider = require('./utils/pageslider'),
//HomeView = require('./views/Home'),
//EmployeeView = require('./views/Employee'),
//ReportsView = require('./views/Reports'),
//models = require('./models/memory/employee'),
//slider = new PageSlider($('body')),
//homeView = new HomeView();

module.exports = Backbone.Router.extend({

  routes: {
    "": "listApps",
    "apps/:name": "showApp",
    "apps/:name/jobs": "listJobs",
    "apps/:name/jobs/:slug": "showJob"
  },

  listApps: function() {
    console.log("listApps");
    var view = new views.Index();
    this.display(view);
  },

  showApp: function(name) {
    console.log("showApp");
    var app = new models.App({id: name});
    app.fetch().success(function() {
      var view = new views.ShowApp({model: app})
      this.display(view);
    });
  },

  listJobs: function(name) {
    console.log("listJobs");
    var app = new models.App({id: name});
    app.jobs.fetch().success(function() {
      var view = new views.ListJobs({collection: app.jobs})
      this.display(view);
    });
  },

  showJob: function(name, slug) {
    console.log("showJob");
    var job = new models.Job({app_name: name, slug: slug});
    job.fetch().success(function() {
      var view = new views.ShowJob({model: job})
      this.display(view);
    });
  },

  display: function(view) {
    $('#main')
      .empty()
      .append(view.$el);
  }

});
