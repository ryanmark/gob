"use strict";

var $ = require('jquery'),
    Backbone = require('backbone'),
    models = require('./models'),
    BaseView = require('./views/BaseView');

module.exports = {
  ListApps: BaseView.extend({
    template: require('./templates/app_list.ejs'),
    beforeRender: function() {
      $('.modal').modal('hide');
    }
  }),
  ShowApp: BaseView.extend({
    template: require('./templates/app.ejs'),
  }),
  ListJobs: BaseView.extend({
    template: require('./templates/job_list.ejs'),
  }),
  EditJob: BaseView.extend({
    template: require('./templates/job_edit.ejs'),
  }),
  ShowJob: BaseView.extend({
    template: require('./templates/job.ejs'),
  })
};
