App = require 'app'

module.exports = App.CubeController = Ember.ObjectController.extend
    isEditing: no

    doneEditing: ->
        @set 'isEditing', no
        @get("store").commit()
        @get("target.router").transitionTo "cubes.index"
    edit: ->
        @set 'isEditing', yes   
    #getmeters: ->
    #    @get("model").get("meters").objectAt(0)         
    #getmets: ->
    #    model = @get("model")
    #    metlist = model.get("meters").mapProperty("hole")
    #    metlist
    #    .property("model.meters")       
      
  