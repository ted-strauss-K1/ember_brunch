App = require 'app'

module.exports = App.PostsIndexController = Em.ArrayController.extend();

module.exports = App.PostController = Ember.ObjectController.extend
    isEditing: no

    doneEditing: ->
        @set 'isEditing', no
        @get("store").commit()
        @get("target.router").transitionTo "posts.index"
    edit: ->
        @set 'isEditing', yes       
  