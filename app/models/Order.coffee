App = require 'app'

module.exports = App.Order = DS.Model.extend
    name: DS.attr 'string'
    orderid: DS.attr 'number'
    created: DS.attr 'date'
    starting: DS.attr 'date'
    camera: DS.attr 'number'
    trailer: DS.attr 'number'
    client_id: DS.attr 'string'
    author: DS.attr 'string'
    site: DS.attr 'number'
    status: DS.attr 'boolean'
    unit: DS.attr 'string'
    active: DS.attr 'string'
    cubes: DS.hasMany("App.Cube")
    #responsible: DS.attr 'string'
    #geologist: DS.attr 'string'