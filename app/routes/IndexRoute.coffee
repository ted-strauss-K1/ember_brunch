App = require 'app'

module.exports = App.IndexRoute = Ember.Route.extend
  redirect: ->
    @transitionTo 'posts'
 