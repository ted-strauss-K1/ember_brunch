App = require 'app'

module.exports = App.Meter = DS.Model.extend
    hole: DS.attr 'string'
    project: DS.attr 'string'
    from: DS.attr 'number'
    to: DS.attr 'number'
    #publishedAt: DS.attr 'date'
    #{"hole": "GR-10-42", "project": "Granada", "from": "217.2", "to": "243", "unit": "m"}
