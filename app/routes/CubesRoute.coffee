App = require 'app'

module.exports = App.CubesRoute = Em.Route.extend
    model: () ->
        App.Cube.find()
        #@modelFor "cube"
        
#module.exports = App.CubeRoute = Em.Route.extend
#    serialize: (model) ->
#        order_id: model.get("orderid")
#        cube_id: model.get("cube_id")
        
    #model: (params) ->
    #    console.log("cube router %o",params)
    #    App.Cube.all().findProperty "order", params.cube_order
    

    #model: ->
    #    App.Cube.find { order: params.orderid }