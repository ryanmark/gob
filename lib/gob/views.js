"use strict";

var $ = require('jquery'),
    Backbone = require('backbone'),
    models = require('./models');


exports.ShowApp = Backbone.View.extend({
  template: require('./templates/app.ejs'),

  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    console.log("ListApps end render");
    return this;
  },

  events: {
    'click .list-jobs': 'listJobs',
    'click .create-job': 'createJob',
    'click .delete': 'del'
  },

  listJobs: function() {},
  createJob: function() {},
  del: function() {}
});

exports.ListApps = Backbone.View.extend({
  template: require('./templates/app_list.ejs'),

  initialize: function () {
      this.render();
      this.collection.on("sync", this.render, this);
  },

  render: function () {
      console.log(this.collection.toJSON());
      this.$el.html(this.template({items: this.collection.toJSON()}));
      console.log("ListApps end render");
      return this;
  },

  events: {
    'click .create-app': 'createApp'
  },

  createApp: function() {}
});

exports.Index = Backbone.View.extend({
  template: require('./templates/index.ejs'),

  initialize: function() {
    console.log('init index');
    var apps = this.apps = new models.AppCollection();
    apps.fetch().success(function() {
      console.log('success!');
      console.log(apps.models);
    });
    this.render();
  },
  render: function() {
    this.$el.html(this.template());
    this.listView = new exports.ListApps({collection: this.apps, el: $(".content", this.el)});
    return this
  }
});
