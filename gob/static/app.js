(function() {
  window.Gob = window.Gob || {};

  Gob.App = Backbone.Model.extend({
  });

  Gob.Apps = Backbone.Collection.extend({
    url: '/apps',
    model: Gob.App
  })
})();
