App = require 'app'

module.exports = App.MetersRoute = Em.Route.extend
    model: ->
        App.Meter.find()