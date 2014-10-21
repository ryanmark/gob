"use strict";

var $ = require('jquery'),
    Backbone = require('backbone'),
    models = require('../models');

function isathing(thing) {
  return typeof(thing) != 'undefined';
}

module.exports = Backbone.View.extend({
  events: {
    'click a': 'handleLink'
  },

  initialize: function(args) {
    if(isathing(this.beforeInit))
      this.beforeInit(args);

    if(isathing(this.render)) {
      if(isathing(this.collection))
        this.collection.on("sync", this.render, this);
      else if(isathing(this.model))
        this.model.on("sync", this.render, this);
      this.render();
    }

    if(isathing(this.afterInit))
      this.afterInit(args);
  },

  handleLink: function(eve) {
    eve.preventDefault();
    eve.stopPropagation();
    Backbone.history.navigate(
      $(eve.currentTarget).attr('href'),
      {trigger: true});
  },

  render: function() {
    var obj;
    if(isathing(this.collection)) obj = this.collection;
    else if(isathing(this.model)) obj = this.model;

    if(isathing(this.beforeRender))
      this.beforeRender(obj);

    console.log(obj);
    this.$el.html(this.template(obj));

    if(isathing(this.afterRender))
      this.afterRender(obj);

    return this;
  }
});

