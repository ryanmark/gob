"use strict";

var Backbone = require('backbone');

exports.Job = Backbone.Model.extend({
  initialize: function(args) {
    if(_.isObject(args.app)) {
      this.app = args.app;
    } else if(!_.isUndefined(args.app_name)) {
      this.app = new exports.App({name: app_name});
    }
    this.urlRoot = this.app.url() + '/jobs/';
  }
})
exports.JobCollection = Backbone.Collection.extend({
  initialize: function(models, opts) {
    this.app = opts.app;
    this.url = this.app.url() + '/jobs/';
  },
  model: exports.Job,
  url: function() { return this.app.url() + '/jobs/'; }
})
exports.App = Backbone.Model.extend({
  initialize: function() {
    this.jobs = new exports.JobCollection([], { app: this });
  },
  urlRoot: '/apps/'
})
exports.AppCollection = Backbone.Collection.extend({
  url: '/apps/',
  model: exports.App
})
