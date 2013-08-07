# ===== Namespace =====
App = require 'app'

# ===== Precompile nested routes =====
#this file will be called cubes.handlebars nested under the "orders" directory, nested under the "templates" directory
#tmpl = Ember.Handlebars.precompile("{{outlet}}")
#Ember.TEMPLATES["orders/index"] = Ember.Handlebars.template(tmpl)

# ===== Router =====
App.Router.map ->
    # put your routes here
    @resource 'about'
    @resource 'posts', ->
      @resource 'post', {path: ':post_id'}
    @resource 'cubes', ->
      @resource 'cube', {path: ':cube_id'}
    @resource 'orders', ->
      @resource 'order', {path: '/:order_id'}
      #@route 'cubes', {path: ':order_id/cubes'}
      #@route 'order', {path: ':order_id'}
      

# ====== Server REST =======
#require 'serv/models/post'
#require 'serv/models/user'

# ===== Routes =====
require 'routes/IndexRoute'
require 'routes/PostsRoute'
require 'routes/CubesRoute'
require 'routes/OrdersRoute'
#require 'routes/MetersRoute'

# ===== Models =====
#require 'models/Meter'
require 'models/Cube'
require 'models/Post'
require 'models/Order'


# ===== Store =====
App.Adapter = DS.RESTAdapter.extend(
 serializer: DS.RESTSerializer.extend(
  primaryKey: (type) -> "id"
  )
)
#App.Adapter.map App.Cube,
#  meters: {embedded: 'always'} # 'load'|'always'
  
DS.RESTAdapter.reopen({url: 'http://localhost:3000'});
App.Store = DS.Store.extend(
  revision: 12
  adapter: App.Adapter
)



### 2
App.Store = DS.Store.extend
    revision: 12
App.Adapter = DS.RESTAdapter.extend
  url: 'http://localhost:3000'
DS.RESTAdapter.reopen({url: 'http://localhost:3000'});
###
# ===== Fixtures =====
require 'fixtures/posts'

# ===== Views =====

# ===== Controllers =====
require 'controllers/PostController'
require 'controllers/CubeController'
require 'controllers/OrderController'

# ===== Template Helpers =====
require 'helpers/date'
require 'helpers/markdown'

# ===== Templates =====
#require 'templates/index'
require 'templates/about'
require 'templates/posts'
require 'templates/posts/index'
require 'templates/post'
require 'templates/post/_edit'
require 'templates/cubes'
require 'templates/cubes/index'
require 'templates/cube'
require 'templates/cube/_edit'
require 'templates/orders'
require 'templates/orders/index'
require 'templates/orders/cubes'
require 'templates/order'
require 'templates/order/_edit'
require 'templates/application'
#require 'templates/'

