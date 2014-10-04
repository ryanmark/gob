"use strict";

var Backbone = require('backbone');

exports.AppCollection = Backbone.Collection.extend({ url: '/apps' })
