App = require 'app'

#module.exports = App.OrdersRoute = Em.Route.extend
#    model: () ->
#        App.Order.find()

module.exports = App.OrdersIndexRoute = Em.Route.extend
    model: () ->
        App.Order.find()

#module.exports = App.OrdersIndexRoute = Em.Route.extend(model: ->
#  @modelFor "orders"
#)

#module.exports = App.OrdersCubeRoute = Em.Route.extend
#    model: (params) ->
#        App.Cube.find params.orderid
#    serialize: (model) ->
#        i = model.get("id")
#        t = model.get("cube_id")
#        orderid: i
#        title: dasherize(t)


#module.exports = App.OrderRoute = Em.Route.extend
#    model: (params) ->
#        console.log("params %o", params)
#        App.Order.find(params.order_id)


    #serialize: (model) ->
            #console.log("serializer model %o", model)            
            #order_id : model.get("id")
            #listing_id : model.get("listing_id")            

        
